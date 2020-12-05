import React, { useState } from "react";
import Workout from "../../data/Workout";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CirquitTemplate from "../../data/CirquitTemplate";
import { CirquitGenerator, FilterParam } from "./Generators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const warmupTemplate = new CirquitTemplate({
    repeats: 1,
    rest: 60,
    exercises: [
        {
            tags: [new FilterParam("Lämmittely")],
            duration: 60,
            rest: 5
        },
        {
            tags: [new FilterParam("Lämmittely")],
            duration: 60,
            rest: 5
        },
        {
            tags: [new FilterParam("Lämmittely")],
            duration: 60,
            rest: 5
        }
    ]
});

const planksTemplate = new CirquitTemplate({
    repeats: 1,
    rest: 60,
    exercises: [
        {
            name: "Kylkilankku",
            duration: 60,
            rest: 5
        },
        {
            name: "Kylkilankku",
            duration: 60,
            rest: 5
        },
        {
            name: "Lankku",
            duration: 60,
            rest: 0
        }
    ]
});

const templates = [
    {
        name: "Neljä viiden liikkeen sarjaa",
        cirquitTemplates: [
            new CirquitTemplate({
                repeats: 2,
                rest: 120,
                exercises: [
                    {
                        tags: [new FilterParam("Core"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Jalat"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Kädet"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Vatsat"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Sykeliike")],
                        duration: 60,
                        rest: 30
                    }
                ]
            }),
            new CirquitTemplate({
                repeats: 2,
                rest: 120,
                exercises: [
                    {
                        tags: [new FilterParam("Core"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Jalat"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Kädet"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Vatsat"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Sykeliike")],
                        duration: 60,
                        rest: 30
                    }
                ]
            }),
            new CirquitTemplate({
                repeats: 2,
                rest: 120,
                exercises: [
                    {
                        tags: [new FilterParam("Core"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Jalat"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Kädet"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Vatsat"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Sykeliike")],
                        duration: 60,
                        rest: 30
                    }
                ]
            }),
            new CirquitTemplate({
                repeats: 2,
                rest: 120,
                exercises: [
                    {
                        tags: [new FilterParam("Core"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Jalat"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Kädet"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Vatsat"), new FilterParam("Sykeliike", "not"), new FilterParam("Lämmittely", "not")],
                        duration: 40,
                        rest: 20
                    },
                    {
                        tags: [new FilterParam("Sykeliike")],
                        duration: 60,
                        rest: 30
                    }
                ]
            })
        ]
    },
    {
        name: "Kymmenen tabataa",
        cirquitTemplates: [
            new CirquitTemplate({
                repeats: 4,
                rest: 60,
                exercises: [
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike", "not"), new FilterParam("Core")],
                        duration: 20,
                        rest: 10
                    },
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike", "not"), new FilterParam("Core")],
                        duration: 20,
                        rest: 10
                    }
                ]
            }),
            new CirquitTemplate({
                repeats: 8,
                rest: 60,
                exercises: [
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike", "not"), new FilterParam("Kädet")],
                        duration: 20,
                        rest: 10
                    }
                ]
            }),
            new CirquitTemplate({
                repeats: 8,
                rest: 60,
                exercises: [
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike", "not"), new FilterParam("Jalat")],
                        duration: 20,
                        rest: 10
                    }
                ]
            }),
            new CirquitTemplate({
                repeats: 4,
                rest: 60,
                exercises: [
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike", "not"), new FilterParam("Vatsat")],
                        duration: 20,
                        rest: 10
                    },
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike", "not"), new FilterParam("Vatsat")],
                        duration: 20,
                        rest: 10
                    }
                ]
            }),
            new CirquitTemplate({
                repeats: 8,
                rest: 60,
                exercises: [
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike")],
                        duration: 20,
                        rest: 10
                    }
                ]
            }),
            new CirquitTemplate({
                repeats: 4,
                rest: 60,
                exercises: [
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike", "not"), new FilterParam("Core")],
                        duration: 20,
                        rest: 10
                    },
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike", "not"), new FilterParam("Core")],
                        duration: 20,
                        rest: 10
                    }
                ]
            }),
            new CirquitTemplate({
                repeats: 8,
                rest: 60,
                exercises: [
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike", "not"), new FilterParam("Kädet")],
                        duration: 20,
                        rest: 10
                    }
                ]
            }),
            new CirquitTemplate({
                repeats: 8,
                rest: 60,
                exercises: [
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike", "not"), new FilterParam("Jalat")],
                        duration: 20,
                        rest: 10
                    }
                ]
            }),
            new CirquitTemplate({
                repeats: 4,
                rest: 60,
                exercises: [
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike", "not"), new FilterParam("Vatsat")],
                        duration: 20,
                        rest: 10
                    },
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike", "not"), new FilterParam("Vatsat")],
                        duration: 20,
                        rest: 10
                    }
                ]
            }),
            new CirquitTemplate({
                repeats: 8,
                rest: 60,
                exercises: [
                    {
                        tags: [new FilterParam("Lämmittely", "not"), new FilterParam("Sykeliike")],
                        duration: 20,
                        rest: 10
                    }
                ]
            })
        ]
    },
];

