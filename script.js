const square = document.querySelector("#square");
let ground = document.querySelector("#ground").getBoundingClientRect();

const intervalDurationInput = document.querySelector("#intervalDuration");
const intervalDurationValue = document.querySelector("#intervalDurationValue");

const accelerationInput = document.querySelector("#acceleration");
const accelerationValue = document.querySelector("#accelerationValue");

const squareSizeInput = document.querySelector("#squareSize");
const groundLevelInput = document.querySelector("#groundLevel");

const velocityValue = document.querySelector("#velocityValue");
const distanceValue = document.querySelector("#distanceValue");
const timeElapsedValue = document.querySelector("#timeElapsedValue");

const fallingSound = document.getElementById("fallingSound");
let interval;
let time = 0;
let totalTime = 0; // New variable to track total elapsed time

accelerationValue.innerHTML = accelerationInput.value;
intervalDurationValue.innerHTML = intervalDurationInput.value;

// global variables
let acceleration = 9.8; // N.kg^-1
let intervalDuration = Number(intervalDurationInput.value); // ms

accelerationInput.addEventListener("input", (event) => {
    acceleration = Number(event.target.value);
    accelerationValue.innerHTML = event.target.value;
});

intervalDurationInput.addEventListener("input", (event) => {
    intervalDuration = Number(event.target.value);
    intervalDurationValue.innerHTML = event.target.value;
});

squareSizeInput.addEventListener("input", (event) => {
    square.style.width = event.target.value + "px";
    square.style.top = (window.innerHeight - ground.height) - 0.5 * square.getBoundingClientRect().height + "px";
});

groundLevelInput.addEventListener("input", (event) => {
    document.querySelector("#ground").style.height = event.target.value + "px";
    ground = document.querySelector("#ground").getBoundingClientRect();
    // position the square on the ground
    square.style.top = (window.innerHeight - ground.height) - 0.5 * square.getBoundingClientRect().height + "px";
});

const updatePosition = () => {
    const square_top = square.getBoundingClientRect().bottom;

    // calculate the distance traveled using the kinematic equation: d = ut + 0.5 * a * t^2
    const distance = 0.5 * acceleration * Math.pow(totalTime / 1000, 2);
    console.log('Acceleration:', acceleration);
    console.log('Time:', totalTime / 1000);
    console.log('Distance:', distance);

    // move the square down to simulate the fall
    square.style.top = (square_top + distance) + "px";

    // create points spaced by the same amount of time
    const point = document.createElement("div");
    point.style.width = "10px";
    point.style.height = "10px";
    point.style.borderRadius = "50%";
    point.style.transform = "translate(-50%, -50%)";
    point.style.background = "black";
    point.style.position = "absolute";
    point.style.left = "50%";
    point.style.top = parseInt(square_top + distance) + "px";
    document.querySelector(".points").appendChild(point);

    // calculate velocity using the formula: v = at
    const velocity = acceleration * (totalTime / 1000);

    // update displayed values
    velocityValue.innerHTML = velocity.toFixed(2) + " m/s";
    distanceValue.innerHTML = distance.toFixed(2) + " m";
    timeElapsedValue.innerHTML = (totalTime / 1000).toFixed(2) + " s";

    // stop when hit the ground
    if (square.getBoundingClientRect().bottom >= window.innerHeight - ground.height) {
        clearInterval(interval);
        // position square on the ground in case it went further
        square.style.top = window.innerHeight - ground.height - 0.5 * square.getBoundingClientRect().height + "px";
        document.querySelector("#start").innerHTML = "START";
        fallingSound.pause();
        fallingSound.currentTime = 0; // reset the sound to the beginning
    }

    totalTime += intervalDuration; // Update total elapsed time
};

document.querySelector("#start").addEventListener('click', function () {
    clearInterval(interval);
    square.style.top = 100 + "px";
    time = 0;
    totalTime = 0; // Reset total elapsed time
    document.querySelector(".points").innerHTML = '';
    document.querySelector("#start").innerHTML = 'RESTART';
    fallingSound.currentTime = 0; // reset the sound to the beginning
    fallingSound.play();
    interval = setInterval(updatePosition, intervalDuration);
});

document.querySelector("#stop").addEventListener('click', function() {
    clearInterval(interval);
    document.querySelector("#start").innerHTML = 'START';
    fallingSound.pause();
    fallingSound.currentTime = 0
    time = 0;
    square.style.top = (window.innerHeight - ground.height) - 0.5 * square.getBoundingClientRect().height + "px";
    document.querySelector(".points").innerHTML = '';
    updatePosition(); // update the position once to clear any ongoing animations
});
