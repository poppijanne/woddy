import React, { useState, useEffect } from "react"
import "./FrontPageView.css";
import Workout from "../../data/Workout";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function FrontPageView() {

    const user = useSelector(state => state.user);
    const [step, setStep] = useState("start");
    const dispatch = useDispatch();
    const history = useHistory();

    const createNewWorkout = e => {
        const workout = new Workout({ author: user?.name });
        dispatch({ type: "SET WORKOUT", payload: workout });
        history.push(`/workout`);
    }

    const openMyWorkouts = e => {
        history.push(`/user/${user.userId}/workouts`);
    }

    useEffect(() => {

    }, []);

    return (
        <>
            {step === "start" &&
                <section className="front-page-step">
                    <div className="front-page-app-logo-container">
                        <img alt="Treenibotti logo" src="/images/treenirobotti-logo.svg" />
                        <h1>TREENIROBOTTI</h1>
                        <h2>WWW.TREENI.NET</h2>
                        <h3>Ilmainen treeniohjelmageneraattori ja ajastin</h3>
                    </div>
                    <br />
                    <div className="alert alert-danger">Olen vielä kehitysversio ja menen usein rikki!</div>
                    <hr />

                    <h2>Mitä tänään tehtäisiin?</h2>
                    <br />
                    <button className="call-to-action width-100" onClick={createNewWorkout}>LUO UUSI PÄIVÄN TREENI</button>
                    <br />
                    <br />
                    {user !== null &&
                        < button className="call-to-action width-100" onClick={openMyWorkouts}>VALITSE AIKAISEMPI TREENI</button>
                    }
                </section>
            }
            <footer id="front-page-footer">
                <div>Sovellusta kehittää Janne Kivilahti</div>
                <div>
                    <a href="https://www.linkedin.com/in/janne-kivilahti-92896b69" target="_blank">LinkedIn</a>
                </div>
            </footer>
        </>
    )
}