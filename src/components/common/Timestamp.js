import React from "react"

export default function Timestamp({ value }) {
    return (
        <>{new Date(value).toLocaleDateString("fi-FI")}</>
    )
}