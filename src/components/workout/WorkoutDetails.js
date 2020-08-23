import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import Loader from "../common/Loader";
import WorkoutService from "../../services/WorkoutService";
import Workout from "../../data/Workout";
import CirquitDetails from "./CirquitDetails";

export default function WorkoutDetails({ workoutId }) {
    const workouts = useSelector(state => state.workouts);
    const dispatch = useDispatch();
    const workout = workouts.find(summary => summary.workoutId === workoutId)?.workout;

    const loadWorkout = async (workoutId) => {
        const service = new WorkoutService();
        const response = await service.loadWorkout(workoutId);
        if (response.error) {
            alert(response.error);
        }
        else {
            dispatch({ type: "ADD WORKOUT TO SUMMARY", payload: new Workout(response) })
        }
    };

    useEffect(() => {
        if (workoutId !== undefined && workoutId !== workout?.id) {
            loadWorkout(workoutId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workout?.id, workoutId]);

    if (!workout) {
        return <Loader />
    }

    return (
        <section className="workout-details">
            <div className="workout-details-cirquits">
                {workout.cirquits.map((cirquit, index) => <CirquitDetails cirquit={cirquit} index={index+1} />)}
            </div>
        </section>
    )
}