import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux";
import "./ExerciseTypeSelect.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function ExerciseTypeSelect({ selectedExerciseIds, onExerciseTypeSelect }) {

    const { workout, exerciseTypes } = useSelector(state => state);

    const exercises = [...selectedExerciseIds].map(exerciseId => workout.findExerciseWithId(exerciseId));
    const usedExerciseNames = workout.exerciseNames;

    const sameName = exercises.length > 0 && exercises.every(exercise => exercise.name === exercises[0].name);

    const [page, setPage] = useState("select-exercise");
    const [selectedTags, setSelectedTags] = useState(new Set([]));
    const [name, setName] = useState(sameName ? exercises[0].name : "");

    const tags = new Set([]);

    exerciseTypes.forEach(type => {
        type.tags.forEach(tag => {
            tags.add(tag);
        })
    })

    let visibleExerciseTypes = exerciseTypes.filter(type =>
        selectedTags.size === 0 || type.tags.some(tag => selectedTags.has(tag))
    ).sort((type1, type2) => {
        return type1.name.localeCompare(type2.name);
    })
    /*
    useEffect(()=>{
        
        if (exerciseTypes.filter(type=>type.name === ).length === 0) {
            setPage("new-exercise");
        }
    },[selectedExerciseIds, exercises]);
    */

    const handleNameChange = e => {
        e.preventDefault();
        e.stopPropagation();
        setName(e.target.value);
    }

    const isTypeSelected = name => {
        return exercises.find(exercise => exercise.name === name);
    }

    const openFilters = e => {
        e.preventDefault();
        e.stopPropagation();
        setPage("filters");
    }

    const openExercises = e => {
        e.preventDefault();
        e.stopPropagation();
        setPage("select-exercise");
    }

    const openNewExercise = e => {
        e.preventDefault();
        e.stopPropagation();
        setPage("new-exercise");
    }

    const selectTag = (e, tag) => {
        e.preventDefault();
        e.stopPropagation();
        const set = new Set([...selectedTags]);
        if (selectedTags.has(tag)) {
            set.delete(tag);
        }
        else {
            set.add(tag);
        }
        setSelectedTags(set);
    }

    return (
        <div className="exercise-type-select">

            <div className="tabs">
                <div className={`tab ${page === "filters" ? 'selected' : ''}`} role="button" onClick={openFilters}>
                    Suodata {selectedTags.size === 0 || `(${selectedTags.size})`}
                </div>
                <div className={`tab ${page === "select-exercise" ? 'selected' : ''}`} onClick={openExercises}>
                    Valitse {selectedTags.size === 0 || `(${visibleExerciseTypes.length})`}
                </div>
                <div className={`tab ${page === "new-exercise" ? 'selected' : ''}`} onClick={openNewExercise}>Uusi</div>
            </div>
            {page === "filters" &&
                <div className="exercise-type-select-tags">
                    <div className={`exercise-type-select-tag-header`}>
                        Tagit
                    </div>
                    {[...tags].map(tag =>
                        <div
                            onClick={e => selectTag(e, tag)}
                            className={`exercise-type-select-tag ${selectedTags.has(tag) ? 'selected' : ''}`}>
                            <button className={`pretty checkbox ${selectedTags.has(tag) ? 'selected' : ''}`} onClick={e => selectTag(e, tag)}>
                                {selectedTags.has(tag) &&
                                    <FontAwesomeIcon icon={faCheck} fixedWidth />
                                }
                            </button>
                            <span className="exercise-type-select-tag-name">{tag}</span>
                        </div>
                    )}
                </div>
            }
            {page === "new-exercise" &&
                <div className="exercise-type-select-name-input">
                    <form>
                        <div className="form-row">
                            <label>Liikkeen nimi</label>
                            <input
                                type="text"
                                placeholder="Kirjoita liikkeen nimi"
                                value={name}
                                onClick={e => e.stopPropagation()}
                                onBlur={e => onExerciseTypeSelect(e, { name })}
                                onChange={handleNameChange} />
                        </div>
                    </form>
                </div>
            }
            {page === "select-exercise" &&
                <div className="exercise-type-select-types">
                    {visibleExerciseTypes.map(type =>
                        <div
                            key={type.id}
                            className={`exercise-type-select-exercise-row ${isTypeSelected(type.name) ? 'selected' : ''}`}
                            onClick={e => onExerciseTypeSelect(e, type)}>
                            <div>{type.name}</div>
                            {usedExerciseNames.includes(type.name) &&
                                < div className="small-text">
                                    <FontAwesomeIcon icon={faCheck} />
                                </div>
                            }
                        </div>
                    )}
                </div>
            }

        </div >
    )
}