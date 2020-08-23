import React, { useState } from "react"
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faArrowUp, faArrowDown, faPlay } from "@fortawesome/free-solid-svg-icons";
import NumberSelect from "./NumberSelect";
import SideBar from "./SideBar";

export default function CirquitSideBar() {
    const [subMenu, setSubMenu] = useState(null);
    const { selectedCirquits, workout } = useSelector(state => state);

    const cirquits = [...selectedCirquits].map(cirquitId => workout.cirquits.find(cirquit => cirquit.id === cirquitId));

    const dispatch = useDispatch();
    const history = useHistory();

    const handleStart = e => {
        e.stopPropagation();
        e.preventDefault();
        //dispatch({ type: "SKIP TO", payload: (workout.getCirquitStartTime(index) - workout.countDown) * 1000 });
        history.push(`/timer/workout/${workout.id}/cirquit/${cirquits[0].id}`);
    }

    const changeCirquitRepeats = (e, value) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({ type: "SET CIRQUIT REPEATS", payload: { exerciseIds: [...selectedCirquits], duration: value } });
        setSubMenu(null);
    }

    const changeCirquitRest = (e, value) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({ type: "SET CIRQUIT RESTS", payload: { exerciseIds: [...selectedCirquits], rest: value } });
        setSubMenu(null);
    }

    const deleteCirquit = e => {
        dispatch({ type: "DELETE CIRQUITS", payload: { exerciseIds: [...selectedCirquits] } })
    }

    const copyCirquit = e => {
        e.stopPropagation();
        dispatch({ type: "COPY CIRQUITS", payload: { exerciseIds: [...selectedCirquits] } })
    }

    const moveCirquitUp = e => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({ type: "MOVE CIRQUITS UP", payload: { exerciseIds: [...selectedCirquits] } })
    }

    const moveCirquitDown = e => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({ type: "MOVE CIRQUITS DOWN", payload: { exerciseIds: [...selectedCirquits] } })
    }

    const selectSubMenu = (e, menu) => {
        e.stopPropagation();
        if (subMenu === menu) {
            setSubMenu(null);
        }
        else {
            setSubMenu(menu);
        }
    }

    const repeats = cirquits.map(cirquit => cirquit.repeats);
    const rests = cirquits.map(cirquit => cirquit.rest);

    return (
        <SideBar show={cirquits.length > 0} showSubMenus={subMenu}>

            <div className="side-nav-buttons">
                <button className={`side-nav-button sub-menus ${subMenu === "repeats" ? " selected" : ""}`} onClick={e => selectSubMenu(e, "repeats")}>
                    Kierroksia
                </button>
                <button className={`side-nav-button sub-menus ${subMenu === "rest" ? " selected" : ""}`} onClick={e => selectSubMenu(e, "rest")}>
                    Lepo
                </button>
                <button className="side-nav-button" onClick={handleStart} onDoubleClick={handleStart}>
                    <FontAwesomeIcon icon={faPlay} fixedWidth />
                </button>
                <button className="side-nav-button" onClick={moveCirquitUp} onDoubleClick={moveCirquitUp}>
                    <FontAwesomeIcon icon={faArrowUp} fixedWidth />
                </button>
                <button className="side-nav-button" onClick={moveCirquitDown} onDoubleClick={moveCirquitDown}>
                    <FontAwesomeIcon icon={faArrowDown} fixedWidth />
                </button>
                <button className="side-nav-button" onClick={copyCirquit}>
                    <FontAwesomeIcon icon={faPlus} fixedWidth />
                </button>
                <button className="side-nav-button" onClick={deleteCirquit}>
                    <FontAwesomeIcon icon={faTimes} fixedWidth />
                </button>
            </div>
            {subMenu === "repeats" &&
                <div className="side-nav-content">
                    <NumberSelect
                        values={repeats} onNumberSelect={changeCirquitRepeats}
                        min={1}
                        max={20}
                        step={1} />
                </div>
            }
            {subMenu === "rest" &&
                <div className="side-nav-content">
                    <NumberSelect
                        values={rests} onNumberSelect={changeCirquitRest}
                        min={0}
                        max={240}
                        step={5} />
                </div>
            }
        </SideBar>
    )
}