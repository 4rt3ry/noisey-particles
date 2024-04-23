const sizeMult = 0.5; // Size multiplier based on energy
const speed = 5.0; // Particle wander speed

class Particle {
    constructor(vars) {
        let initialVariables = vars;
        let size = vars.size ?? 1.0;
        let sizeMult = vars.sizeMult ?? 0.5;

        let desiredPitch = vars.desiredPitch ?? 1000.0;
        let pitchVariance = vars.pitchVariance ?? 200.0;

        let volumeMultiplier = vars.volumeMultiplier ?? 0.1;

        let position = vars.position ?? [0.0, 0.0];
        let wander = vars.wander ?? [1.0, 0.0];

        let color = vars.color ?? [0, 0, 0];

        let energy = vars.energy ?? 0.0;
        let eDecay = vars.eDecay ?? 1.0;
        let eMultiplier = vars.eMultiplier ?? 1.0;
        let eThreshhold = vars.eThreshhold ?? 5.0;

        // Only parents split, children die when splitting
        let isParent = vars.isParent ?? true;

        let energyPerSecond = vars.energyPerSecond ?? 0;

        let children = vars.children ?? [];

        Object.assign(this, {
            initialVariables,
            sizeMult, speed,
            size, desiredPitch,
            pitchVariance, volumeMultiplier,
            position, wander, color,
            energy, eDecay, eMultiplier,
            eThreshhold, isParent, energyPerSecond, children
        });
    }

    update = (delta, ctx) => {
        // Randomize + Normalize wander, move
        this.wander[0] += (Math.random() - 0.5) * 0.2;
        this.wander[1] += (Math.random() - 0.5) * 0.2;
        this.normalizeWander();
        this.moveForward(delta);

        // Increment and decay energy
        this.energy += this.energyPerSecond * delta * this.eMultiplier;
        this.energy -= this.eDecay * delta;

        // Cap at 0, split
        if (this.energy < 0) {
            this.energy = 0;
        } else if (this.energy > this.eThreshhold) {
            this.split();
        }

        // Adjust visual size
        this.adjustSize();

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
        if(this.children.length > 0){
            this.children[0]?.inputSound(input);
            this.children[1]?.inputSound(input);
        }
        let pitch = input.pitch;
        let volume = input.volume;

        let inputMulti = this.getMultiplierFromPitch(pitch);

        this.energyPerSecond = (volume * this.volumeMultiplier) * inputMulti;
    }

    split = () => {
        if (this.isParent) {
            console.log(this);
            let adjustedVariables = this.initialVariables;
            adjustedVariables.isParent = false;
            adjustedVariables.sizeMult = 1;
            adjustedVariables.position[0] += (Math.random()-0.5) * 20;
            adjustedVariables.position[1] += (Math.random()-0.5) * 20; 
            this.children[0] = new Particle(adjustedVariables);
            this.children[1] = new Particle(adjustedVariables);
            this.energy = 0;
        } else {

        }
        return;
    }

    // Returns a multiplier based on a given pitch (0 - 1.0)
    getMultiplierFromPitch = (pitch) => {
        let pDif = Math.abs(this.desiredPitch - pitch);
        if (pDif > this.pitchVariance) {
            return 0;
        } else {
            return (this.pitchVariance - pDif) / this.pitchVariance;
        }
    }

    // Adjusts size based on current energy
    adjustSize = () => {
        this.size = 1.0 + (this.sizeMult * this.energy);
    }


    // Normalizes wander
    normalizeWander = () => {
        let mag = this.wander[0] * this.wander[0] + this.wander[1] * this.wander[1];
        this.wander[0] = this.wander[0] / mag;
        this.wander[1] = this.wander[1] / mag;
    }

    // Moves forwards
    moveForward = (delta = 1.0 / 60.0) => {
        this.position[0] = this.position[0] + (this.wander[0] * delta * 1);
        this.position[1] = this.position[1] + (this.wander[1] * delta * 1);
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