import React from "react"

export default function Message({children}) {
    return (
        <div className="alert alert-primary" role="alert">{children}</div>
    )
}