import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faEdit } from '@fortawesome/free-solid-svg-icons'
import './TimerView.css';
import Time from "./Time";
import useTimeout from "../../hooks/useTimeout";
import CirquitEditor from "../workout/CirquitEditor";
import useLayoutHeight from "../../hooks/useLayoutHeight";
import useFontFitter from "../../hooks/useFontFitter";
import ExerciseSideBar from "../common/ExerciseSideBar";
import CirquitSideBar from "../common/CirquitSideBar";
import WorkoutService from "../../services/WorkoutService";
import Workout from "../../data/Workout";
import CirquitDetails from "../workout/CirquitDetails";
import Message from "../common/Message";

export default function TimerView() {

    //console.log("Timer()")

    const [edit, setEdit] = useState(false)
    let { timer, workout, tick } = useTimeout();
    const { workoutId, cirquitId } = useParams();
    const dispatch = useDispatch();

    const loadWorkout = async (workoutId) => {
        const service = new WorkoutService();
        const response = await service.loadWorkout(workoutId);
        if (response.error) {
            alert(response.error);
        }
        else {
            dispatch({ type: "SET WORKOUT", payload: new Workout(response) })
        }
    };

    useEffect(() => {
        const element = document.getElementById('main');
        if (element) {
            element.scrollIntoView(true);
        }
    }, []);

    useEffect(() => {
        if (workoutId !== undefined && workoutId !== workout?.id) {
            loadWorkout(workoutId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workout?.id, workoutId]);

    /*
    useEffect(() => {
        if (workoutId && (!workout || workout.id !== workoutId)) {
            const workout = workouts.find(workout => workout.id === workoutId);
            if (workout) {
                dispatch({ type: "SET WORKOUT", payload: workout });
            }
        }
    }, [dispatch, workouts, workout, workoutId])*/

    useEffect(() => {
        if (workout && cirquitId) {
            dispatch({ type: "SKIP TO", payload: (workout.getCirquitStartTime(cirquitId) - 10) * 1000 });
        }
    }, [dispatch, cirquitId, workout])

    useLayoutHeight("timer-layout");

    let time = timer.start ? Date.now() - timer.start : 0;
    if (timer.pause) {
        time = timer.pause - timer.start;
    }
    const totalTimeLeft = workout ? Math.max(0, workout.duration * 1000 - Math.floor(time / 1000) * 1000) : 0;

    const status = workout?.getStatus(Math.floor(time / 1000)) || {};

    useFontFitter({
        containerId: "timer-clock",
        targetId: "timer-clock-h1",
        min: 1,
        max: 20,
        dependencies: [workout, cirquitId, status.currentCirquit?.id, edit, tick],
        fixJustifyContent: false
    });
    useFontFitter({
        containerId: "timer-cirquit-info",
        targetId: "timer-cirquit-info-cirquit",
        min: 0.8,
        max: 2.0,
        dependencies: [workout, cirquitId, status.currentCirquit?.id, edit, tick],
        step: 0.05
    });

    /*
    useEffect(() => {
        let cirquitInfo = document.getElementById(`timer-cirquit-info`);
        cirquitInfo.style.justifyContent = "center";
        let exerciseList = document.getElementById(`cirquit-${status.currentCirquit?.id}-exercise-list`);
        if (exerciseList) {
            exerciseList.style.fontSize = "1.3em";

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workout, cirquitId, status.currentCirquit?.id, window.innerHeight, window.innerWidth, edit]);

    useEffect(() => {

        let cirquitInfo = document.getElementById(`timer-cirquit-info`);
        let exerciseList = document.getElementById(`cirquit-${status.currentCirquit?.id}-exercise-list`);
        console.log("fix font size " + status?.currentCirquit?.id + " list = " + exerciseList);
        if (status.currentCirquit && exerciseList) {
            let i = 0;
            while (cirquitInfo.scrollHeight > cirquitInfo.clientHeight && i < 50) {

                //console.log(cirquitInfo.scrollHeight + " > " + cirquitInfo.clientHeight);
                console.log(exerciseList.style.fontSize);
                if (exerciseList.style.fontSize === undefined || exerciseList.style.fontSize === "") {
                    exerciseList.style.fontSize = "1.3em";
                }
                else {
                    let fontSize = parseFloat(exerciseList.style.fontSize.split("em")[0]) - 0.02;

                    if (fontSize > 0.9) {
                        cirquitInfo.style.justifyContent = "center";
                        exerciseList.style.fontSize = fontSize + "em";
                    }
                    else {
                        cirquitInfo.style.justifyContent = "start";
                        break;
                    }
                }
                i++;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workout, cirquitId, status?.currentCirquit?.id, window.innerHeight, window.innerWidth, edit])
*/
    if (!workout) {
        return (
            <div>Loading....</div>
        )
    }

    let exercises = [
        status.remainingExerciseTime > 10 ? status.previousExercise : status.currentExercise,
        status.remainingExerciseTime > 10 ? status.currentExercise : status.nextExercise,
        status.remainingExerciseTime > 10 ? status.nextExercise : { id: "done", name: "Sarja päättyy" }
    ];

    if (status.currentCirquit?.exercises.length === 1) {
        exercises = [undefined, status.currentCirquit.exercises[0], undefined];
    }

    //const showExerciseTitle = !status.done && !status.cirquitRest && status.countDownDone;
    //const showCirquitInfo = !status.done && (status.cirquitRest || !status.countDownDone);
    //const showWorkoutInfo = !status.done && !status.cirquitRest && status.countDownDone;

    let timerState = "go"; //showExerciseTitle ? 'go' : 'rest';

    if (status.done) {
        timerState = "done";
    }
    else if (!status.countDownDone) {
        timerState = "rest";
    }
    else if (status.cirquitRest) {
        timerState = "rest";
    }

    //const showExerciseTitle = timerState === "go";

    const calculateFontSize = text => {
        return Math.max(0.5, Math.min(3.0, 40 / (text.length / 2.2)));
    }

    let timerSeconds = 0;

    if (!status.countDownDone) {
        timerSeconds = status.remainingCountDownTime;
    }
    else if (status.resting) {
        timerSeconds = status.remainingRestTime;
    }
    else {
        timerSeconds = status.remainingExerciseTime;
    }

    const handleCirquitEdit = id => {
        if (id === null) {
            setEdit(false)
        }
        else {
            setEdit(true);
        }
    };

    const openAddCirquitDialog = () => {
        dispatch({
            type: "OPEN CIRQUIT TEMPLATE SELECT", payload: {
                index: status.done ? workout.cirquits.length : 0,
                callback: (cirquit) => {
                    setEdit(true);
                    if (status.done) {
                        dispatch({ type: "SKIP TO", payload: (workout.getCirquitStartTime(cirquit.id) - 10) * 1000 });
                    }
                }
            }
        });
        // FIXME: do this in callback

        /*
        if (status.done) {
            dispatch({ type: "SKIP TO", payload: 0 })
        }*/
    };

    if (status.done || workout.cirquits.length === 0) {
        return (
            <div className="page">
                {status.done ?
                    <Message>Ohjelma on suoritettu loppuun</Message>
                    :
                    <Message>Jotta voit käyttää ajastinta, treeniohjelmassa on oltava vähintään yksi liikesarja</Message>
                }
                <button className="primary width-100" type="button" onClick={e => openAddCirquitDialog()}>
                    Lisää uusi liikesarja
                </button>
            </div>
        )
    }

    return (
        <>
            <div id="timer-layout" className={`timer-layout layout ${timerState}`}>

                <div id="exercise-titles" className="exercise-titles timer-layout-grid-cell">
                    {exercises.map((exercise, index) =>
                        exercise &&
                        <section
                            key={exercise.id}
                            className={`exercise-title ${index === 0 ? 'previous' : index === 2 ? 'next' : 'current'} ${status.remainingExerciseTime <= 10 && 'upcoming'}`}>
                            <h1 style={{ 'fontSize': calculateFontSize(exercise.name) + "em" }}>{exercise.name}</h1>
                            {(exercise.id === status.nextExercise?.id) &&
                                <div className="next-exercise-alert-icon">
                                    <h3><FontAwesomeIcon icon={faArrowRight} /></h3>
                                </div>
                            }
                        </section>)
                    }

                    {status.done &&
                        <section className="exercise-title">
                            <h1>Ohjelma on suoritettu loppuun!</h1>
                        </section>
                    }
                </div>

                <section id="timer-clock" className="timer timer-layout-grid-cell">
                    <div>
                        {!status.countDownDone &&
                            <h4>Valmistaudu</h4>
                        }
                        {status.resting &&
                            <h4>Tauko</h4>
                        }

                        <h1 className={"bigger"} id="timer-clock-h1">
                            <Time milliseconds={timerSeconds * 1000} className={status.resting ? 'rest' : ''} />
                        </h1>
                    </div>
                </section>

                {status.currentCirquit &&
                    <section id="timer-cirquit-info" className="timer-cirquit-info timer-layout-grid-cell">

                        {edit ?
                            <div id="timer-cirquit-info-cirquit" className="cirquit-editor">
                                <CirquitEditor
                                    index={status.currentCirquitIndex}
                                    cirquit={status.currentCirquit}
                                    timerMode={true}
                                    edit={edit}
                                    setEditId={handleCirquitEdit}
                                />
                            </div>
                            :
                            <div id="timer-cirquit-info-cirquit">
                                <CirquitDetails cirquit={status.currentCirquit} index={status.currentCirquitIndex} showHeader={false} />
                            </div>
                        }
                        {/* 
                    <button className="secondary" style={{ "flexGrow": 0.1 }} onClick={e => setEdit(!edit)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    */}
                    </section>
                }

                {status.currentCirquit && (status.resting || !status.countDownDone) &&
                    <section className="rest-cirquit-info timer-layout-grid-cell">
                        <h4>Sarja</h4>
                        <h3>{status.currentCirquitIndex + 1}/{workout.cirquits.length}</h3>
                    </section>
                }

                {status.currentCirquit && (status.resting || !status.countDownDone) &&
                    <section className="rest-round-info timer-layout-grid-cell">
                        <h4>Kierroksia</h4>
                        <h3>{status.currentCirquit.repeats}</h3>
                    </section>
                }

                <div className="workout-info">

                    {totalTimeLeft > 0 &&
                        <section className="remaining-workout-time timer-layout-grid-cell">
                            <h4>Jäljellä</h4>
                            <h3>
                                <Time milliseconds={totalTimeLeft} />
                            </h3>
                        </section>
                    }

                    {status.currentCirquit &&
                        <>
                            <section id="cirquit-info" className="cirquit-info timer-layout-grid-cell">
                                <h4>Sarja</h4>
                                <h3>{status.currentCirquitIndex + 1} / {workout.cirquits.length}</h3>
                            </section>

                            <section className="round-info timer-layout-grid-cell">
                                <h4>Kierros</h4>
                                <h3>{status.currentRound} / {status.currentCirquit.repeats}</h3>
                            </section>

                            <section className="exercise-info timer-layout-grid-cell">
                                <h4>Liike</h4>
                                <h3>{status.currentExerciseIndex + 1} / {status.currentCirquit.exercises.length}</h3>
                            </section>
                        </>
                    }
                </div>

            </div >
            {
                !edit && status.currentCirquit && (status.resting || !status.countDownDone) &&
                <button className="timer-view-edit-cirquit-button" onClick={e => setEdit(!edit)}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
            }
        </>
    )
}