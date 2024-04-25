import * as perlin from "https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.0.0/simplex-noise.js"

const colors = [
    "#12657a",
    "#4bd5b2",
    "#f2dda4",
    "#fe4a49",
    "#fe4a49"
];

const pitchRange = [60, 1000];

class Particle {
    constructor(params) {

        // I changed the format of this to allow for easier assigning of properties
        // - Arthur

        Object.assign(this, { ...params })
        this.size ??= 1.0;
        this.sizeMult ??= 0.5;

        this.desiredPitch ??= 1000.0;
        this.pitchVariance ??= 200.0;

        this.volumeMultiplier ??= 0.1;

        this.position ??= [0.0, 0.0];
        this.velocity ??= [0, 0];

        this.color ??= [0, 0, 0];

        this.energy ??= 0.0;
        this.eDecay ??= 1.0;
        this.eMultiplier ??= 1.0;
        this.eThreshhold ??= 5;
        this.eThreshhold = Math.max(5, this.eThreshhold);

        // Only parents split, children die when splitting
        this.isParent ??= true;

        this.energyPerSecond ??= 0;
        this.speed ??= 1;

        this.children ??= [];

        // Non parameterized fields
        this.initialVariables = params;
        this.noise = new SimplexNoise();
    }

    update = (delta, ctx) => {
        this.moveForward(delta);

        // Increment and decay energy
        this.energy += this.energyPerSecond * delta * this.eMultiplier;
        this.energyPerSecond -= this.eDecay * delta;

        this.speed -= delta * 10;
        if (this.speed < 10) this.speed = 10;

        // Cap at 0, split
        if (this.energy < 0) {
            this.energy = 0;
        } else if (this.energy > this.eThreshhold) {
            this.energy = this.eThreshhold
            this.split();
        }

        // Adjust visual size
        this.adjustSize();
        ctx.fillStyle = this.getColor();
        ctx.fillRect(this.position[0] - this.size / 2.0, this.position[1] - this.size / 2.0, this.size, this.size);

        if (this.isParent) {
            if (this.children?.length > 0) {
                this.children[0].update(delta, ctx);
                this.children[1].update(delta, ctx);
            }
        }

    }

    // Handles sound input to the particle
    inputSound = (input) => {
        if (this.children?.length > 0) {
            this.children[0]?.inputSound(input);
            this.children[1]?.inputSound(input);
        }
        let pitch = input.pitch * 2;
        let volume = input.volume;

        let positionValue = this.position[0] + this.position[1];

        if (Math.abs(pitch - positionValue) < 100) {
            this.energyPerSecond = volume * 20;
            this.speed = volume * 100 + 100;
        }
    }

    split = () => {
        if (this.isParent) {
            let adjustedVariables = structuredClone(this.initialVariables);
            adjustedVariables.isParent = false;
            adjustedVariables.position[0] += (Math.random() - 0.5) * 20;
            adjustedVariables.position[1] += (Math.random() - 0.5) * 20;
            this.children[0] = new Particle(adjustedVariables);
            this.children[1] = new Particle(adjustedVariables);
            this.energy = 0;
        } else {

        }
        return;
    }

    // Adjusts size based on current energy
    adjustSize = () => {
        this.size = 1.0 + (this.sizeMult * this.energy);
    }

    getColor = () => {
        // TODO: move to constructor


        // linearly interpolate between 0-energyThreshold
        const index = Math.floor(this.energy / (this.eThreshhold - 2) * colors.length);
        return colors[index];
    }


    // // Normalizes wander
    // normalizeWander = () => {
    //     let mag = this.wander[0] * this.wander[0] + this.wander[1] * this.wander[1];
    //     this.wander[0] = this.wander[0] / mag;
    //     this.wander[1] = this.wander[1] / mag;
    // }

    // Moves forwards
    moveForward = (delta = 1.0 / 60.0) => {
        let angle = this.noise.noise2D(this.position[0] * 0.01, this.position[1] * 0.01) * 3.14 / 2;

        // change in x, change in y
        let cx = Math.cos(angle);
        let cy = Math.sin(angle);


        this.position[0] += (cx * delta * this.speed);
        this.position[1] += (cy * delta * this.speed);


        // wrap across the screen
        if (this.position[0] > this.env.width) this.position[0] = 0;
        if (this.position[0] < 0) this.position[0] = this.env.width;
        if (this.position[1] > this.env.height) this.position[1] = 0;
        if (this.position[1] < 0) this.position[1] = this.env.height;
    }

    // Getters
    getPosition = () => {
        return this.position;
    }

    getSize = () => {
        return this.size;
    }


}

export { Particle };