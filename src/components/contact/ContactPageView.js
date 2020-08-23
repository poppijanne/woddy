import React, { useState, useEffect } from "react"
import "./FrontPageView.css";
import Workout from "../../data/Workout";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import UserService from "../../services/UserService";
import { useForm } from "react-hook-form";

export default function FrontPageView() {

    const user = useSelector(state => state.user);
    const [step, setStep] = useState("start");
    const { register, handleSubmit, errors, watch, setError } = useForm();

    const submit = e => {
        const service = new UserService();
        service.sendMessage()
    }

    useEffect(() => {

    }, []);

    return (
        <>
            {step === "write-message" &&
                <section className="front-page-step">

                </section>
            }
        </>
    )
}