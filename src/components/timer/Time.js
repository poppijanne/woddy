import React from "react"

export default function Time({ milliseconds, className }) {
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const seconds = Math.floor((milliseconds / 1000) % 60);
    return (
        <span className={className}>{minutes > 0 && minutes + ":"}{minutes > 0 && seconds < 10 && '0'}{seconds}</span>
    )
}