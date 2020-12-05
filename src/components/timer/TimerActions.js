import React, { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faStop, faStepForward, faForward, faStepBackward, faEdit, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from "react-redux";
import useTimeout from "../../hooks/useTimeout";
import './TimerActions.css';
import AudioService from "../../services/AudioService";
import Time from "./Time";

const audio = new AudioService();
// prevent stop sound from playing if a completed workout is opened
audio.previouslyPlayedEffect = "stop";

export default function TimerActions() {

    const { timer, workout } = useTimeout();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch()

    let time = timer.start ? Date.now() - timer.start : 0;
    time = Math.floor(time / 1000) * 1000 + 100;
    if (timer.pause) {
        time = timer.pause - timer.start;
    }

    const status = workout.getStatus(Math.floor(time / 1000))

    const workingOut = timer.start !== null && !status.done;
    const workoutDuration = workout.duration;

    if (status.done) {
        time = workoutDuration;
    }

    const totalTimeLeft = workout ? Math.max(0, workoutDuration * 1000 - Math.floor(time / 1000) * 1000) : 0;

    let counter = -1;
    let start = false;
    let stop = false;
    let halftime = false;

    if (status.resting &&
        status.countDownDone &&
        status.remainingExerciseTime === 0 &&
        status.remainingRestTime === status.currentExercise?.rest) {
        stop = true;
    }

    if (status.resting &&
        status.countDownDone &&
        status.cirquitDone &&
        status.cirquitRest &&
        status.remainingRestTime === workout.cirquits[status.currentCirquitIndex - 1]?.rest) {
        stop = true;
    }

    if (status.done) {
        stop = true;
    }

    start = counter === -1 && status.remainingExerciseTime === status.currentExercise?.duration;

    if (!start && !stop) {
        
        if (status.remainingCountDownTime > 0 && status.remainingCountDownTime <= 5) {
            counter = status.remainingCountDownTime;
        }
        if (status.remainingExerciseTime === 0 && status.remainingRestTime > 0 && status.remainingRestTime <= 5) {
            counter = status.remainingRestTime;
        }
        if (status.remainingCountDownTime === 0 && status.remainingExerciseTime > 0 && status.remainingExerciseTime <= 5) {
            counter = status.remainingExerciseTime;
        }
        if (status.remainingExerciseTime === Math.floor(status.currentExercise?.duration / 2) && status.currentExercise?.duration > 20) {
            halftime = true;
        }
    }



    //stop = (counter === -1 && status.resting && status.remainingRestTime === status.currentExercise?.rest);

    //stop = counter === -1 && status.done === true;

    useEffect(() => {
        console.log(`counter=${counter} start=${start} stop=${stop} haftime=${halftime} timer.start=${timer.start} timer.pause=${timer.pause} `)
        if (timer.start === null || timer.pause !== null) {
            return;
        }
        if (counter > 0) {
            console.log(counter);
            audio.count(counter);
        }
        else if (start) {
            audio.start();
        }
        else if (stop) {
            if (audio.previouslyPlayedEffect !== "stop") {
                audio.stop();
            }
        }
        else if (halftime) {
            audio.halftime();
        }
    }, [counter, start, stop, halftime, timer.start, timer.pause]);
    /*
    useEffect(() => {
        if ((status.resting || status.remainingCountDownTime > 0) && status.secondsFromStart > 0 && status.nextExercise?.name) {
            audio.say("seuraava liike on " + status.nextExercise?.name);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status.nextExercise?.name, (status.resting || status.remainingCountDownTime > 0), status.secondsFromStart > 0]);
    */
    let skipTime = 0;
    if (status.remainingExerciseTime > 5) {
        skipTime = status.remainingExerciseTime - 5;
    }
    else if (status.remainingExerciseTime > 0) {
        skipTime = status.remainingExerciseTime;
    }
    else if (status.remainingRestTime > 5) {
        skipTime = status.remainingRestTime - 5;
    }
    else if (status.remainingRestTime > 0) {
        skipTime = status.remainingRestTime;
    }
    else if (status.remainingCountDownTime > 5) {
        skipTime = status.remainingCountDownTime - 5;
    }
    else if (status.remainingCountDownTime > 0) {
        skipTime = status.remainingCountDownTime;
    }

    const startWorkout = e => {
        e.preventDefault();
        dispatch({ type: "START" })
        audio.start();
        audio.say("Aloitetaan treeni");
        history.push(`/timer`);
    }

    const pauseWorkout = e => {
        e.preventDefault();
        dispatch({ type: "PAUSE" });
    }

    const continueWorkout = e => {
        e.preventDefault();
        dispatch({ type: "CONTINUE" });
    }

    const stopWorkout = e => {
        e.preventDefault();
        if (workingOut) {
            dispatch({ type: "STOP" });
        }
    }

    const skipForward = e => {
        e.preventDefault();
        if (!status.done) {
            dispatch({ type: "SKIP FORWARD", payload: skipTime * 1000 })
        }
    }

    const skipTo = e => {
        e.preventDefault();
        dispatch({ type: "SKIP TO", payload: parseInt(e.target.value) })
    }

    const skipToCirquit = (cirquitId, e) => {
        e.preventDefault();
        dispatch({ type: "SKIP TO", payload: (workout.getCirquitStartTime(cirquitId) - 10) * 1000 });
    }

    const reset = e => {
        e.preventDefault();
        if (status.done) {
            dispatch({ type: "RESET" })
        }
    }

    if (!location.pathname.startsWith('/workout') && !location.pathname.startsWith('/timer')) {
        return <></>;
    }

    return (
        <footer id="footer" className={workout?.cirquits.length > 0 ? 'timer' : 'timer hidden'}>
            <div className="timer-actions">
                <div className="timer-actions-slider">
                    <div className="timer-actions-workout-duration">
                        <Time milliseconds={time} />
                    </div>
                    {/*
                    <div className="timer-actions-slider-input">
                        
                        <input type="range" value={time} min={0} max={workoutDuration * 1000} onChange={skipTo} />
                    </div>
                    */}
                    <div className="timer-actions-cirquit-buttons">
                        {workout?.cirquits.map((cirquit, index) =>
                            <button
                                onClick={e => skipToCirquit(cirquit.id, e)}
                                className={`timer-actions-cirquit-button ${index === status.currentCirquitIndex ? 'current' : index < status.currentCirquitIndex ? 'past' : 'future'}`}
                                style={{ 
                                    flexGrow: (cirquit.duration / workoutDuration), 
                                    background: index === status.currentCirquitIndex && !status.cirquitDone && `linear-gradient(to right, #488eaf, #488eaf ${(status.executedCirquitTime / (cirquit.duration-cirquit.rest))*100}%, var(--background-color-attention) ${(status.executedCirquitTime / (cirquit.duration-cirquit.rest))*100}%)`
                                }}>
                                {(index + 1)}
                            </button>
                        )}
                    </div>
                    <div className="timer-actions-workout-duration">
                        <Time milliseconds={totalTimeLeft} />
                    </div>
                </div>

                <div className="buttons">
                    {status.done &&
                        <button type="button" onClick={reset}>
                            <FontAwesomeIcon icon={faStepBackward} fixedWidth />
                        </button>
                    }
                    {!workingOut && !status.done &&
                        <button key="timer-actions-play-button" type="button" onClick={startWorkout}>
                            <FontAwesomeIcon icon={faPlay} fixedWidth />
                        </button>
                    }
                    {workingOut && timer.pause === null &&
                        <button key="timer-actions-play-button" type="button" onClick={pauseWorkout}>
                            <FontAwesomeIcon icon={faPause} fixedWidth />
                        </button>
                    }
                    {workingOut && timer.pause !== null &&
                        <button key="timer-actions-play-button" type="button" onClick={continueWorkout}>
                            <FontAwesomeIcon icon={faPlay} fixedWidth />
                        </button>
                    }
                    <button type="button" disabled={!workingOut} onClick={stopWorkout}>
                        <FontAwesomeIcon icon={faStop} fixedWidth />
                    </button>
                    <button type="button" disabled={status.done} onClick={skipForward}>
                        {status.remainingExerciseTime > 5 || status.remainingRestTime > 5 || status.remainingCountDownTime > 5
                            ?
                            <FontAwesomeIcon icon={faForward} fixedWidth />
                            :
                            <FontAwesomeIcon icon={faStepForward} fixedWidth />
                        }
                    </button>
                    {/* 
                    <button type="button" onClick={stopWorkout}>
                        <FontAwesomeIcon icon={faVolumeUp} fixedWidth />
                    </button>
                    */}
                </div>
            </div >
        </footer>
    )
}