export default function WorkoutTemplatesView() {

    const { user, exerciseTypes } = useSelector(state => state);
    const [warmup, setWarmup] = useState(false);
    const [planks, setPlanks] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    const onWorkoutTemplateSelect = (e, template) => {
        e.stopPropagation();
        e.preventDefault();

        const cirquitGenerator = new CirquitGenerator();

        const workout = new Workout({ author: user?.name });

        if (warmup) {
            const cirquit = cirquitGenerator.generateCirquitFromTemplate(warmupTemplate, exerciseTypes);
            workout.cirquits.push(cirquit);
        }

        template.cirquitTemplates.forEach(template => {
            const usedExerciseNames = workout.exerciseNames;
            const unusedExerciseTypes = exerciseTypes.filter(exerciseType => !usedExerciseNames.find(name => name === exerciseType.name));
            const cirquit = cirquitGenerator.generateCirquitFromTemplate(template, unusedExerciseTypes);
            workout.cirquits.push(cirquit);
        });

        if (planks) {
            const cirquit = cirquitGenerator.generateCirquitFromTemplate(planksTemplate, exerciseTypes);
            workout.cirquits.push(cirquit);
        }

        dispatch({ type: "SET WORKOUT", payload: workout });
        history.push(`/workout`);
    }

    const onCreateEmptyWorkout = e => {

        const cirquitGenerator = new CirquitGenerator();

        const workout = new Workout({ author: user?.name });

        if (warmup) {
            const cirquit = cirquitGenerator.generateCirquitFromTemplate(warmupTemplate, exerciseTypes);
            workout.cirquits.push(cirquit);
        }

        if (planks) {
            const cirquit = cirquitGenerator.generateCirquitFromTemplate(planksTemplate, exerciseTypes);
            workout.cirquits.push(cirquit);
        }

        dispatch({ type: "SET WORKOUT", payload: workout });
        history.push(`/workout`);
    }

    return (
        <section className="page">

            <h2>Minkä tyyppinen ohjelma luodaan?</h2>
            <form>
                <div className="mt-4 mb-3">
                    <button className="primary width-100" onClick={e => onCreateEmptyWorkout(e)}>Luo tyhjä pohja</button>
                </div>
                {templates.map(template =>
                    <div key={template.name} className="mb-3">
                        <button className="primary width-100" onClick={e => onWorkoutTemplateSelect(e, template)}>{template.name}</button>
                    </div>
                )}
                <hr/>
                <div className="mb-3">
                    <button id="workout-templates-warmup" className={`pretty checkbox`} onClick={e => setWarmup(!warmup)}>
                        {warmup && <FontAwesomeIcon icon={faCheck} fixedWidth />}
                    </button>
                    <label className="ml-3" for="workout-templates-warmup">Lämmittely</label>
                </div>
                <div className="mb-3">
                    <button id="workout-templates-planks" className={`pretty checkbox`} onClick={e => setPlanks(!planks)}>
                        {planks && <FontAwesomeIcon icon={faCheck} fixedWidth />}
                    </button>
                    <label className="ml-3" for="workout-templates-planks">Lankkuhaaste</label>
                </div>
            </form>
        </section>
    )
}