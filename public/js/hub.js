const colors = {
    impColor: "#FFC038",
    impSat: .5,
    user: "#54F8E0"
}
function isOverflown(element) {
    return element.scrollHeight > element.clientHeight ||   element.scrollWidth > element.clientWidth;
}
window.onload = function addListeners() {
    document.getElementById("table").addEventListener("click", event => {
        if (event.target.className == "api") {
            Array.from(document.getElementsByClassName("api")).forEach(btn => {
                btn.style.color = colors.impColor;
                btn.style.opacity = colors.impSat;
            })
            event.target.style.opacity = .955;
            event.target.style.color = "#54F8E0";
        }
    });
    document.getElementById('input').addEventListener("keydown", function (event) {
        if (event.key == "Enter") {
            let output = document.getElementById('output');
            let userInput = document.createElement('P');
            userInput.innerHTML = "> " + event.target.value;
            userInput.style.color = colors.user;
            output.appendChild(userInput);
            if (isOverflown(output)){
                output.firstElementChild.remove();
            }
        }
    });
    
}
const socket = io();
socket.on('response', data => {
    let output = document.getElementById('output');
    let response = document.createElement('P');
    response.innerHTML = "ATLAS: " + data.message;
    output.appendChild(response);
    if (isOverflown(output)) {
        output.firstElementChild.remove();
    }
});