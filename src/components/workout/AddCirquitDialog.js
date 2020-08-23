import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CirquitTemplate from "../../data/CirquitTemplate";
import { CirquitGenerator, FilterParam } from "./Generators";
import Modal from "../common/Modal";
import "./AddCirquitDialog.css";

const templates = [
    new CirquitTemplate({
        name: "Lämmittely",
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
    }),
    new CirquitTemplate({
        name: "4 liikettä 40/20 + minuutin sykeliike * 2 kierrosta",
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
        name: "4 liikettä 40/20 * 2 kierrosta",
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
            }
        ]
    }),
    new CirquitTemplate({
        name: "1 liike 20/10 * 8 kierrosta",
        repeats: 8,
        rest: 60,
        exercises: [
            {
                tags: [new FilterParam("Lämmittely", "not")],
                duration: 20,
                rest: 10
            }
        ]
    }),
    new CirquitTemplate({
        name: "1 liike 40/10 * 2 + 20/10 * 4 kierrosta",
        repeats: 1,
        rest: 60,
        exercises: [
            {
                tags: [new FilterParam("Lämmittely", "not")],
                sideSwitch: true,
                duration: 40,
                rest: 10
            },
            {
                sameAsPrevious: true,
                duration: 40,
                rest: 10
            },
            {
                sameAsPrevious: true,
                duration: 20,
                rest: 10
            },
            {
                sameAsPrevious: true,
                duration: 20,
                rest: 10
            },
            {
                sameAsPrevious: true,
                duration: 20,
                rest: 10
            },
            {
                sameAsPrevious: true,
                duration: 20,
                rest: 10
            }
        ]
    }),
    new CirquitTemplate({
        name: "1 liike 20/10 * 6 kierrosta",
        repeats: 6,
        rest: 60,
        exercises: [
            {
                tags: [new FilterParam("Lämmittely", "not")],
                duration: 20,
                rest: 10
            }
        ]
    }),
    new CirquitTemplate({
        name: "3 liikettä 20/10 * 6 kierrosta",
        repeats: 2,
        rest: 60,
        exercises: [
            {
                tags: [new FilterParam("Sykeliike", "not")],
                sideSwitch: true,
                duration: 20,
                rest: 10
            },
            {
                sameAsPrevious: true,
                duration: 20,
                rest: 10
            },
            {
                useTagsFromPrevious: true,
                sideSwitch: false,
                duration: 20,
                rest: 10
            }
        ]
    }),
    new CirquitTemplate({
        name: "Lankkuhaaste",
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
    })
];

export default function AddCirquitDialog() {

    const { cirquitTemplateSelect, exerciseTypes, workout } = useSelector(state => state);
    const dispatch = useDispatch();

    const onClose = e => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({ type: "CLOSE CIRQUIT TEMPLATE SELECT" });

    }

    const onCirquitTemplateSelect = (e, template) => {
        e.stopPropagation();
        e.preventDefault();

        const usedExerciseNames = workout.exerciseNames;
        const unusedExerciseTypes = exerciseTypes.filter(exerciseType => !usedExerciseNames.find(name => name === exerciseType.name));

        const cirquitGenerator = new CirquitGenerator();
        const cirquit = cirquitGenerator.generateCirquitFromTemplate(template, unusedExerciseTypes);

        dispatch({ type: "ADD CIRQUIT", payload: { index: cirquitTemplateSelect.index, cirquit } });
        dispatch({ type: "CLOSE CIRQUIT TEMPLATE SELECT" });
        if (cirquitTemplateSelect.callback) {
            cirquitTemplateSelect.callback(cirquit);
        }
        
        setTimeout(()=>{
            const element = document.getElementById(cirquit.id);
            if (element) {
                element.scrollIntoView(true);
            }
        },200);
        
    }

    const onCreateEmptyCirquit = (e) => {
        dispatch({ type: "CREATE NEW CIRQUIT", payload: { index: cirquitTemplateSelect.index } });
        dispatch({ type: "CLOSE CIRQUIT TEMPLATE SELECT" });
    }

    if (!cirquitTemplateSelect.show) {
        return (<></>);
    }

    return (
        <Modal title={"Uuden liikesarja lisääminen"} onClose={onClose}>
            <div className="cirquit-template">
                <button className="primary width-100" onClick={e => onCreateEmptyCirquit(e)}>Tyhjä liikesarja</button>
            </div>
            <br />
            {templates.map(template =>
                <div className="cirquit-template">
                    <button className="primary width-100" onClick={e => onCirquitTemplateSelect(e, template)}>{template.name}</button>
                </div>
            )}
        </Modal>
    )
}