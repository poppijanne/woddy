import React, { useEffect } from "react"

export default function useLayoutHeight(id) {
    useEffect(() => {
        
        const layout = document.getElementById(id);
        if (layout) {
            const nav = document.getElementById("navigation");
            const footer = document.getElementById("footer");
            layout.style.height = Math.floor((window.innerHeight - (nav.scrollHeight + footer.scrollHeight))) + "px";
        }
    })
}