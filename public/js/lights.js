const sendLights = () => {
        let lights = document.getElementById("lightContainer").children;
        let lightArray = [];
        for (let i = 0; i < lights.length; i++) {
            let val = lights[i].value;
            let r = Math.floor(parseInt(val.substring(1, 3), 16) / 10);
            let g = Math.floor(parseInt(val.substring(3, 5), 16) / 10);
            let b = Math.floor(parseInt(val.substring(5, 7), 16) / 10);
            
            lightArray.push([r,g,b]);
        }
        console.log(lightArray);
    }
const submitRange = () => {
    let val = document.getElementById("rangeSelect").value;
    let start = document.getElementById("range").value;
    let end = document.getElementById("range2").value;
    for (node of document.getElementById("lightContainer").children) {
        if(parseInt(node.name) >= start && parseInt(node.name) <= end) {
            node.value = val;
        }
    }
    
}
const range = document.getElementById('range'),
rangeV = document.getElementById('rangeV'),
setValue = ()=>{
    const
    newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) ),
    newPosition = 10 - (newValue * 0.2);
    rangeV.innerHTML = `<span>${range.value}</span>`;
    rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
};
const range2 = document.getElementById('range2'),
rangeV2 = document.getElementById('rangeV2'),
setValue2 = ()=>{
    const newValue = Number( (range2.value - range2.min) * 100 / (range2.max - range2.min) ),
    newPosition = 10 - (newValue * 0.2);
    rangeV2.innerHTML = `<span>${range2.value}</span>`;
    rangeV2.style.left = `calc(${newValue}% + (${newPosition}px))`;
};
document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener('input', setValue);
document.addEventListener("DOMContentLoaded", setValue2);
range2.addEventListener('input', setValue2);