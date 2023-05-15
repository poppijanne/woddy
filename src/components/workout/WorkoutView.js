import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CirquitEditor from "./CirquitEditor";
import "./WorkoutView.css";
import Time from "../timer/Time";
import WorkoutService from "../../services/WorkoutService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faEdit,
  faPlus,
  faChevronDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Workout from "../../data/Workout";
import { useParams } from "react-router-dom";
import Timestamp from "../common/Timestamp";

export default function WorkoutView() {
  const [editId, setEditId] = useState(null);
  const { workout, exerciseTypes, user } = useSelector((state) => state);
  const { workoutId } = useParams();
  const dispatch = useDispatch();

  const exerciseNames = workout.exerciseNames;
  const equipment = new Set([]);

  exerciseNames.forEach((exerciseName) => {
    const type = exerciseTypes.find((type) => type.name === exerciseName);
    if (type) {
      type.equipment.forEach((e) => equipment.add(e));
    }
  });

  const loadWorkout = async (workoutId) => {
    const service = new WorkoutService();
    const response = await service.loadWorkout(workoutId);
    if (response.error) {
      alert(response.error);
    } else {
      dispatch({ type: "SET WORKOUT", payload: new Workout(response) });
    }
  };

  useEffect(() => {
    if (workoutId !== undefined && workoutId !== workout?.id) {
      loadWorkout(workoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout?.id, workoutId]);

  const saveWorkout = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const summary = {
      title: workout.title,
      info: workout.info,
      tags: workout.tags,
      duration: workout.duration,
      equipment: [...equipment],
    };

    const service = new WorkoutService();
    const result = await service.saveWorkout(workout, summary, user.id);

    if (result.error) {
      alert("Tallennus epäonnistui: " + result.error.message);
    } else {
      alert("Tallennus onnistui");
      dispatch({ type: "SET WORKOUT", payload: new Workout(result.workout) });
    }
  };

  const deleteWorkout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const service = new WorkoutService();
    const result = await service.deleteWorkout(workout.id);

    if (result.error) {
      alert("Poisto epäonnistui: " + result.error.message);
    } else {
      alert("Poisto onnistui");
      dispatch({ type: "SET WORKOUT", payload: new Workout(result.workout) });
    }
  };

  const createNewCirquit = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    //dispatch({ type: "CREATE NEW CIRQUIT", payload: { index } });
    dispatch({ type: "OPEN CIRQUIT TEMPLATE SELECT", payload: { index } });
  };

  const handleTitleChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET WORKOUT TITLE", payload: { title: e.target.value } });
  };

  const handleAuthorChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: "SET WORKOUT AUTHOR",
      payload: { author: e.target.value },
    });
  };

  const openCountDownSelect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: "OPEN NUMBER SELECT",
      payload: {
        values: [workout.countDown],
        settings: {
          title: "Valitse valmistautumisen pituus",
          min: 0,
          max: 120,
          step: 5,
          columns: 4,
        },
        actionGenerator: (countDown) => {
          return { type: "SET WORKOUT COUNTDOWN", payload: { countDown } };
        },
      },
    });
  };

  const handleInfoChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET WORKOUT INFO", payload: { info: e.target.value } });
  };

  return (
    <>
      <form onSubmit={saveWorkout}>
        {/* 
            <div className="workout-total-duration">
                <Time milliseconds={workout.duration*1000}/>
            </div>
            */}
        <div className="workout-layout">
          {user !== null && (
            <>
              <div className="buttons">
                <button type="submit" className="primary">
                  <FontAwesomeIcon icon={faSave} fixedWidth />
                  &nbsp;TALLENNA
                </button>
                {workout.createdTs && (
                  <button onClick={deleteWorkout} className="primary">
                    <FontAwesomeIcon icon={faTrash} fixedWidth />
                    &nbsp;POISTA
                  </button>
                )}
              </div>
              <br />
            </>
          )}
          <h1 className="workout-name">{workout.title}</h1>
          {user !== null && (
            <>
              {workout.createdTs && (
                <div>
                  <label>
                    Luotu: <Timestamp value={workout.createdTs} />
                  </label>
                </div>
              )}
              {workout.modifiedTs &&
                workout.modifiedTs !== workout.createdTs && (
                  <div>
                    <label>
                      Päivitetty: <Timestamp value={workout.modifiedTs} />
                    </label>
                  </div>
                )}
              <div>
                <label>
                  Kesto: <Time milliseconds={workout.duration * 1000} />
                </label>
              </div>
              <div>
                <label>Tagit: {workout.tags.join(", ")}</label>
              </div>
              <div>
                <label>Välineet: {[...equipment].join(", ")}</label>
              </div>
              <hr />

              <div className="form-row">
                <label>Treenin nimi</label>
                <input
                  type="text"
                  value={workout.title}
                  onChange={handleTitleChange}
                />
              </div>
              <div className="form-row">
                <label>Tekijä</label>
                <input
                  type="text"
                  value={workout.author}
                  onChange={handleAuthorChange}
                />
              </div>
              <div className="form-row">
                <label>Kuvaus</label>
                <textarea value={workout.info} onChange={handleInfoChange} />
              </div>
            </>
          )}

          <div className="form-row">
            <label>Lähtölaskenta</label>
            <button onClick={openCountDownSelect} className="pretty input">
              {workout.countDown} sekuntia
              <span className="icon">
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </button>
          </div>

          <hr />

          <div>
            <h2>Liikesarjat</h2>
          </div>

          <button onClick={(e) => createNewCirquit(e, 0)} className="secondary">
            <FontAwesomeIcon icon={faPlus} />
            &nbsp;Lisää sarja
          </button>

          {workout.cirquits.map((cirquit, index, cirquits) => (
            <>
              <CirquitEditor
                key={cirquit.id}
                index={index}
                cirquit={cirquit}
                edit={editId === cirquit.id}
                setEditId={setEditId}
                isLast={index === cirquits.length - 1}
              />
              <button
                onClick={(e) => createNewCirquit(e, index + 1)}
                className="secondary"
              >
                <FontAwesomeIcon icon={faPlus} />
                &nbsp;Lisää sarja
              </button>
            </>
          ))}
        </div>
      </form>
    </>
  );
}
