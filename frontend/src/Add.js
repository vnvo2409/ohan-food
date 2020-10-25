import React from "react";
import { useForm } from "react-hook-form";
import { axios } from './Utils';

export default function Add() {
    const { register, errors, handleSubmit } = useForm();
    const onSubmit = async data => {
        try {
            await axios.post('/admin', data, { withCredentials: true });
            alert("Add successful!");
        } catch (error) {
            alert("Can not add");
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Kind</label>
            <br />
            <input type="text" name="kind" ref={register({ required: true, pattern: /\d+/gi })} />
            {errors.kind?.type === "required" && (
                <p>Your input is required</p>
            )}
            {errors.kind?.type === "pattern" && (
                <p>Number only</p>
            )}
            <br />
            <label>Name</label>
            <br />
            <input type="text" name="name" ref={register({ required: true })} />
            {errors.name?.type === "required" && (
                <p>Your input is required</p>
            )}
            <br />
            <label>Price</label>
            <br />
            <input type="text" name="price" ref={register({ required: true, pattern: /\d+/gi })} />
            {errors.price?.type === "required" && (
                <p>Your input is required</p>
            )}
            {errors.price?.type === "pattern" && (
                <p>Number only</p>
            )}
            <br />
            <label>Unit</label>
            <br />
            <input type="text" name="unit" ref={register({ required: true })} />
            {errors.unit?.type === "required" && (
                <p>Your input is required</p>
            )}
            <br />
            <label>Weight</label>
            <br />
            <input type="text" name="weight" ref={register({ required: true, pattern: /\d+/gi })} />
            {errors.weight?.type === "required" && (
                <p>Your input is required</p>
            )}
            {errors.price?.type === "pattern" && (
                <p>Number only</p>
            )}
            <br />
            <label>Ingredient</label>
            <br />
            <input type="text" name="ingredient" ref={register({ required: true })} />
            {errors.ingredient?.type === "required" && (
                <p>Your input is required</p>
            )}
            <br />
            <label>Brand</label>
            <br />
            <input type="text" name="brand" ref={register({ required: true })} />
            {errors.brand?.type === "required" && (
                <p>Your input is required</p>
            )}
            <br />
            <label>Origin</label>
            <br />
            <input type="text" name="origin" ref={register({ required: true })} />
            {errors.origin?.type === "required" && (
                <p>Your input is required</p>
            )}
            <br />
            <label>Why</label>
            <br />
            <input type="text" name="why" ref={register({ required: true })} />
            {errors.why?.type === "required" && (
                <p>Your input is required</p>
            )}
            <br />
            <label>How</label>
            <br />
            <input type="text" name="how" ref={register({ required: true })} />
            {errors.how?.type === "required" && (
                <p>Your input is required</p>
            )}
            <br />
            <label>Preservation</label>
            <br />
            <input type="text" name="preservation" ref={register({ required: true })} />
            {errors.preservation?.type === "required" && (
                <p>Your input is required</p>
            )}
            <br />
            <label>Date</label>
            <br />
            <input type="text" name="date" ref={register({ required: true, pattern: /\d+/gi })} />
            {errors.date?.type === "required" && (
                <p>Your input is required</p>
            )}
            {errors.date?.type === "pattern" && (
                <p>Number only</p>
            )}
            <br />
            <input type="submit" />
        </form>
    );
};