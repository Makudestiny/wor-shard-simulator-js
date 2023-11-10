
const rareCrystalSummonChances = {
    uncommon:.5000
    ,rare:.3751
    , rareLord:.0399
    , epic:.0788
    , epicLord:.0012
    , legendary: .0046
    , legendaryLord: .0004
}

const points = {
    legendaryLord:1200
    , legendary:500
    , epicLord:450
    , epic:150
    , rareLord:20
    , rare:10
    , uncommon:1
}

const arrayAverage = array => array.reduce((a, b) => a + b) / array.length;
// console.log(arrayAverage([1,2,3,4,5]));

let _numPulls;
let _numIterations;
let trimSize;
let pointTotals = [];


function startIterations() {
    _numPulls = document.getElementById('numPulls').value;
    _numIterations = document.getElementById('numIterations').value;
    
    trimSize = Math.floor(_numIterations * 0.02);
    console.log('_numPulls: ' + _numPulls);
    console.log('_numIterations: ' + _numIterations);
    console.log('trimSize: ' + trimSize);

    console.log('started pulls');
    for (let curIteration = 0; curIteration < _numIterations; curIteration++) {
        console.log('curIteration = ' + curIteration);
        pointTotals.push(startPulls());
    }
    console.log('finished pulls');

    generateResultHTML();

   
}

function startPulls() {
    let totalPoints = 0;

    for (let curPull = 0; curPull < _numPulls; curPull++) {
        let pullOutcome = simulateCrystalPull();
        totalPoints += points[pullOutcome];
    }

    // console.log('totalPoints: ' + totalPoints);
    return totalPoints;

}

function simulateCrystalPull() {
    let randValue = Math.random();

    for (const crystalOutcome in rareCrystalSummonChances) {
        if (randValue < rareCrystalSummonChances[crystalOutcome]){
            return crystalOutcome;
        }
        randValue -= rareCrystalSummonChances[crystalOutcome];
    }
}

function generateResultHTML() {
    clearResults();
    const _outputResults = document.querySelector('#outputResults');
    let newSpanText = document.createTextNode('# of Iterations: ' + _numIterations);;
    const divElement = document.createElement("div");
    const spanElement = document.createElement("span");
    const divClassName = "div-output"
    const spanClassName = "span-output"
    const outRows = 4;

    if (pointTotals.length > 0) {

        for(let i = 0; i < outRows; i++) {
            const spanElement = document.createElement("span");
            switch (i) {
                case 0:
                    newSpanText = document.createTextNode('# of Simulations: ' + _numIterations);
                    break;
                case 1:
                    newSpanText = document.createTextNode('# of Summons: ' + _numPulls);
                    break;
                case 2:
                    if (pointTotals.length > 1) {
                        newSpanText = document.createTextNode('Average: ' + Math.round(arrayAverage(pointTotals)));
                    }
                    else {
                        newSpanText = document.createTextNode('Average: ' + pointTotals[0]);
                    }
                    break;
                case 3:
                    pointTotals.sort();
                    pointTotals.reverse();
                
                    for (let curPop = 0; curPop < trimSize; curPop++)
                    {
                        pointTotals.pop();
                    }
                
                    const lastVal = pointTotals.pop();

                    newSpanText = document.createTextNode('98% value: ' + lastVal);
                    break;
            }
            
            spanElement.appendChild(newSpanText);
            spanElement.setAttribute( "class", spanClassName);
            divElement.appendChild(spanElement);
        }
        divElement.setAttribute( "class", divClassName);

    }
    else {
        newSpanText = document.createTextNode('No Simulations Attempted');
        spanElement.appendChild(newSpanText);
        divElement.appendChild(spanElement);
    }

    _outputResults.appendChild(divElement);

}

function clearResults() {
    const _outputResults = document.querySelector('#outputResults');
    _outputResults.innerHTML = "";
}
