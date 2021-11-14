const NOAPI = -1;
const SPOON = 0;
const WEATHER = 1;
const STOCKS = 2;
const TALK = 3;
const SPOTIFY = 4;
const LIGHTS = 5;
const socket = io();
var apiSelected = NOAPI;

const colors = {
    impColor: "#FFC038",
    impSat: .5,
    user: "#54F8E0"
}
function isOverflown(element) {
    return element.scrollHeight > element.clientHeight ||   element.scrollWidth > element.clientWidth;
}
function sendMessage(message) {
    if (message === undefined) {
        message = document.getElementById("userInteract").value;
        if (message == "" || message == " ") return;
    }
    let output = document.getElementById('output');
    let userInput = document.createElement('P');
    userInput.innerHTML = "> " + message;
    userInput.style.color = colors.user;
    output.appendChild(userInput)
    if (isOverflown(output)) {
        output.firstElementChild.remove();
    }
    document.getElementById("input").value = "";
    socket.emit("message", { message, apiSelected });
}
function setUpLights() {
    let pw = prompt("Enter Password for Lights: ", "none");
    if (pw != null && pw != "" && pw != "none") {
        socket.emit("lights", { pw });
    }
}
function addListeners(){
    document.getElementById("table").addEventListener("click", event => {
        if (event.target.className == "api") {
            Array.from(document.getElementsByClassName("api")).forEach(btn => {
                btn.style.color = colors.impColor;
                btn.style.opacity = colors.impSat;
            })
            event.target.style.opacity = .955;
            event.target.style.color = "#54F8E0";
            switch (event.target.id) {
                case "spoon":
                    apiSelected = SPOON;
                    break;
                case "weather":
                    apiSelected = WEATHER;
                    break;
                case "stocks":
                    apiSelected = STOCKS;
                    break;
                case "talk":
                    apiSelected = TALK;
                    break;
                case "spotify":
                    apiSelected = SPOTIFY;
                    break;
                case "lights":
                    apiSelected = LIGHTS;
                    setUpLights();
                    break;
                default:
                    apiSelected = NOAPI;
                    break;
            }
        }
        if (apiSelected != LIGHTS) {
            document.getElementById("output").style.visibility = "visible";
            document.getElementById("userInteract").style.visibility = "visible";
            document.getElementById("lightsDiv").style.visibility = "hidden";
        }
    });
    
    document.getElementById('input').addEventListener("keydown", function (event) {
        if (event.key == "Enter") {
            sendMessage(event.target.value);
        }
    });
    
    document.getElementById('sendBtn').onclick = function () {
        let msg = document.getElementById("input").value;
        sendMessage(msg);
    };
}
socket.on('response', data => {
    let output = document.getElementById('output');
    let response = document.createElement('P');
    response.innerHTML = "ATLAS: " + data.message;
    output.appendChild(response);
    if (isOverflown(output)) {
        output.firstElementChild.remove();
    }
});
socket.on('goToLights', () => {
    window.location.href = "/hub/lights";
});
socket.on('lightsFailed', () => {
    alert("Incorrect Password");
});
