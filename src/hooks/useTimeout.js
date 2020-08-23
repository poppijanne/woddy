import React, { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux";

export default function useTimeout() {
    const [tick, setTick] = useState(0);
    const tickRef = useRef();
    tickRef.current = tick;
    const state = useSelector(state => state);

    useEffect(() => {
        //if (state.timer.start !== null) {
        const now = new Date().getMilliseconds();
        const nextFullSecond = Math.ceil(now / 1000) * 1000;
        const wait = nextFullSecond - now;
        //console.log(nextFullSecond - now)
        const timeout = setTimeout(() => {
            //console.log("tick")
            setTick(tickRef.current + 1);
        }, /*tickRef.current === 0 ? 0 : 1000*/wait);
        return () => clearTimeout(timeout);
        //}
    }, [tick])

    return { ...state, tick }
}