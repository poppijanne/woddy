import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { useForm } from 'react-hook-form';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import UserService from "../../services/UserService";
import User from "../../data/User";
import ErrorMessage from "../common/ErrorMessage";
import "./UserView.css";

export default function ChangePasswordView() {

    const { userId } = useParams();
    const [serviceError, setServiceError] = useState(null);
    const dispatch = useDispatch();
    const { register, handleSubmit, errors, watch, setError } = useForm();
    const location = useLocation();
    const history = useHistory();

    const query = new URLSearchParams(location.search);
    const resetPasswordToken = query.get("token");

    const changePassword = async data => {

        if (data["new-pass"] !== data["confirm-pass"]) {
            setError("confirm-pass", { type: "manual", message: "Vahvistus ei täsmää." });
            return;
        }

        const service = new UserService();
        const response = resetPasswordToken ?
            await service.changePasswordWithToken(userId, resetPasswordToken, data["new-pass"]) :
            await service.changePassword(userId, data["old-pass"], data["new-pass"]);

        if (response.error) {
            setServiceError(response.error.message);
        }
        else {
            dispatch({
                type: "SET USER", payload: new User(response.user)
            })
            history.push(`/user/me`);
        }
    }

    return (
        <div className="page">
            <h2>Salasanan vaihto</h2>
            <hr />
            <form onSubmit={handleSubmit(changePassword)}>
                {serviceError && <ErrorMessage message={serviceError} />}

                {!resetPasswordToken &&
                    <div className="form-row">
                        <label>Vanha salasana</label>
                        <input name="old-pass" type="password" ref={register({ required: true })} />
                        {errors["old-pass"]?.type === "required" && <ErrorMessage message={'Nykyinen salasana on pakollinen'} />}
                    </div>
                }

                <div className="form-row">
                    <label>Uusi salasana</label>
                    <input name="new-pass" type="password" ref={register({ minLength: 8, required: true })} />
                    {errors["new-pass"]?.type === "required" && <ErrorMessage message={'Uusi salasana on pakollinen'} />}
                    {errors["new-pass"]?.type === "minLength" && <ErrorMessage message={'Uuden salasanan on oltava vähintään 8 merkkiä pitkä'} />}
                </div>

                <div className="form-row">
                    <label>Vahvista uusi salasana</label>
                    <input
                        name="confirm-pass"
                        type="password"
                        ref={register({ required: true })}
                    />
                    {errors["confirm-pass"]?.type === "required" && <ErrorMessage message={'Salasanan vahvistus on pakollinen'} />}
                    {errors["confirm-pass"]?.type === "manual" && <ErrorMessage message={errors["confirm-pass"]?.message} />}
                </div>

                <button className="primary width-100" type="submit">Tallenna uusi salasana</button>
            </form>
        </div>
    )
}