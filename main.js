import { Particle, setColors } from './particle.js';
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

    console.log("Authors: Nick Kannenberg, Arthur Powers, Aaron Bush, Karl Choi, Zach Shaver");
    selectChange();

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
    // if ((input.pitch ?? 0) > 0)
    //     console.log(input);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update(env.delta, ctx);
        particles[i].inputSound(input);
    }

    // console.log(particles[0].position[0] + particles[0].position[1])

    window.requestAnimationFrame(draw);
}

const selectChange = () => {
    document.querySelector("select").onchange = e => {
        var s = e.target.value;

        if (s == "Original") {
            setColors([
                "#12657a",
                "#4bd5b2",
                "#f2dda4",
                "#fe4a49",
                "#fe4a49"]);
        }
        else if (s == "Void") {
            setColors([
                "#69127a",
                "#8349d4",
                "#dfa6f2",
                "#d148fe",
                "#a348fe"]);
        }
        else if (s == "Ocean") {
            setColors([
                "#127878",
                "#49bdd4",
                "#5cbfaf",
                "#4982fe",
                "#48c1fe"]);
        }
        else if (s == "Fire") {
            setColors([
                "#7a1212",
                "#d45549",
                "#f2835e",
                "#fe6648",
                "#fe8548"]);
        }
        else if (s == "Christmas") {
            setColors([
                "#595959",
                "#d54b4b",
                "#acf2a6",
                "#fe4a49",
                "#b3fe49"]);
        }
        else if (s == "Spring") {
            setColors([
                "#337a12",
                "#d54ba9",
                "#f2eda4",
                "#fee049",
                "#5bfe49"]);
        }
    };
}

init();

window.addEventListener("load", draw);