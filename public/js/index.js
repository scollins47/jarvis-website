import {
    Scene, WebGLRenderer, PerspectiveCamera, SphereGeometry, MeshDepthMaterial, Mesh
} from 'https://cdn.skypack.dev/three@0.130';
import * as THREE from "https://cdn.skypack.dev/three@0.130";
import { EffectComposer } from "https://cdn.skypack.dev/three@0.130/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.skypack.dev/three@0.130/examples/jsm/postprocessing/RenderPass.js";
import { AfterimagePass } from "https://cdn.skypack.dev/three@0.130/examples/jsm/postprocessing/AfterimagePass.js";

const CENTERCIRCLEFORUMULA = (x,r=RADIUS) => {
    return Math.sqrt(Math.pow(r,2) - Math.pow(x,2));
}
const RADIUS = 200;
const HEIGHT = 700;
const WIDTH = 900;
const fov = 45;
const aspect = innerWidth/innerHeight;
const near = .1;
const far = 1000;
const camera = new PerspectiveCamera(fov, aspect, near, far);
camera.position.set(1, near, far);
const WIDTHMAX = 650; //so the circle doesnt go off screen
const WIDTHMIN = -650;
const HEIGHTMAX = 350;
const HEIGHTMIN = -350;
let SPEEDLIMIT = 2.5;
var MESSAGEINCOMING = false;
const scene = new Scene();
const light = new THREE.DirectionalLight(0xffffff, .5);
light.position.set(0, 0, 1);
scene.add(light);
const colors = {
    basicColor: 0x8318bb,
    lightBlue: 0x00a4cc,
    blue: 0x0000c8,
    grey: 0x808080,
    green: 0x00b100
}

let renderer = new WebGLRenderer({
    antialias: true
});
renderer.setSize(WIDTH, HEIGHT);
let renDOM = renderer.domElement;
renDOM.id = "threejs";
document.body.appendChild(renDOM);

let composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

let afterimagePass = new AfterimagePass(.90);
console.log(afterimagePass);
composer.addPass(afterimagePass);

const getRandomValBetween = function(min, max){
    return (Math.random() * (max - min)) + min  + 1;
}
const makeSphere = function (color1=0x00b800, color2=0x0000b8, isWireFrame = false) {

    const geometry = new SphereGeometry(60, 35, 35);
    geometry.computeBoundingBox();

    const material = new THREE.ShaderMaterial({
        uniforms: {
            color1: {
                value: new THREE.Color(color1)
            },
            color2: {
                value: new THREE.Color(color2)
            },
            bboxMin: {
                value:geometry.boundingBox.min
            },
            bboxMax: {
                value: geometry.boundingBox.max
            }
        },
        vertexShader: `
            uniform vec3 bboxMin;
            uniform vec3 bboxMax;
        
            varying vec2 vUv;

            void main() {
            vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
        
            varying vec2 vUv;
            
            void main() {
            
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
            }
        `,
        wireframe: isWireFrame
    });

    return new Mesh(geometry, material);
}

class Orb{
    constructor(sphere, modifiers = {
        dx: getRandomValBetween(-.5, .5),
        dy: getRandomValBetween(-.5, .5),
        inert:getRandomValBetween(-.5,.5)
    }) {
        this.sphere = sphere;
        this.modifiers = modifiers;
    }
    getSphere() {
        return this.sphere;
    }
    getModifiers() {
        return this.modifiers;
    }
}

const setupSpheres = function (numOfSpheres,modifiers, color1, color2) {
    let temp = [];
    while (numOfSpheres-- > 0) {
        let sphere = makeSphere(color1, color2, true);
        sphere.position.x = getRandomValBetween(-300, 300);
        sphere.position.y = getRandomValBetween(-300, 300);
        sphere.rotation.x = 1;
        let orb = new Orb(sphere)
        temp.push(orb);
    }
    return temp;
}
let centerSphere = makeSphere(colors.lightBlue, colors.grey, true);
let centerModifiers = { dx: 0, dy: 0 };
centerSphere.position.x = RADIUS;
centerSphere.position.y = 0;
scene.add(centerSphere);


