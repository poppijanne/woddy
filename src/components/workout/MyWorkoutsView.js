import React, { useEffect, useState } from "react"
import WorkoutService from "../../services/WorkoutService"
import { useSelector, useDispatch } from "react-redux";
import Time from "../timer/Time";
import Timestamp from "../common/Timestamp";
import { Link, useParams, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "./MyWorkoutsView.css"
import WorkoutDetails from "./WorkoutDetails";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import Workout from "../../data/Workout";

export default function MyWorkoutsView() {

    const { userId } = useParams();
    const [error, setError] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [toggled, setToggled] = useState(new Set([]));
    const { workouts, user } = useSelector(state => state);
    const history = useHistory();
    const dispatch = useDispatch();

    const loadWorkouts = async () => {

        //setLoaded(true);

        const service = new WorkoutService();
        const results = await service.loadWorkoutSummaries({ userId, page: 0, pageSize: 20, sortBy: "createdTs", sortOrder: "DESC" });
        if (results.error) {
            setError("Aikaisempien treeniohjelmiesi lataaminen epäonnistui. Yritä myöhemmin uudestaan.");
        }
        else {
            dispatch({ type: "SET WORKOUT SUMMARIES", payload: results });
            setLoaded(true);
        }
    }

    useEffect(() => {
        //if (!loaded && workouts.length === 0) {
        loadWorkouts();
        //}
    }, [userId])

    const toggleWorkoutDetails = (workoutId, e) => {
        e.preventDefault();
        if (toggled.has(workoutId)) {
            toggled.delete(workoutId);
        }
        else {
            toggled.add(workoutId);
        }

        setToggled(new Set([...toggled]));
    }

    const loadWorkout = async (workoutId, e) => {
        e.preventDefault();
        const service = new WorkoutService();
        const response = await service.loadWorkout(workoutId);
        if (response.error) {
            alert(response.error);
        }
        else {
            dispatch({ type: "SET WORKOUT", payload: new Workout(response) });
            history.push(`/timer/workout/${workoutId}`);
        }
    };

    if (error !== null) {
        return (
            <section className="page">
                <ErrorMessage message={error} />
            </section>
        );
    }

    return (
        <section className="page">
            {user !== null &&
                <h2>Käyttäjän {user.name} treenit</h2>
            }

            {loaded === false ?
                <Loader />
                :
                <div id="workouts">
                    {workouts.length === 0
                        ?
                        <div className="alert alert-primary">Et ole tallentanut vielä yhtään treeniohjelmaa.</div>
                        :
                        <table className="workouts borders">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Otsikko</th>
                                    <th>Luotu</th>
                                    <th>Pituus</th>
                                </tr>
                            </thead>

                            {workouts.map(workout =>
                                <tbody key={workout.workoutId}>
                                    <tr className="border">
                                        <td className="width-3-em">
                                            <button
                                                onClick={e => toggleWorkoutDetails(workout.workoutId, e)}
                                                className={`toggler ${toggled.has(workout.workoutId) && 'toggled'}`}>
                                                <FontAwesomeIcon icon={faChevronRight} fixedWidth />
                                            </button>
                                        </td>
                                        <td>
                                            <button className="link-button" onClick={e => loadWorkout(workout.workoutId, e)}>{workout.summary.title}</button>
                                        </td>
                                        <td><Timestamp value={workout.createdTs} /></td>
                                        <td><Time milliseconds={workout.summary.duration * 1000} /></td>
                                    </tr>
                                    {toggled.has(workout.workoutId) &&
                                        <tr>
                                            <td colSpan="4" className="expanded-content">
                                                <WorkoutDetails workoutId={workout.workoutId} />
                                                <br />
                                                <button className="call-to-action width-100" onClick={e => loadWorkout(workout.workoutId, e)}>Lataa treeni</button>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            )}
                        </table>
                    }
                </div>
            }
        </section >
    )
}