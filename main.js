import { Particle } from './particle.js';
import { audioInput } from './audio-input.js'

let particles = [];

const env = {
    width: window.innerWidth,
    height: window.innerHeight,
    delta: 1 / 60,
    particles: 200
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const init = () => {

    canvas.width = env.width;
    canvas.height = env.height;

    for (let i = 0; i < env.particles; i++) {
        particles.push(new Particle(
            {
                size: 1,
                desiredPitch: 1,
                pitchVariance: 1,
                volumeMultiplier: 1,
                position: [Math.random() * env.width, Math.random() * env.height],
                speed: 100,
                color: [0, 0, 0],
                energy: 0,
                eDecay: 12,
                eMultiplier: 1,
                eThreshhold: 10,
                env,
                isParent: true
            }));
    }

    // draw initial solid black rect
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    ctx.fillStyle = "rgb(0, 0, 0, 0.07)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    let input = audioInput();
    if ((input.pitch ?? 0) > 0)
        console.log(input);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update(env.delta, ctx);
        particles[i].inputSound(input);
    }

    // console.log(particles[0].position[0] + particles[0].position[1])

    window.requestAnimationFrame(draw);
}

init();

window.addEventListener("load", draw);