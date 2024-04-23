import { Particle } from './particle.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

    let particles = [];

    let pNum = 2;

    for(let i = 0; i < pNum; i ++){
        particles.push(new Particle(
            {
                size: 1,
                desiredPitch: 1,
                pitchVariance: 1,
                volumeMultiplier: 1,
                position: [100, 100],
                wander: [1, 0],
                color: [0, 0, 0],
                energy: 0,
                eDecay: 0,
                eMultiplier: 1,
                eThreshhold: 5,
                isParent: true
            }));
    }
    
    let delta = 1.0/60.0;

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "white";
    
    for(let i = 0; i < particles.length; i ++){
        particles[i].update(delta, ctx);
        particles[i].inputSound({pitch: 1, volume: 1.5});
    }



    // Test

    window.requestAnimationFrame(draw);
}

window.addEventListener("load", draw);