import React from "react"
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowUp, faArrowDown, faTrash, faCopy } from "@fortawesome/free-solid-svg-icons";
import SideBar from "./SideBar";

export default function ExerciseSideBar() {

    const { selectedExercises, workout, sideBar } = useSelector(state => state);

    const exercises = [...selectedExercises].map(exerciseId => workout.findExerciseWithId(exerciseId));

    const dispatch = useDispatch();

    const deleteExercise = e => {
        dispatch({ type: "DELETE EXERCISES", payload: { exerciseIds: [...selectedExercises] } })
    }

    const copyExercise = e => {
        e.stopPropagation();
        dispatch({ type: "COPY EXERCISES", payload: { exerciseIds: [...selectedExercises] } })
    }

    const moveExerciseUp = e => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({ type: "MOVE EXERCISES UP", payload: { exerciseIds: [...selectedExercises] } })
    }

    const moveExerciseDown = e => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({ type: "MOVE EXERCISES DOWN", payload: { exerciseIds: [...selectedExercises] } })
    }

    const durations = exercises.map(exercise => exercise.duration);
    const rests = exercises.map(exercise => exercise.rest);
    const sameDuration = durations.length > 0 && durations.every(duration => duration === durations[0]);
    const sameRest = rests.length > 0 && rests.every(rest => rest === rests[0]);

    const openExerciseTypeSelect = e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
            type: "OPEN EXERCISE TYPE SELECT",
            payload: {
                exerciseIds: selectedExercises
            }
        })
    }

    const openDurationSelect = e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
            type: "OPEN NUMBER SELECT", payload: {
                values: durations,
                settings: {
                    title: "Valitse liikkeen kesto",
                    min: 0,
                    max: 240,
                    step: 5,
                    columns: 4
                },
                actionGenerator: duration => {
                    return { type: "SET EXERCISE DURATIONS", payload: { exerciseIds: [...selectedExercises], duration } }
                }
            }
        })
    }

    const openRestSelect = e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
            type: "OPEN NUMBER SELECT", payload: {
                values: rests,
                settings: {
                    title: "Valitse levon pituus",
                    min: 0,
                    max: 240,
                    step: 5,
                    columns: 4
                },
                actionGenerator: rest => {
                    return { type: "SET EXERCISE RESTS", payload: { exerciseIds: [...selectedExercises], rest } }
                }
            }
        })
    }

    return (
        <SideBar show={exercises.length > 0}>

            <div className="side-nav-buttons">
                <button className={`side-nav-button sub-menus ${sideBar.menu === "exercise" ? " selected" : ""}`} onClick={openExerciseTypeSelect}>
                    Liike
                    <div>({exercises.length})</div>
                </button>
                <button className={`side-nav-button sub-menus ${sideBar.menu === "duration" ? " selected" : ""}`} onClick={openDurationSelect}>
                    Kesto
                    <div>({sameDuration ? durations[0] : 'x ' + durations.length})</div>
                </button>
                <button className={`side-nav-button sub-menus ${sideBar.menu === "rest" ? " selected" : ""}`} onClick={openRestSelect}>
                    Lepo
                    <div>({sameRest ? rests[0] : 'x ' + durations.length})</div>
                </button>
                <button className="side-nav-button" onClick={moveExerciseUp} onDoubleClick={moveExerciseUp}>
                    <FontAwesomeIcon icon={faArrowUp} fixedWidth />
                </button>
                <button className="side-nav-button" onClick={moveExerciseDown} onDoubleClick={moveExerciseDown}>
                    <FontAwesomeIcon icon={faArrowDown} fixedWidth />
                </button>
                <button className="side-nav-button" onClick={copyExercise}>
                    <FontAwesomeIcon icon={faCopy} fixedWidth />
                </button>
                <button className="side-nav-button" onClick={deleteExercise}>
                    <FontAwesomeIcon icon={faTrash} fixedWidth />
                </button>
            </div>
        </SideBar>
    )
}