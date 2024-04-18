import {Particle} from './particle.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");



function draw(){
    let particle = new Particle(
        {size:1, 
            desiredPitch: 1, 
            pitchVariance: 1,
            volumeMultiplier: 1,
            position: [1, 1],
            wander: [1, 0],
            color: [0, 0, 0],
            energy: [0],
            eDecay: [0.5],
            eMultiplier: 1,
            eThreshhold: 5,
            isParent: true
    });

    //while(true){
        ctx.fillStyle = "rgb(0,0,0)"
        
        // Test
        ctx.arc(1.0, 1.0, 10, 0, Math.PI * 2, true);
        console.log(particle);
        let pos = particle.getPosition();
        let size = particle.getSize();
        console.log(pos);
        ctx.arc(pos[0], pos[1], size, 0, Math.PI * 2, true);
    //}
}

window.addEventListener("load", draw);