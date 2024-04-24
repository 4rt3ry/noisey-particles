import { Particle } from './particle.js';

let particles = [];

const env = {
    width: window.innerWidth,
    height: window.innerHeight,
    delta: 1 / 60,
    particles: 20
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
                eDecay: 0,
                eMultiplier: 1,
                eThreshhold: 5,
                env,
                isParent: true
            }));
    }

    // draw initial solid black rect
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    ctx.fillStyle = "rgb(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    for (let i = 0; i < particles.length; i++) {
        particles[i].update(env.delta, ctx);
        particles[i].inputSound({ pitch: 1, volume: 1.5 });
    }

    // Test

    window.requestAnimationFrame(draw);
}

init();

window.addEventListener("load", draw);