
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

function simulatePulls() {
    alert("test");
    const _numPulls = document.getElementById('numPulls').value;
    const _numIterations = document.getElementById('numIterations').value;
    
    alert(_numPulls);
    alert("numIterations = " + _numIterations);
}

function simulateCrystalPull() {
    let randValue = Math.random();

    for (const crystalOutcome of rareCrystalSummonChances) {
        if (randValue < rareCrystalSummonChances[crystalOutcome]){
            return crystalOutcome;
        }
        randValue -= rareCrystalSummonChances[crystalOutcome];
    }
}