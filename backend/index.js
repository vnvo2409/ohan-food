import express from 'express';
import cors from 'cors';
import mysql from 'promise-mysql';
import body_parser from 'body-parser';
import cookie_parser from 'cookie-parser';
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

const TABLE_NAME = 'products';

const CreatePool = async () => {
    return await mysql.createPool({
        connectionLimit: 10,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        port: 3306,
    });
};

let pool = null;

const cors_options = {
    //To allow requests from client
    origin: process.env.FRONTEND_HOST,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ["Set-Cookie", "Access-Control-Allow-Credentials", "Access-Control-Allow-Origin"],
};

app.use(cors(cors_options));
app.use(body_parser.json());
app.use(cookie_parser());
app.use(morgan(':method :url :status'));

const GetProducts = async () => {
    try {
        if (!pool) {
            pool = await CreatePool();
        }
        return await pool.query(`SELECT id, kind, name, price, unit, weight, brand, origin FROM ${TABLE_NAME} ORDER BY id`);
    }
    catch (error) {
        throw error;
    }
};

const GetProduct = async (id) => {
    try {
        if (!pool) {
            pool = await CreatePool();
        }
        return await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`, id);
    } catch (error) {
        throw error
    }
};

app.get('/', async (req, res) => {
    try {
        const products = await GetProducts();
        res.json(products);
    } catch (error) {
        throw error
    }
});

app.get('/:product_id(\\d+)/', async (req, res) => {
    try {
        const product = await GetProduct(req.params["product_id"]);
        res.json(product);
    } catch (error) {
        throw error
    }
});

let admin_refress_token = null;

const verify = (req, res, next) => {
    let access_token = req.cookies.jwt;
    if (!access_token) {
        return res.sendStatus(403);
    }
    try {
        jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
        next()
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(401);
    }
};

app.post("/login", async (req, res) => {
    const hash = crypto.createHash('sha256');
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) return res.sendStatus(401);
    if (username != process.env.ADMIN_USERNAME || hash.update(password).digest("hex") != process.env.ADMIN_PASS_SHA256)
        return res.sendStatus(403);

    let payload = { username: process.env.ADMIN_USERNAME };
    let access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: parseInt(process.env.ACCESS_TOKEN_LIFE)
    });
    let refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: parseInt(process.env.REFRESH_TOKEN_LIFE)
    })
    admin_refress_token = refresh_token;
    res.cookie("jwt", access_token, { secure: process.env.HTTPS != undefined, httpOnly: true, sameSite: "none" });
    res.sendStatus(200);
    res.send();
});

app.post('/refresh', async (req, res) => {
    let access_token = req.cookies.jwt

    if (!access_token)
        return res.sendStatus(403);

    let payload;
    try {
        payload = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(401);
    }

    try {
        jwt.verify(admin_refress_token, process.env.REFRESH_TOKEN_SECRET)
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(401);
    }

    let new_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,
        {
            algorithm: "HS256",
            expiresIn: parseInt(process.env.ACCESS_TOKEN_LIFE)
        });

    res.cookie("jwt", new_token, { secure: process.env.HTTPS != undefined, httpOnly: true });
    res.send();
});

const ParseBody = (body) => {
    try {
        let product = {};
        product["kind"] = parseInt(body.kind);
        product["name"] = body.name;
        product["price"] = parseInt(body.price);
        product["unit"] = body.unit;
        product["weight"] = parseInt(body.weight);
        product["ingredient"] = body.ingredient;
        product["brand"] = body.brand;
        product["origin"] = body.origin;
        product["why"] = body.why;
        product["how"] = body.how;
        product["preservation"] = body.preservation;
        product["date"] = body.date != undefined ? parseInt(body.date) : null;
        return product;
    } catch (error) {
        throw product;
    }
};

app.post('/admin', verify, async (req, res) => {
    try {
        if (!pool) {
            pool = await CreatePool();
        }
        const product = ParseBody(req.body);
        const data = [product["kind"], product["name"], product["price"], product["unit"], product["weight"], product["ingredient"], product["brand"], product["origin"], product["why"], product["how"], product["preservation"], product["date"]];
        await pool.query(`INSERT INTO ${TABLE_NAME} (kind, name, price, unit, weight, ingredient, brand, origin, why, how, preservation, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?)`, data);
        res.sendStatus(200);
    } catch (error) {
        throw error;
    }
});

app.delete('/admin/:product_id(\\d+)/', verify, async (req, res) => {
    try {
        if (!pool) {
            pool = await CreatePool();
        }
        await pool.query(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, req.params["product_id"]);
        res.sendStatus(200);
    } catch (error) {
        throw error;
    }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
