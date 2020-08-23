import React from "react"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./Loader.css"

export default function Loader() {
    return (
        <div className="loader">
            <FontAwesomeIcon icon={faCircleNotch} spin/>
        </div>
    )
}