const sizeMult = 0.5; // Size multiplier based on energy
const speed = 5.0; // Particle wander speed

class Particle{    
    constructor(vars){    
        initialVariables = vars;
        size = vars.size | 1.0;
        
        desiredPitch = vars.desiredPitch | 1000.0;
        pitchVariance = vars.pitchVariance | 200.0;
    
        volumeMultiplier = vars.volumeMultiplier | 0.1;
    
        position = vars.position | (0.0, 0.0);
        wander = vars.wander | (1.0, 0.0);
    
        color = vars.color | rgb(0, 0, 0);
    
        energy = vars.energy | 0.0;
        eDecay = vars.eDecay | 1.0;
        eMultiplier = vars.eMultiplier | 1.0;
        eThreshhold = vars.eThreshhold | 5.0;
        
        // Only parents split, children die when splitting
        isParent = vars.isParent | true;
        
        energyPerSecond = vars.energyPerSecond | 0;
        
        children = vars.children | [];
        Object.assign(initialVariables, sizeMult, speed, size, desiredPitch, pitchVariance, volumeMultiplier, position, wander, color, energy, eDecay, eMultiplier, eThreshhold, isParent, energyPerSecond, children);
    }
    
    update = (delta) => {
        // Randomize + Normalize wander, move
        this.wander[0] += (Math.random()-0.5) * 0.2;
        this.wander[1] += (Math.random()-0.5) * 0.2;
        normalizeWander();
        moveForward();
    
        // Increment and decay energy
        this.energy += this.energyPerSecond * delta * this.eMultiplier;
        this.energy -= this.eDecay * this.delta;
    
        // Cap at 0, split
        if(this.energy < 0){
            this.energy = 0;
        }else if(this.energy > this.eThreshhold){
            split();
        }

        if(isParent){
            if(children[0] != null){
                children[0].update(delta);
            }
            if(children[1] != null){
                children[1].update(delta);
            }
        }
    
        // Adjust visual size
        adjustSize();
    }
    
    // Handles sound input to the particle
    inputSound = (input) => {
        let pitch = input.pitch;
        let volume = input.volume;
    
        let inputMulti = getMultiplierFromPitch(pitch);
    
        this.energyPerSecond = (volume * this.volumeMultiplier) * inputMulti;
    }
    
    split = () => {
        if(this.isParent){
            let adjustedVariables = this.initialVariables;
            adjustedVariables.isParent = false;
            children[0] = new Particle(adjustedVariables);
            children[1] = new Particle(adjustedVariables);
        }else{
            this = null;
        }
        return;
    }
    
    // Returns a multiplier based on a given pitch (0 - 1.0)
    getMultiplierFromPitch = (pitch) => {
        let pDif = Math.abs(this.desiredPitch - pitch);
        if(pDif > this.pitchVariance){
            return 0;
        }else{
            return (this.pitchVariance - pDif)/this.pitchVariance;
        }
    }
    
    // Adjusts size based on current energy
    adjustSize = () => {
        size = 1.0 + (sizeMult * energy);
    }
    
    
    // Normalizes wander
    normalizeWander = () => {
        let mag = this.wander[0] * this.wander[0] + this.wander[1] * this.wander[1];
        this.wander[0] = this.wander[0]/mag;
        this.wander[1] = this.wander[1]/mag;
    }
    
    // Moves forwards
    moveForward = (delta) => {
        this.position[0] = this.position[0] + (this.wander[0] * delta * this.speed);
        this.position[1] = this.position[1] + (this.wander[1] * delta * this.speed); 
    }
}
