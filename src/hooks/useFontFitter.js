import { useEffect } from "react"

export default function useFontFitter({
    containerId,
    targetId,
    min = 1,
    max = 10,
    step = 0.5,
    dependencies = [],
    fixJustifyContent = true }) {


    useEffect(() => {

        const container = document.getElementById(containerId);
        const target = document.getElementById(targetId);

        //console.log(containerId)

        if (container && target) {
            let i = 0;
            let fontSize = min;
            //target.style.transition = "font-size 0s";
            //const originalFontSize = target.style.fontSize;
            target.style.fontSize = fontSize + "em";
            //console.log(container.scrollHeight + " <= " + container.clientHeight + " && " + container.scrollWidth + " <= " + container.clientWidth)
            while ((container.scrollHeight <= container.clientHeight && container.scrollWidth <= container.clientWidth) && i < 50) {

                fontSize += step;
                //console.log(fontSize)
                //console.log(container.scrollHeight + " <= " + container.clientHeight + " && " + container.scrollWidth +" <= " + container.clientWidth)

                if (fontSize < max) {
                    target.style.fontSize = fontSize + "em";
                }
                else {
                    fontSize = max;
                    break;
                }
                i++;
            }

            //console.log(containerId + fixJustifyContent)

            if (fixJustifyContent === true) {
                if (fontSize === max || i === 50) {
                    container.style.justifyContent = "center";
                }
                else {
                    container.style.justifyContent = "start";
                }
            }
            //target.style.fontSize = originalFontSize;
            //container.style.transition = "font-size 0.3s";
            target.style.fontSize = Math.max(min, (fontSize - step)) + "em";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.innerHeight, window.innerWidth, ...dependencies])
}