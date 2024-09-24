class Charge {
  constructor(charge, position) {
    this.charge = charge;
    this.magnitude = charge * 1.602e-19;
    this.position = position;
  }
  //methods here
  getR(position) {
    return [position[0] - this.position[0], position[1] - this.position[1]];
  }
}
let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let charges = [];

//define canvas here
let precision = 0.01;
let luminosity = 100000; //generally set to 100000
let leftBound = -5;
let rightBound = 5;
let lowerBound = -5;
let upperBound = 5;

//limits magnitude to limitCap
let limitMagnitude = false;
let limitCap = 0.8;
//ignores magnitude and gives every point the brightness of ignoreCap
let ignoreMagnitude = false;
ignoreCap = 0.5;

//define charges here

//add rod function
function addRod(totalCharge, position, length, angle, frequency = 25) {
  let chargeAmount = totalCharge / (frequency * length);
  let halfLength = length / 2;
  let unitXComponent = Math.cos(angle * Math.PI / 180);
  let unitYComponent = Math.sin(angle * Math.PI / 180);
  for (let i = 0; i < frequency * length; i++) {
    charges.push(new Charge(chargeAmount, [unitXComponent * i / frequency - unitXComponent * halfLength + position[0], unitYComponent * i / frequency - unitYComponent * halfLength + position[1]]));
  }
  console.log("Rod added");
}

//add dynamic rod function
function addDynamicRod(chargeDensityEq, position, length, angle, frequency = 25) {
  let halfLength = length / 2;
  let unitXComponent = Math.cos(angle * Math.PI / 180);
  let unitYComponent = Math.sin(angle * Math.PI / 180);
  for (let i = 0; i < frequency * length; i++) {
    charges.push(new Charge(chargeDensityEq(i / frequency - halfLength) / frequency, [unitXComponent * i / frequency - unitXComponent * halfLength + position[0], unitYComponent * i / frequency - unitYComponent * halfLength + position[1]]));
  }
  console.log("Dynamic rod added");
}

//multplies a scalar and a vector
function multiply(scalar, array) {
  return [scalar * array[0], scalar * array[1]];
}

//adds two vectors
function add(firstVector, secondVector) {
  return [firstVector[0] + secondVector[0], firstVector[1] + secondVector[1]];
}

//gets angle of vector
function getAngle(vector) {
  let angle = Math.atan(vector[1] / vector[0]) * 180 / Math.PI;
  if (vector[0] < 0) angle += 180;
  if (angle < 0) angle += 360;
  return angle;
}

//gets magnitude of a vector
function getMagnitude(vector) {
  return Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
}

//adds two vectors
function addVectors(vectors) {
  sum = [0, 0];
  for (let i = 0; i < vectors.length; i++) {
    sum = add(sum, vectors[i]);
  }
  return sum;
}

//when user adds point
function ptAdd() {
  //get values from user
  let charge = document.getElementById("ptCharge").value;
  let xPosition = document.getElementById("ptXPosition").value;
  let yPosition = document.getElementById("ptYPosition").value;

  //add point
  console.log("Adding point:", charge, xPosition, yPosition);
  charges.push(new Charge(parseFloat(charge), [parseFloat(xPosition), parseFloat(yPosition)]));
  console.log("Point added");
}

//when user adds rod
function rodAdd() {
  //get values from user
  let charge = document.getElementById("rodCharge").value;
  let xPosition = document.getElementById("rodXPosition").value;
  let yPosition = document.getElementById("rodYPosition").value;
  let length = document.getElementById("rodLength").value;
  let angle = document.getElementById("rodAngle").value;
  let frequency = document.getElementById("rodFrequency").value;

  //add rod
  console.log("Adding rod:", charge, xPosition, yPosition, length, angle, frequency);
  addRod(parseFloat(charge), [parseFloat(xPosition), parseFloat(yPosition)], parseFloat(length), parseFloat(angle), (frequency) ? parseFloat(frequency) : 25)
}

