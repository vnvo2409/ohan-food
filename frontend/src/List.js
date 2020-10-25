import { axios } from './Utils';
import React, { useState, useEffect } from 'react';

export default function List() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const FetchList = async () => {
            try {
                const value = await axios.get("/");
                setProducts(value.data);
            } catch (error) {
                alert("Can not fetch");
                console.log(error);
            }
        };
        FetchList();
    }, []);

    const DeleteProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.delete("/admin/" + e.target.value, { withCredentials: true });
            alert("Delete Successful");
        } catch (error) {
            alert("Can not delete");
            console.log(error);
        }
    }

    return (
        <div>
            <ul>
                {products.map(product => (
                    <li key={product["id"]}>
                        {product["name"]}
                        <br />
                        <button value={product["id"]} onClick={DeleteProduct}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
