export default function generateID(pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx') {
    return pattern.replace(/[xy]/g, function (c) {
        // eslint-disable-next-line no-mixed-operators
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}