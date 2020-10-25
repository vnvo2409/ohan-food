import React from "react";
import { useForm } from "react-hook-form";
import { axios } from './Utils';

export default function Login() {
    const { register, handleSubmit } = useForm();
    const onSubmit = async data => {
        try {
            const res = await axios.post('/login', data, { withCredentials: true });
            console.log(res.headers);
            alert("Login successful");
        } catch (error) {
            alert("Can not login");
            console.log(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Username</label>
            <br />
            <input name="username" ref={register({ required: true })} />
            <br />
            <label>Password</label>
            <br />
            <input name="password" type="password" ref={register({ required: true })} />
            <br />
            <input type="submit" />
        </form>
    );
};