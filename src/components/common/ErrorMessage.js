import React from "react"

export default function ErrorMessage({message}) {
    return (
        <div className="alert alert-danger" role="alert">{message}</div>
    )
}