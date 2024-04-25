
// initialize stuff


const slider = document.getElementById("volume");
const startBtn = document.querySelector("#start-btn");
let micStream;
let audioCtx;
let analyserNode; // look at those bri'ish spellings
const smoothAmount = 3;
const smoothBuffer = new Array(smoothAmount).fill(0);

const analyzer = () => {

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyserNode = audioCtx.createAnalyser();
    analyserNode.minDecibels = -100;
    analyserNode.maxDecibels = -10;
    analyserNode.smoothingTimeConstant = 0.8;

    // get microphone input
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.mediaDevices.getUserMedia;

    if (navigator.getUserMedia) {

        navigator.getUserMedia({ audio: true },
            function (stream) {
                // capture microphone input
                micStream = audioCtx.createMediaStreamSource(stream);
                micStream.connect(analyserNode);
                analyze();
            },
            function (e) {
                alert('Error capturing audio.');
            }
        );

    } else { alert('getUserMedia not supported in this browser.'); }
}

const analyze = () => {
    // console.log()
    requestAnimationFrame(analyze);
    const bufferLength = analyserNode.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyserNode.getFloatTimeDomainData(buffer);

    const acValue = smooth(autoCorrelate(buffer, audioCtx.sampleRate));
    if (acValue > 0)
    console.log(acValue);
    // console.log(Math.floor(acValue));
}

// must be run per frame
const smooth = (value) => {
    for (let i = 0; i < smoothBuffer.length - 1; i++) {
        smoothBuffer[i] = smoothBuffer[i + 1];
    }
    smoothBuffer[smoothBuffer.length - 1] = value;

    // calculate average
    let average = 0;
    for (let i of smoothBuffer) {
        average += i;
    }
    average /= smoothBuffer.length;
    // calculate standard deviation
    let deviationSum = 0;
    for (let i of smoothBuffer) {
        deviationSum += Math.abs(i - average);
    }
    const deviation = Math.sqrt((deviationSum * deviationSum) / smoothBuffer.length);
    if (deviation < 1) return value;
    return -1;
}


// Code borrowed from https://alexanderell.is/posts/tuner/
const autoCorrelate = (buffer, sampleRate) => {

    // Perform a quick root-mean-square to see if we have enough signal
    let bufferSize = buffer.length;
    let sumOfSquares = 0;
    for (let i = 0; i < bufferSize; i++) {
        let val = buffer[i];
        sumOfSquares += val * val;
    }
    let rootMeanSquare = Math.sqrt(sumOfSquares / bufferSize);

    // not enough signal, don't continue
    if (rootMeanSquare < 0.01) return -1;


    // Find the actual range of sound, discard all other data
    let r1 = 0;
    let r2 = bufferSize - 1;
    const threshold = 0.2;

    // Walk up for r1
    for (let i = 0; i < bufferSize / 2; i++) {
        if (Math.abs(buffer[i]) < threshold) {
            r1 = i;
            break;
        }
    }

    // Walk down for r2
    for (let i = 1; i < bufferSize / 2; i++) {
        if (Math.abs(buffer[bufferSize - i]) < threshold) {
            r2 = bufferSize - i;
            break;
        }
    }

    buffer = buffer.slice(r1, r2);
    bufferSize = buffer.length;

    // actually perform auto correlation now
    const acSums = new Float32Array(bufferSize);
    for (let i = 0; i < bufferSize; i++) {
        for (let j = 0; j < bufferSize - i; j++) {
            acSums[i] = acSums[i] + buffer[j] * buffer[j + i];
        }
    }

    // find highest sum
    // I actually don't know what's going on here
    // i'm assuming it's discarding unneeded indices
    let d = 0;
    while (acSums[d] > acSums[d + 1]) {
        d++;
    }

    // Iterate from that index through the end and find the maximum sum
    let maxValue = -1;
    let maxIndex = -1;
    for (let i = d; i < bufferSize; i++) {
        if (acSums[i] > maxValue) {
            maxValue = acSums[i];
            maxIndex = i;
        }
    }

    let T0 = maxIndex;
    // Now, even the author doesn't even know what's going on
    // borrowed borrowed code
    // From the original author:
    // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
    // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
    // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
    let x1 = acSums[T0 - 1];
    let x2 = acSums[T0];
    let x3 = acSums[T0 + 1]
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2
    if (a) {
        T0 = T0 - b / (2 * a);
    }

    return sampleRate / T0;
}

startBtn.addEventListener('click', analyzer)