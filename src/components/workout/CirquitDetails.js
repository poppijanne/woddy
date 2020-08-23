import React from "react";
import styles from './CirquitDetails.module.css';

export default function CirquitDetails({ cirquit, index, showHeader = true }) {
    if (!cirquit) {
        return (<></>);
    }

    return (
        <section className={styles["cirquit-details"]}>
            <table className={`${styles["exercises-table"]} no-borders`}>
                <thead>
                    {showHeader &&
                        <tr>
                            <th className="font-header font-size-l">Sarja {index}</th>
                            <th></th>
                            <th className="font-header center font-size-l">&times; {cirquit.repeats}</th>
                        </tr>
                    }
                    <tr>
                        <th className="left extra-small-text">Liike</th>
                        <th className="center width-3-em extra-small-text">Kesto</th>
                        <th className="center width-3-em extra-small-text">Lepo</th>
                    </tr>
                </thead>
                <tbody>
                    {cirquit.exercises.map((exercise, index) =>
                        <tr key={exercise.id} className="border">
                            <td className={`${styles["exercise-title"]} font-header font-size-l left`}>
                                {cirquit.exercises.length > 1 && <div className={styles.index}>{index+1}.</div>}{exercise.name}
                            </td>
                            <td className="font-header font-size-l center">{exercise.duration}</td>
                            <td className="font-header font-size-l center">{exercise.rest}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    )
}