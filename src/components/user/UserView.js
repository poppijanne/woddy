import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useForm } from 'react-hook-form';
import UserService from "../../services/UserService";
import User from "../../data/User";
import ErrorMessage from "../common/ErrorMessage";
import "./UserView.css";
import Message from "../common/Message";
import { useHistory } from "react-router-dom";

export default function UserView() {

    const [page, setPage] = useState("start");
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    

    const login = async data => {
        const service = new UserService();
        const response = await service.login(data["login-email"], data["login-pass"]);
        if (response.error) {
            setError(response.error.message);
        }
        else {
            dispatch({
                type: "SET USER", payload: new User(response.user)
            });
            setError(null);
        }
    }

    const registerNewUser = async data => {
        const service = new UserService();
        const response = await service.registerNewUser({
            name: data["register-name"],
            email: data["register-email"],
            pass: data["register-pass"]
        });

        if (response.error) {
            setError(response.error.message);
        }
        else {
            dispatch({
                type: "SET USER", payload: new User(response.user)
            });
            setError(null);
        }
    }

    const logout = async e => {

        const service = new UserService();
        const response = await service.logout();
        if (response.error) {
            setError(response.error.message);
        }
        else {
            dispatch({
                type: "SET USER", payload: null
            });
            setError(null);
            setPage("start");
        }
    }

    const saveUserSettings = async data => {
        const service = new UserService();

        const response = await service.saveUser({
            name: data["user-name"]
        });
        if (response.error) {
            setError(response.error.message);
        }
        else {
            dispatch({
                type: "SET USER", payload: new User(response.user)
            });
            setError(null);
            setPage("start");
            setInfo("Tietosi on tallennettu.");
        }
    }

    const sendLoginLink = async data => {
        const service = new UserService();
        const response = await service.sendLoginLink(data["login-link-email"]);
        if (response.error) {
            setError(response.error.message);
        }
        else {
            setInfo("Lähetin sinulle linkin, jonka kautta voit muuttaa salasanasi. Tarkista sähköpostisi. Postin lähetys voi kestää hetken.");
            setError(null);
        }
    }

    const openPasswordChangeView = async e => {
        setError(null);
        history.push(`/user/${user.userId}/password`);
    };

    if (user === null) {
        if (page === "start") {
            return (
                <div className="page">

                    <Message>Rekisteröidy jäseneksi, jos haluat tallentaa treeniohjelmasi.</Message>

                    <div className="form-row">
                        <button className="primary width-100" type="button" onClick={e => setPage("login")}>Kirjaudu sisään</button>
                        <br />
                        <button className="primary width-100" type="button" onClick={e => setPage("register")}>Haluan jäseneksi</button>
                        <br />
                        <button className="primary width-100" type="button" onClick={e => setPage("forgot-password")}>En muista salasanaani</button>
                    </div>

                </div>
            )
        }
        if (page === "login") {
            return (
                <div className="page">

                    <form onSubmit={handleSubmit(login)}>

                        <h2>Kirjaudu</h2>

                        {error !== null && <ErrorMessage message={error} />}
                        {info && <Message>{info}</Message>}

                        <div className="form-row">
                            <label>Sähköposti</label>
                            <input name="login-email" ref={register({ required: true })} type="email" placeholder="treeni@robotti.fi" />
                            {errors["login-email"] && <ErrorMessage message={'Sähköposti on pakollinen'} />}
                        </div>

                        <div className="form-row">
                            <label>Salasana</label>
                            <input name="login-pass" ref={register({ required: true })} type="password" />
                            {errors["login-pass"]?.type === "required" && <ErrorMessage message={'Salasana on pakollinen'} />}
                        </div>

                        <button className="primary width-100" type="submit">Kirjaudu</button>
                    </form>
                </div>
            )
        }
        if (page === "forgot-password") {
            return (
                <div className="page">

                    <form onSubmit={handleSubmit(sendLoginLink)}>

                        <h2>Ei hätää!</h2>

                        <Message>Sähköpostiosoitteesi avulla löydän jäsentietosi, ja pystyn lähettämään sinulle sähköpostissa linkin, jonka kautta voit vaihtaa salasanasi.</Message>

                        {error !== null && <ErrorMessage message={error} />}
                        {info !== null && <Message>{info}</Message>}

                        <div className="form-row">
                            <label>Sähköposti</label>
                            <input name="login-link-email" ref={register({ required: true })} type="email" placeholder="treeni@robotti.fi" />
                            {errors["login-link-email"] && <ErrorMessage message={'Tarvitsen sähköpostiosoitteen, jotta voin lähettää kirjautumislinkin'} />}
                        </div>

                        <button className="primary width-100" type="submit">Lähetä linkki sähköpostiini</button>
                    </form>

                </div>
            )
        }
        if (page === "register") {
            return (
                <div className="page">

                    <form onSubmit={handleSubmit(registerNewUser)}>

                        <h2>Rekisteröidy</h2>

                        {error && <ErrorMessage message={error} />}
                        {info && <Message>{info}</Message>}

                        <div className="form-row">
                            <label>Käyttäjätunnus</label>
                            <input name="register-name" ref={register({ required: true })} type="text" placeholder="Nimesi tai käyttäjätunnuksesi" />
                            {errors["register-name"] && <ErrorMessage message={'Nimi on pakollinen'} />}
                        </div>

                        <div className="form-row">
                            <label>Sähköposti</label>
                            <Message>Sähköpostiosoitettasi ei tallenneta selväkielisenä tietokantaan. Tästä syystä Treenirobotti ei koskaan lähetä sinulle sähköpostia.</Message>
                            <input name="register-email" ref={register({ required: true })} type="email" placeholder="Sähköpostisoitteesi" />
                            {errors["register-email"] && <ErrorMessage message={'Sähköpostiosoite on pakollinen'} />}
                        </div>

                        <div className="form-row">
                            <label>Salasana</label>
                            <input name="register-pass" type="password" ref={register({ required: true, minLength: 8 })} />
                            {errors["register-pass"]?.type === "required" && <ErrorMessage message={'Salasana on pakollinen'} />}
                            {errors["register-pass"]?.type === "minLength" && <ErrorMessage message={'Salasanan on oltava vähintään 8 merkkiä pitkä'} />}
                        </div>

                        <button className="primary width-100" type="submit">Rekisteröidy</button>
                    </form>

                </div>
            )
        }
    }

    return (
        <div className="page">
            <h2>Tervetuloa {user.name}</h2>
            <hr />
            <form onSubmit={handleSubmit(saveUserSettings)}>
                {error && <ErrorMessage message={error} />}
                {info && <Message>{info}</Message>}
                <div className="form-row">
                    <label>Nimi</label>
                    <input 
                        name="user-name" 
                        defaultValue={user.name} 
                        ref={register({ required: true })} 
                        type="text" 
                        placeholder="Nimesi tai käyttäjätunnuksesi" 
                    />
                    {errors["user-name"] && <ErrorMessage message={'Nimi on pakollinen'} />}
                </div>
                {/* 
                <div className="form-row">
                    <label>Uusi sähköposti</label>
                    <input name="user-email" defaultValue={user.email} ref={register()} type="email" placeholder="Sähköpostisoitteesi" />
                    {errors["user-email"] && <ErrorMessage message={'Sähköpostiosoite on pakollinen'} />}
                </div>
                */}
                <br/>
                <button className="primary width-100" type="submit">Tallenna muutokset</button>
            </form>
            <hr />
            <div>
                <button className="primary width-100" type="button" onClick={openPasswordChangeView}>Haluan vaihtaa salasanani</button>
            </div>            
            <hr />
            <div>
                <button className="primary width-100" type="button" onClick={logout}>Kirjaudu ulos</button>
            </div>
        </div>
    )


}