//when user adds dynamic rod
function dynRodAdd() {
  //get values from user
  let chargeDensityEq = document.getElementById("dynRodChargeDensityEq").value;
  let xPosition = document.getElementById("dynRodXPosition").value;
  let yPosition = document.getElementById("dynRodYPosition").value;
  let length = document.getElementById("dynRodLength").value;
  let angle = document.getElementById("dynRodAngle").value;
  let frequency = document.getElementById("dynRodFrequency").value;

  //format charge density eq
  chargeDensityEq = chargeDensityEq.replace(/(\d|e|pi|\))(?=x|sin|cos|tan|arcsin|arccos|arctan|csc|sec|cot|sinh|cosh|tanh|arcsinh|arccosh|arctanh|ln|log|pi|e|\()/g, "$1 * ");
  chargeDensityEq = chargeDensityEq.replace(/\^/g, " ** ");
  chargeDensityEq = chargeDensityEq.replace(/pi/gi, "Math.PI");
  chargeDensityEq = chargeDensityEq.replace(/(?<!arc)sin(?!h)/gi, "Math.sin");
  chargeDensityEq = chargeDensityEq.replace(/(?<!arc)cos(?!h)/gi, "Math.cos");
  chargeDensityEq = chargeDensityEq.replace(/(?<!arc)tan(?!h)/gi, "Math.tan");
  chargeDensityEq = chargeDensityEq.replace(/csc/gi, "1 / Math.sin");
  chargeDensityEq = chargeDensityEq.replace(/sec/gi, "1 / Math.cos");
  chargeDensityEq = chargeDensityEq.replace(/cot/gi, "1 / Math.tan");
  chargeDensityEq = chargeDensityEq.replace(/arcsin(?!h)/gi, "Math.asin");
  chargeDensityEq = chargeDensityEq.replace(/arccos(?!h)/gi, "Math.acos");
  chargeDensityEq = chargeDensityEq.replace(/arctan(?!h)/gi, "Math.atan");
  chargeDensityEq = chargeDensityEq.replace(/(?<!arc)sinh/gi, "Math.sinh");
  chargeDensityEq = chargeDensityEq.replace(/(?<!arc)cosh/gi, "Math.cosh");
  chargeDensityEq = chargeDensityEq.replace(/(?<!arc)tanh/gi, "Math.tanh");
  chargeDensityEq = chargeDensityEq.replace(/arcsinh/gi, "Math.asinh");
  chargeDensityEq = chargeDensityEq.replace(/arccosh/gi, "Math.acosh");
  chargeDensityEq = chargeDensityEq.replace(/arctanh/gi, "Math.atanh");
  chargeDensityEq = chargeDensityEq.replace(/e/gi, "Math.E");
  chargeDensityEq = chargeDensityEq.replace(/\|(.+?)\|/g, "Math.abs($1)");
  chargeDensityEq = chargeDensityEq.replace(/log/gi, "Math.log10");
  chargeDensityEq = chargeDensityEq.replace(/ln/gi, "Math.log");
  //add dynamic rod
  console.log("Adding dynamic rod:", chargeDensityEq, xPosition, yPosition, length, angle, frequency);
  addDynamicRod((x) => { return eval(chargeDensityEq) }, [parseFloat(xPosition), parseFloat(yPosition)], parseFloat(length), angle, (frequency) ? parseFloat(frequency) : 25);
}

//when user ignores brightness
let ignoreSwitch = 0;
let limitSwitch = 0;
function updateIgnore() {
  let ignoreButton = document.getElementById("ignoreButton");
  let limitButton = document.getElementById("limitButton");
  if (++ignoreSwitch % 2) {
    let inputIgnoreCap = document.getElementById("ignoreCap").value;
    ignoreButton.innerHTML = "On";
    limitButton.innerHTML = "Off";
    ignoreMagnitude = true;
    limitMagnitude = false;
    limitSwitch = 0;
    ignoreCap = (inputIgnoreCap) ? parseFloat(inputIgnoreCap) : ignoreCap;
    console.log("Ignore magnitude is on:", ignoreCap);
  } else {
    ignoreButton.innerHTML = "Off";
    ignoreMagnitude = false;
    console.log("Ignore magnitude is off");
  }
}

