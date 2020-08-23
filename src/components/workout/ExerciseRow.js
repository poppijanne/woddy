import React from "react"
import { useSelector, useDispatch } from "react-redux";
import './ExerciseRow.css';
import Exercise from "../../data/Exercise";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle, faCheckCircle, faCircleNotch, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function ExerciseRow({
    exercise = new Exercise(),
    index = 0 }) {

    const selectedExercises = useSelector(state => state.selectedExercises);
    const dispatch = useDispatch();

    const selectExercise = e => {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedExercises.has(exercise.id)) {
            dispatch({ type: "SELECT EXERCISE", payload: { exerciseId: exercise.id } })
            dispatch({ type: "OPEN SIDE BAR" });
        }
        else {
            dispatch({ type: "UNSELECT EXERCISE", payload: { exerciseId: exercise.id } })
        }
    }

    const selectOneExercise = e => {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedExercises.has(exercise.id) || selectedExercises.size > 1) {
            dispatch({ type: "SELECT ONE EXERCISE", payload: { exerciseId: exercise.id } })
            dispatch({ type: "OPEN SIDE BAR" });
        }
        else {
            dispatch({ type: "UNSELECT EXERCISE", payload: { exerciseId: exercise.id } })
        }
    }

    const openMenu = menu => {
        if (!selectedExercises.has(exercise.id)) {
            dispatch({ type: "SELECT ONE EXERCISE", payload: { exerciseId: exercise.id } })
            dispatch({ type: "OPEN SIDE BAR MENU", payload: menu });
        }
        else {
            dispatch({ type: "UNSELECT EXERCISE", payload: { exerciseId: exercise.id } })
        }
    }

    const openExerciseTypeMenu = e => {
        e.preventDefault();
        e.stopPropagation();
        openMenu("exercise")
    }

    const openExerciseDurationMenu = e => {
        e.preventDefault();
        e.stopPropagation();
        openMenu("duration")
    }

    const openExerciseRestMenu = e => {
        e.preventDefault();
        e.stopPropagation();
        openMenu("rest")
    }

    const changeExerciseName = e => {
        dispatch({ type: "SET EXERCISE NAME", payload: { exerciseId: exercise.id, name: e.target.value } })
    }

    const openDurationSelect = e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
            type: "OPEN NUMBER SELECT", payload: {
                values: [exercise.duration],
                settings: {
                    title: "Valitse liikkeen kesto",
                    min: 0,
                    max: 240,
                    step: 5,
                    columns: 4
                },
                actionGenerator: duration => {
                    return { type: "SET EXERCISE DURATION", payload: { exerciseId: exercise.id, duration } }
                }
            }
        })
    }

    const openRestSelect = e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
            type: "OPEN NUMBER SELECT", payload: {
                values: [exercise.rest],
                settings: {
                    title: "Valitse levon pituus",
                    min: 0,
                    max: 240,
                    step: 5,
                    columns: 4
                },
                actionGenerator: rest => {
                    return { type: "SET EXERCISE REST", payload: { exerciseId: exercise.id, rest } }
                }
            }
        })
    }

    const openExerciseTypeSelect = e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
            type: "OPEN EXERCISE TYPE SELECT",
            payload: {
                exerciseIds: [exercise.id],
            }
        })
    }

    return (
        <tbody>
            <tr className={selectedExercises.has(exercise.id) ? 'selected' : ''} >
                <td className="clickable center" onClick={selectExercise} tabIndex="0">
                    {selectedExercises.has(exercise.id) ? <FontAwesomeIcon icon={faCheck} fixedWidth /> : index + 1 }
                    
                </td>
                {/* 
                <td className={selectedExercises.has(exercise.id) ? "width-2-em center" : "width-0 center"}>
                    {selectedExercises.size > 0 &&
                        <button
                            type="button"
                            className={`pretty ${selectedExercises.has(exercise.id) ? 'selected' : ''}`}
                            onClick={selectExercise}>
                            {selectedExercises.has(exercise.id) &&
                                <FontAwesomeIcon icon={faCheck} fixedWidth />
                            }
                        </button>
                    }
                </td>
                */}
                <td className="left">
                    <button className="select no-borders" onClick={openExerciseTypeSelect} >
                        <span>{exercise.name !== "" ? exercise.name : "Valitse liike"}</span>
                        <span className="icon"><FontAwesomeIcon icon={faChevronDown} /></span>
                    </button>
                </td>
                <td className="width-4-em center">
                    <button className="input no-borders" onClick={openDurationSelect}>
                        {exercise.duration}
                        <span className="icon"><FontAwesomeIcon icon={faChevronDown} /></span>
                    </button>
                </td>
                <td className="width-4-em center">
                    <button className="input no-borders" onClick={openRestSelect}>
                        {exercise.rest}
                        <span className="icon"><FontAwesomeIcon icon={faChevronDown} /></span>
                    </button>
                </td>
            </tr>
        </tbody>
    )
}