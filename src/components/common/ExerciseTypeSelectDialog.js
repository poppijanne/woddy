import React from "react";
import Modal from "./Modal";
import { useSelector, useDispatch } from "react-redux";
import ExerciseTypeSelect from "./ExerciseTypeSelect";

export default function ExerciseTypeSelectDialog() {

    const { show, exerciseIds } = useSelector(state => state.exerciseTypeSelect);
    const dispatch = useDispatch();

    const onClose = e => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({ type: "CLOSE EXERCISE TYPE SELECT" });

    }

    const onExerciseTypeSelect = (e, type) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({ type: "SET EXERCISE TYPES", payload: { exerciseIds, type } })
        dispatch({ type: "CLOSE EXERCISE TYPE SELECT" });
    }

    if (!show) {
        return (<></>);
    }

    return (
        <Modal title="Valitse liike / muokkaa" onClose={onClose}>
            <ExerciseTypeSelect selectedExerciseIds={exerciseIds} onExerciseTypeSelect={onExerciseTypeSelect} />
        </Modal>
    )
}