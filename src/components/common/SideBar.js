import React from "react"
import { useSelector, useDispatch } from "react-redux";
import "./SideBar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function SideBar({ children }) {

    const {sideBar, selectedExercises} = useSelector(state => state);
    const dispatch = useDispatch();

    const closeBar = e => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({type: "CLOSE SIDE BAR"});
    }

    return (
        <div
            className={`side-nav ${selectedExercises.size > 0 ? sideBar.menu !== null ? 'sub-menu' : '' : 'hidden'}`} >
            {children}
            <div className="side-nav-close" role="button" tabIndex="0" onClick={closeBar}>
                <div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
            </div>
        </div>
    )
}