//when user limits brightness
function updateLimit() {
  let ignoreButton = document.getElementById("ignoreButton");
  let limitButton = document.getElementById("limitButton");
  if (++limitSwitch % 2) {
    let inputLimitCap = document.getElementById("limitCap").value;
    ignoreButton.innerHTML = "Off";
    limitButton.innerHTML = "On";
    ignoreMagnitude = false;
    limitMagnitude = true;
    ignoreSwitch = 0;
    limitCap = (inputLimitCap) ? parseFloat(inputLimitCap) : limitCap;
    console.log("Limit magnitude is on:", limitCap);
  } else {
    limitButton.innerHTML = "Off";
    limitMagnitude = false;
    console.log("Limit magnitude is off");
  }
}

//updates the canvas
function updateCanvas() {
  //get values from user
  let sideLength = document.getElementById("sideLength").value;
  let prec = document.getElementById("precision").value;
  let lum = document.getElementById("luminosity").value;
  let userInputIgnoreCap = document.getElementById("ignoreCap").value;
  let userInputLimitCap = document.getElementById("limitCap").value;

  //set values of canvas
  if (sideLength) {
    sideLength = Math.abs(parseFloat(sideLength) / 2);
    leftBound = -sideLength;
    rightBound = sideLength;
    lowerBound = -sideLength;
    upperBound = sideLength;
  }
  precision = (prec) ? parseFloat(prec) : precision;
  luminosity = (lum) ? parseFloat(lum) : luminosity;

  //update canvas parameters
  let width = (rightBound - leftBound) / precision;
  let height = (upperBound - lowerBound) / precision;
  canvas.style = "width: " + width + "px; height: " + height + "px;";
  canvas.height = height;
  canvas.width = width;
  document.getElementById("colorWheel").style = "left: " + (width + 100) + "px; top: " + (600 + height / 2) + "px;";
  document.getElementById("left").style = "margin-left: " + (width - 600) + "px;";
  ignoreCap = (userInputIgnoreCap) ? parseFloat(userInputIgnoreCap) : ignoreCap;
  limitCap = (userInputLimitCap) ? parseFloat(userInputLimitCap) : limitCap;

  //redraw canvas
  console.log(canvas.style.width, canvas.style.height);
  console.log("Updating canvas");
  drawCanvas();
  console.log("Canvas updated");
}

//when user resets
function reset() {
  charges = [];
  console.log("Field reset");
}

//calculates fields
function calculateField(q) {
  let vectors = []
  let r;
  for (let i = 0; i < charges.length; i++) {
    r = charges[i].getR(q);
    vectors.push(multiply((8.99e+9 * charges[i].magnitude) / (getMagnitude(r) ** 3), r));
  }
  let addedVectors = addVectors(vectors);
  return addedVectors;
}

//creates canvas pixel given position, hue, and brightness
function createPixel(x, y, hue, brightness) {
  ctx.fillStyle = "hsl(" + hue + ", 100%, " + (100 * brightness) + "%)";
  ctx.fillRect(x, y, 1, 1);
}

//draws the canvas
function drawCanvas() {
  for (let i = 0; i * precision <= rightBound - leftBound; i++) {
    for (let j = 0; j * precision <= upperBound - lowerBound; j++) {
      let array = calculateField([leftBound + i * precision, lowerBound + j * precision]);
      createPixel(i, upperBound / precision - lowerBound / precision - j, getAngle(array), (ignoreMagnitude) ? ignoreCap : (limitMagnitude) ? limitCap * 2 * Math.atan(luminosity * getMagnitude(array)) / Math.PI : getMagnitude(array) * luminosity);
    }
  }
}

//when user tests charge
function testCharge() {
  let testX = parseFloat(document.getElementById("testX").value);
  let testY = parseFloat(document.getElementById("testY").value);
  console.log("Testing charge: ", testX, testY);
  let output = document.getElementById("E");
  let answer = calculateField([testX, testY]);
  x = "" + answer[0].toExponential(3);
  y = "" + answer[1].toExponential(3);
  output.innerHTML = "(" + x.replace("e", "E") + ", " + y.toString().replace("e", "E") + ")";
}

//draw first canvas
updateCanvas();
