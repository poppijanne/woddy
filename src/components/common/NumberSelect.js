import React from "react"
import "./NumberSelect.css"

export default function NumberSelect({ values = [], min = 0, max = 100, step = 5, onNumberSelect, columns = 5 }) {

    let numbers = [];
    for (let i = min; i <= max; i += step) {
        numbers.push(i);
    }

    const isSelected = number => {
        return values.find(value => value === number);
    }

    return (
        <div className={`number-grid number-grid-${columns}-cols`}>
            {numbers.map(number =>
                <button
                    key={number}
                    onClick={e => onNumberSelect(e, number)}
                    className={`number-button ${isSelected(number) ? 'selected' : ''}`}>
                    {number}
                </button>)
            }
        </div>
    )
}