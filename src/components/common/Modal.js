import React from "react"
import "./Modal.css"

export default function Modal({ title, children, onClose }) {

    return (
        <div className="modal-overlay">
            <div className="dialog" role="dialog">
                <div className="header">
                    <div className="title">{title}</div>
                    <button onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    )
}