const stayInBounds = function (sphere, modifiers) {
    let spherePosition = sphere.position;
    modifiers.dx += (centerSphere.position.x - spherePosition.x) / (SPEEDLIMIT * 100);
    modifiers.dy += (centerSphere.position.y - spherePosition.y) / (SPEEDLIMIT * 100);
    if (Math.round(spherePosition.x) == Math.round(centerSphere.position.x) && Math.round(spherePosition.y) == Math.round(centerSphere.position.y)) {
        modifiers.dx *= 1.5;
        modifiers.dy *= 1.5;
    }
    if (spherePosition.x <= WIDTHMIN) {
        modifiers.dx = Math.abs(modifiers.dx);
    }
    if (spherePosition.x >= WIDTHMAX) {
        modifiers.dx = -1 * Math.abs(modifiers.dx);
    }
    if (spherePosition.y >= HEIGHTMAX) {
        modifiers.dy = -1 * Math.abs(modifiers.dy);
    }
    if (spherePosition.y <= HEIGHTMIN) {
        modifiers.dy = Math.abs(modifiers.dy);
    }
    if (Math.abs(modifiers.dx) >= SPEEDLIMIT) {
        modifiers.dx /= 1.05;
    }
    if (Math.abs(modifiers.dy) >= SPEEDLIMIT) {
        modifiers.dy /= 1.05;
    }
    if (centerSphere.position.x >= WIDTHMAX) {
        centerModifiers.dx = -1 * Math.abs(centerModifiers.dx);
    }
    if (centerSphere.position.x <= WIDTHMIN) {
        centerModifiers.dx = Math.abs(centerModifiers.dx);
    }
    if (centerSphere.position.y <= HEIGHTMIN) {
        centerModifiers.dy = Math.abs(centerModifiers.dy);
    }
    if (centerSphere.position.y >= HEIGHTMAX){
        centerModifiers.dy = -1 * Math.abs(centerModifiers.dy)
    }
    
}
let deg = 1;
/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} r 
 * 
 * @returns [x,y] cordinates
 */
const getNextCords = function (sphere) {
    sphere.position.x = Math.cos(deg * (Math.PI / 180)) * RADIUS;
    sphere.position.y = CENTERCIRCLEFORUMULA(sphere.position.x);
    deg += .5;
    if (deg > 180) {
        sphere.position.y = -1 * sphere.position.y;
    }
    if (deg > 360) {
        sphere.position.y = Math.abs(sphere.position.y);
        deg = 0;
    }
}
const applyModifiers = function (sphere, modifiers) {
    sphere.position.x += modifiers.dx;
    sphere.position.y += modifiers.dy;
    sphere.rotation.y += .01;
    let nudge = Math.random();
    if (nudge < .1) {
        modifiers.dx += .1;
        modifiers.dy += .1;
    } else if (nudge < .2) {
        modifiers.dx += -.1;
        modifiers.dy += .1;
    } else if (nudge < .3) {
        modifiers.dx += .1;
        modifiers.dy += -.1;
    } else if(nudge < .4){
        modifiers.dx += -.1;
        modifiers.dy += -.1;
    }
    if (MESSAGEINCOMING) {
        if (sphere.rotation.x.toFixed(2) != -1) {
            sphere.rotation.x -= .1;
        } else {
            MESSAGEINCOMING = false;
            SPEEDLIMIT = 2.5;
        }
    }
    if(sphere.rotation.x.toFixed(2) != 1 && !MESSAGEINCOMING) {
        sphere.rotation.x += .005;
    }
    
}

let orbs = setupSpheres(20,{dx:0, dy:0},colors.green, colors.grey);
orbs.forEach(orb => {
    scene.add(orb.sphere);
});

const animate = function () {
    requestAnimationFrame(animate);
    orbs.forEach(orb => {
        if (MESSAGEINCOMING) {
            orb.getModifiers().dx *= 1.08;
            orb.getModifiers().dy *= 1.08;
        }
        applyModifiers(orb.getSphere(), orb.getModifiers());
        stayInBounds(orb.getSphere(), orb.getModifiers());
    });
    centerSphere.rotation.x += .02;
    centerSphere.rotation.y += .02;
    centerSphere.rotation.z += .02;
    getNextCords(centerSphere);
    composer.render();
    (async () => {
        setTimeout(console.log({ SPEEDLIMIT }), 10000);
    })();
}
animate();
const socket = io();
socket.on('connect', () =>{
    console.log("CONNECTED");
});
socket.on("talking", () => {
    if (!MESSAGEINCOMING) {
        MESSAGEINCOMING = true;
        SPEEDLIMIT = 1000;
    }
});