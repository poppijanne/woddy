import React, { useState } from "react"
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ExerciseRow from "./ExerciseRow"
import './CirquitEditor.css';
import Time from "../timer/Time";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faArrowUp, faArrowDown, faPlus, faTrash, faCopy, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Exercise from "../../data/Exercise";
import generateID from "../../util/generateID";

export default function CirquitEditor({
    index,
    cirquit,
    timerMode = false,
    isLast = false,
    edit = false,
    setEditId }) {

    const { workout, selectedCirquits } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory();
    //const [showActionsExerciseId, setShowActionsExerciseId] = useState(null);

    if (!cirquit) {
        return (<></>);
    }
    /*
        const handleToggle = e => {
            e.preventDefault();
            if (!edit) {
                setEditId(cirquit.id)
            }
            else {
                setEditId(null)
            }
        }
    */
    const handleStart = e => {
        e.preventDefault();
        //dispatch({ type: "SKIP TO", payload: (workout.getCirquitStartTime(index) - workout.countDown) * 1000 });
        history.push(`/timer/workout/${workout.id}/cirquit/${cirquit.id}`);
    }

    const scrollToCirquit = () => {
        setTimeout(() => {
            const element = document.getElementById(cirquit.id);
            if (element) {
                element.scrollIntoView(true);
            }
        }, 200);
    }

    const handleMoveCirquitUp = e => {
        e.preventDefault();
        dispatch({ type: "MOVE CIRQUIT UP", payload: { cirquitId: cirquit.id } })
        scrollToCirquit();
    }

    const handleMoveCirquitDown = e => {
        e.preventDefault();
        dispatch({ type: "MOVE CIRQUIT DOWN", payload: { cirquitId: cirquit.id } })
        scrollToCirquit();
    }

    const handleDeleteCirquit = e => {
        e.preventDefault();
        dispatch({ type: "DELETE CIRQUIT", payload: { cirquitId: cirquit.id } })
    }

    const handleCopyCirquit = e => {
        e.preventDefault();
        dispatch({ type: "COPY CIRQUIT", payload: { cirquitId: cirquit.id } })
    }

    const handleCreateNewExercise = e => {
        e.preventDefault();
        e.stopPropagation();
        const exerciseId = generateID();
        dispatch({ type: "CREATE NEW EXERCISE", payload: { cirquitId: cirquit.id, exerciseId } });
        dispatch({
            type: "OPEN EXERCISE TYPE SELECT",
            payload: {
                exerciseIds: [exerciseId],
            }
        })
    }
    /*
        const handleSetCirquitRepeats = repeats => {
            dispatch({ type: "SET CIRQUIT REPEATS", payload: { repeats, cirquitId: cirquit.id } })
        }
    
        const handleSetCirquitRest = rest => {
            dispatch({ type: "SET CIRQUIT REST", payload: { rest, cirquitId: cirquit.id } })
        }
    
        const selectCirquit = e => {
            e.preventDefault();
            e.stopPropagation();
            if (!selectedCirquits.has(cirquit.id)) {
                dispatch({ type: "SELECT CIRQUIT", payload: { cirquitId: cirquit.id } })
            }
            else {
                dispatch({ type: "UNSELECT CIRQUIT", payload: { cirquitId: cirquit.id } })
            }
        }
    */
    const openRepeatsSelect = e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
            type: "OPEN NUMBER SELECT", payload: {
                values: [cirquit.repeats],
                settings: {
                    title: "Valitse kierrosten lukumäärä",
                    min: 1,
                    max: 50,
                    step: 1,
                    columns: 5
                },
                actionGenerator: repeats => {
                    return { type: "SET CIRQUIT REPEATS", payload: { cirquitId: cirquit.id, repeats } }
                }
            }
        })
    }

    const openRestSelect = e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
            type: "OPEN NUMBER SELECT", payload: {
                values: [cirquit.rest],
                settings: {
                    title: "Valitse levon pituus",
                    min: 0,
                    max: 240,
                    step: 5,
                    columns: 4
                },
                actionGenerator: rest => {
                    return { type: "SET CIRQUIT REST", payload: { cirquitId: cirquit.id, rest } }
                }
            }
        })
    }

    let exerciseNameCharacters = 0;

    cirquit.exercises.forEach(exercise => exerciseNameCharacters += exercise.name.length || 0);
    //console.log(exerciseNameCharacters)

    //const fontSize =  exerciseNameCharacters / 190;
    //const fontSize = Math.max(0.5, Math.min(1.3, 190 / (exerciseNameCharacters))) + "em";

    return (
        <section id={cirquit.id} className={`cirquit ${timerMode ? 'timer-mode' : ''}`}>

            {!timerMode &&
                <div className={`cirquit-actions `}>
                    <button className="icon" type="button" onClick={handleStart} disabled={cirquit.exercises.length === 0}>
                        <FontAwesomeIcon icon={faPlay} fixedWidth />
                    </button>
                    <button className="icon" type="button" onClick={handleMoveCirquitUp} disabled={index === 0}>
                        <FontAwesomeIcon icon={faArrowUp} fixedWidth />
                    </button>
                    <button className="icon" type="button" onClick={handleMoveCirquitDown} disabled={isLast}>
                        <FontAwesomeIcon icon={faArrowDown} fixedWidth />
                    </button>
                    <button className="icon" type="button" onClick={handleCopyCirquit}>
                        <FontAwesomeIcon icon={faCopy} fixedWidth />
                    </button>
                    <button className="icon" type="button" onClick={handleDeleteCirquit}>
                        <FontAwesomeIcon icon={faTrash} fixedWidth />
                    </button>
                </div>
            }
            <table
                className={`cirquit-table borders ${timerMode ? 'timer' : ''} ${selectedCirquits.has(cirquit.id) ? 'selected' : ''}`}
            >

                <thead className="thead-light">
                    {!timerMode &&
                        <tr>
                            <th colSpan="2" className="cirquit-label">
                                Sarja {index + 1}
                            </th>
                            <th colSpan="2" className="cirquit-label right">
                                <button
                                    onClick={openRepeatsSelect}
                                    className="input no-borders">
                                    &times; {cirquit.repeats}
                                    <span className="icon"><FontAwesomeIcon icon={faChevronDown} /></span>
                                </button>
                            </th>
                        </tr>
                    }
                    {cirquit.exercises.length > 0 &&
                        <tr>

                            <th className="width-2-em center small-text">Valitse</th>
                            <th className="left small-text">Liike</th>
                            <th className="width-5-em center small-text">Kesto</th>
                            <th className="width-5-em center small-text">Lepo</th>
                        </tr>
                    }
                </thead>

                {cirquit.exercises.map((exercise, index) =>
                    <ExerciseRow key={exercise.id} index={index} exercise={exercise} />
                )}

                <tbody>
                    <tr>
                        <td colSpan="4">
                            <button onClick={handleCreateNewExercise} className="secondary add-cirquit-button">
                                <FontAwesomeIcon icon={faPlus} />&nbsp;Lisää liike
                            </button>
                        </td>
                    </tr>
                </tbody>


                <tfoot>
                    <tr>
                        <th colSpan="2" className="center small-text">Lepo</th>
                        <th className="center" colSpan="2">
                            <button
                                onClick={openRestSelect}
                                className="input no-borders">
                                {cirquit.rest}
                                <span className="icon"><FontAwesomeIcon icon={faChevronDown} /></span>
                            </button>
                        </th>

                    </tr>
                    {!timerMode &&
                        <tr className="cirquit-summary">
                            <th colSpan="2" className="center small-text">Kesto</th>
                            <th colSpan="2" className="center small-text">
                                <Time milliseconds={cirquit.duration * 1000} />
                            </th>

                        </tr>
                    }
                </tfoot>

            </table>
        </section>
    )

    /*
    return (
        <section className={`cirquit ${isLast ? 'last' : ''} ${edit ? 'edit-mode' : ''} ${showBorders ? '' : 'no-borders'}`}>
            {showHeader &&
                <>
                    <div
                        id={`cirquit-${cirquit.id}-header`}
                        className="cirquit-header" >
                        Sarja {index + 1} x
                    {!edit
                                ?
                                <> {cirquit.repeats}</>
                                :
                                <NumberInput
                                    title="Toistojen määrä"
                                    value={cirquit.repeats}
                                    min={1}
                                    max={50}
                                    step={1}
                                    setValue={handleSetCirquitRepeats} />
                            }
                        
                    </div>

                    <div className="cirquit-time"><Time milliseconds={cirquit.duration * 1000} /></div>

                    <div className="cirquit-actions">
                        {allowSkip &&
                            <button className="secondary" onClick={handleStart} disabled={cirquit.exercises.length === 0}>
                                <FontAwesomeIcon icon={faPlay} fixedWidth />
                            </button>
                        }
                        {showCirquitActions &&
                            <>
                                <button className="secondary" onClick={handleMoveCirquitUp} disabled={index === 0}>
                                    <FontAwesomeIcon icon={faChevronUp} fixedWidth />
                                </button>
                                <button className="secondary" onClick={handleMoveCirquitDown} disabled={isLast}>
                                    <FontAwesomeIcon icon={faChevronDown} fixedWidth />
                                </button>
                                <button className="secondary" onClick={handleCopyCirquit}>
                                    <FontAwesomeIcon icon={faPlus} fixedWidth />
                                </button>
                            </>
                        }
                        {allowEdit &&
                            <button className={`secondary ${edit ? 'active' : ''}`} onClick={handleToggle}>
                                <FontAwesomeIcon icon={faEdit} fixedWidth />
                            </button>
                        }
                        {allowDelete &&
                            <button className="secondary" onClick={handleDeleteCirquit} disabled={cirquit.exercises.length === 0}>
                                <FontAwesomeIcon icon={faTimes} fixedWidth />
                            </button>
                        }
                    </div>
                </>
            }

            <div className="duration-label">Kesto</div>
            <div className="rest-label">Lepo</div>

            <div id={`cirquit-${cirquit.id}-exercise-list`} className={`exercise-list ${edit ? 'edit' : ''}`} >

                {cirquit.exercises.map((exercise, index, exercises) =>
                    <ExerciseRow
                        key={exercise.id}
                        exercise={exercise}
                        showActions={showActionsExerciseId === exercise.id}
                        setShowActions={id => setShowActionsExerciseId(id)}
                        edit={edit}
                        index={index}
                        isLast={index === exercises.length - 1}
                    />
                )}
            </div>
            {!isLast &&
                <>
                    <div className="cirquit-rest-label">Lepo</div>
                    <div className="cirquit-rest">
                        {!edit
                            ?
                            <> {cirquit.rest}</>
                            :
                            <NumberInput
                                title="Lepo sarjan jälkeen"
                                value={cirquit.rest}
                                min={0}
                                max={500}
                                step={5}
                                setValue={handleSetCirquitRest} />
                        }
                    </div>
                </>
            }
        </section>
    )*/
}