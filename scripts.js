
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

function startIterations() {
    const _numPulls = document.getElementById('numPulls').value;
    const _numIterations = document.getElementById('numIterations').value;
    const trimSize = Math.round(_numIterations * 0.02)
    alert("trimSize: " + trimSize);

    const pointTotals = []
    for (let curIteration = 0; curIteration < _numIterations; curIteration++) {
        let iterationPoints = startPulls(_numPulls);
        // alert("iterationPoints: " + iterationPoints);
        pointTotals.push(iterationPoints);
    }

    alert("pointTotals size: " + pointTotals.length);
    alert("pointTotals average: " + arrayAverage(pointTotals));

    pointTotals.sort();
    pointTotals.reverse();

    for (let curPop = 0; curPop < trimSize; curPop++)
    {
        pointTotals.pop();
    }

    let lastVal = pointTotals.pop();
    alert("98% value: " + lastVal);
   
}

function startPulls(numPulls) {
    let totalPoints = 0;

    for (let curPull = 0; curPull < numPulls; curPull++) {
        let pullOutcome = simulateCrystalPull();
        totalPoints += points[pullOutcome];
    }

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