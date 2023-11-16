const summonChances = {
    rareCrystal: {
        normalBanner: {
            uncommon:.5000
            ,rare:.3751
            , rareLord:.0399
            , epic:.0788
            , epicLord:.0012
            , legendary: .0046
            , legendaryLord: .0004
        }
        , twoXBanner: {
            uncommon:.4950
            ,rare:.3751
            , rareLord:.0399
            , epic:.0788
            , epicLord:.0012
            , legendary: .0092
            , legendaryLord: .0008
        }
    }
    , divineCrystal: {
        normalBanner: {
            epic:.9278
            , epicLord:.0122
            , legendary: .056
            , legendaryLord: .004
        }
        , twoXBanner: {
            epic:.8678
            , epicLord:.0122
            , legendary: .112
            , legendaryLord: .008
        }
    }
     //TODO: Fix Ancient Summon Chances
    , ancientCrystal: {
        normalBanner: {
            rare:.3751
            , rareLord:.0399
            , epic:.08
            , epicLord:.06
            , legendary: .01
            , legendaryLord: .008
        }
        // .8% legendary lord, 1% legendary, 6% epic lord, 8% epic rest rares
        , twoXBanner: {
            uncommon:.5000
            ,rare:.3751
            , rareLord:.0399
            , epic:.0788
            , epicLord:.0012
            , legendary: .0046
            , legendaryLord: .0004
        }
    }
};

const points = {
    legendaryLord:1200
    , legendary:500
    , epicLord:450
    , epic:150
    , rareLord:20
    , rare:10
    , uncommon:1
};

let pullGrandTotals = {
    legendaryLord:0
    , legendary:0
    , epicLord:0
    , epic:0
    , rareLord:0
    , rare:0
    , uncommon:0

};

let details = {
    zero:{
        legendaryLord:0
        , legendary:0
        , epicLord:0
        , epic:0
        , rareLord:0
        , rare:0
        , uncommon:0
    }
    , multiple:{
        legendaryLord:0
        , legendary:0
        , epicLord:0
        , epic:0
        , rareLord:0
        , rare:0
        , uncommon:0
    }
};

let pointTotals = [];

const arrayAverage = array => array.reduce((a, b) => a + b) / array.length;
const divClassName = "div-output"
const tableClassName = "table-output"
const trClassName = "tr-output"
const trBlankClassName = "tr-blank-output"
const trHeaderClassName = "tr-header-output"
const tdLabelClassName = "td-label-output"
const tdNormalClassName = "td-normal-output"
const tdResultClassName = "td-result-output"

let _numPulls;
let _numIterations;
let curShardType = 'rareCrystal';
let debugFlag = 0;
let simulationChances;
let trimSize;

function startIterations() {
    debugLogging('Begin startIterations');

    _numPulls = document.getElementById('numPulls').value;
    _numIterations = document.getElementById('numIterations').value;
    _bannerType = document.getElementById('bannerType').value;
    trimSize = Math.floor(_numIterations * 0.02);
    pullGrandTotals = {
        legendaryLord:0, legendary:0
        , epicLord:0, epic:0
        , rareLord:0, rare:0
        , uncommon:0
    
    };
    pointTotals = [];
    details = {
        zero:{
            legendaryLord:0
            , legendary:0
            , epicLord:0
            , epic:0
            , rareLord:0
            , rare:0
            , uncommon:0
        }
        , multiple:{
            legendaryLord:0
            , legendary:0
            , epicLord:0
            , epic:0
            , rareLord:0
            , rare:0
            , uncommon:0
        }
    };

    debugLogging('_numPulls: ' + _numPulls);
    debugLogging('_numIterations: ' + _numIterations);
    debugLogging('_bannerType: ' + _bannerType);
    debugLogging('curShardType: ' + curShardType);
    debugLogging('trimSize: ' + trimSize);

    buildSimulationSettings();

    debugLogging('  Loop Iterations');
    for (let curIteration = 0; curIteration < _numIterations; curIteration++) {
        pointTotals.push(Number(startPulls()));
    }
    debugLogging('  Finished Iterations');
    debugLogging(pullGrandTotals);

    generateResultHTML();

    debugLogging('End startIterations');
}

function buildSimulationSettings() {
    debugLogging('  Begin buildSimulationSettings');
    
    simulationChances = summonChances[curShardType][_bannerType];

    debugLogging('  End buildSimulationSettings');
}

function startPulls() {
    debugLogging('  Begin startPulls');

    let totalPoints = 0;
    let pullTotals = {
        legendaryLord:0
        , legendary:0
        , epicLord:0
        , epic:0
        , rareLord:0
        , rare:0
        , uncommon:0
    };

    if(validateShardChances(simulationChances) == false) {
        alert("Shard Chances broken. Known issue for Ancient Summons"); //TODO: Fix Ancient Summon Chances
    }
    else 
    {
        let curDetailObj;
        for (let curPull = 0; curPull < _numPulls; curPull++) {
            let pullOutcome = simulateCrystalPull(simulationChances);
            pullTotals[pullOutcome]++;
            totalPoints += points[pullOutcome];
        }

        for (const heroType in pullTotals) {
            pullGrandTotals[heroType] += pullTotals[heroType];
            
            curDetailObj = details['zero'];
            if (pullTotals[heroType] == 0) {
                curDetailObj[heroType]++;
            }
            curDetailObj = details['multiple'];
            if (pullTotals[heroType] > 1) {
                curDetailObj[heroType]++;

            }
        }
    }

    debugLogging('  End startPulls');
    return totalPoints;
}

function validateShardChances(shardChancesObj) {
    let totalPercent = 0;
    for (const crystalOutcome in shardChancesObj) {
        totalPercent += shardChancesObj[crystalOutcome];
    }

    if (totalPercent == 1.0) {
        return true;
    }
    return false;
}

function simulateCrystalPull(shardChancesObj) {
    debugLogging('    Run simulateCrystalPull');

    let randValue = Math.random();
    
    for (const crystalOutcome in shardChancesObj) {
        if (randValue < shardChancesObj[crystalOutcome]){
            return crystalOutcome;
        }
        randValue -= shardChancesObj[crystalOutcome];
    }

    debugLogging('    End simulateCrystalPull');
}

function generateResultHTML() {
    debugLogging('  Begin generateResultHTML');

    clearResults();
    const _outputResults = document.querySelector('#outputResults');
    let newLabelText = document.createTextNode(' ');
    let newDataText = document.createTextNode(' ');
    const divElement = document.createElement("div");
    const spanElement = document.createElement("span");
    const outRows = 4;

    if (pointTotals.length > 0) {
        const tableElement = document.createElement("table");

        for(let i = 0; i < outRows; i++) {
            const trElement = document.createElement("tr");
            switch (i) {
                case 0:
                    newLabelText = document.createTextNode('# of Simulations: ');
                    newDataText = document.createTextNode( _numIterations);
                    break;
                case 1:
                    newLabelText = document.createTextNode('# of Summons: ');
                    newDataText = document.createTextNode(_numPulls);
                    break;
                case 2:
                    newLabelText = document.createTextNode('Average: ');
                    if (pointTotals.length > 1) {
                        newDataText = document.createTextNode(Math.round(arrayAverage(pointTotals)));
                    }
                    else {
                        newDataText = document.createTextNode(pointTotals[0]);
                    }
                    break;
                case 3:
                    pointTotals.sort(function(a,b){return a - b});
                    pointTotals.reverse();
                
                    for (let curPop = 0; curPop < trimSize; curPop++)
                    {
                        pointTotals.pop();
                    }
                
                    const lastVal = pointTotals.pop();

                    newLabelText = document.createTextNode('98% value: ');
                    newDataText = document.createTextNode(lastVal);
                    break;
            }

            for (let j = 0; j < 2; j++) {
                const tdElement = document.createElement("td");
                switch(j) {
                    case 0:
                        tdElement.appendChild(newLabelText);
                        tdElement.setAttribute( "class", tdLabelClassName);
                        break;
                    case 1:
                        tdElement.appendChild(newDataText);
                        tdElement.setAttribute( "class", tdResultClassName);
                        break;
                }
                trElement.appendChild(tdElement);
            }
            
            trElement.setAttribute( "class", trClassName);
            tableElement.appendChild(trElement);
        }

        addBlankTableRow(tableElement);
        addHeadingTableRow(tableElement, 'Average Outcomes');

        for(const key in pullGrandTotals) {
            const trElement = document.createElement("tr");
            for (let j = 0; j < 2; j++) {
                const tdElement = document.createElement("td");
                switch(j) {
                    case 0:
                        tdElement.appendChild(document.createTextNode(translateKey(key)));
                        tdElement.setAttribute( "class", tdNormalClassName);
                        break;
                    case 1:
                        tdElement.appendChild(document.createTextNode(parseFloat(pullGrandTotals[key])/parseFloat(_numIterations)));
                        tdElement.setAttribute( "class", tdResultClassName);
                        break;
                }
                trElement.appendChild(tdElement);
            }
            trElement.setAttribute( "class", trClassName);
            tableElement.appendChild(trElement);
        }

        addBlankTableRow(tableElement);
        addHeadingTableRow(tableElement, 'Zero and Multi Outcomes');

        
        for(const category in details) {
            for (const heroType in details[category]) {
                console.log(`Category: ${category} heroType:${heroType} ${details[category][heroType]}`);

                const trElement = document.createElement("tr");

                for (let j = 0; j < 2; j++) {
                    const tdElement = document.createElement("td");
                    let curTextNode = document.createTextNode(' ');
                    switch(j) {
                        case 0:
                            curTextNode.nodeValue = translateKey(category) + ' ' + translateKey(heroType);
                            tdElement.setAttribute( "class", tdNormalClassName);
                            break;
                        case 1:
                            let outText = details[category][heroType];
                            outText = outText + ' (' + (parseFloat(details[category][heroType])/parseFloat(_numIterations)*100).toFixed(2) + '%)';
                            curTextNode.nodeValue = outText;
                            tdElement.setAttribute( "class", tdResultClassName);
                            break;
                    }
                    tdElement.appendChild(curTextNode);
                    trElement.appendChild(tdElement);
                }
                trElement.setAttribute( "class", trClassName);
                tableElement.appendChild(trElement);
            }
        }
        tableElement.setAttribute( "class", tableClassName);
        divElement.appendChild(tableElement);
        divElement.setAttribute( "class", divClassName);

    }
    else {
        newLabelText = document.createTextNode('No Simulations Attempted');
        spanElement.appendChild(newLabelText);
        divElement.appendChild(spanElement);
    }

    _outputResults.appendChild(divElement);

    debugLogging('  End generateResultHTML');
}

function translateKey(keyValue) {
    let retVal = '';

    switch(keyValue) {
        case 'legendaryLord': retVal = 'Legendary Lord'; break;
        case 'legendary': retVal = 'Legendary'; break;
        case 'epicLord': retVal = 'Epic Lord'; break;
        case 'epic': retVal = 'Epic'; break;
        case 'rareLord': retVal = 'Rare Lord'; break;
        case 'rare': retVal = 'Rare'; break;
        case 'uncommon': retVal = 'Uncommon'; break;
        case 'zero': retVal = 'Zero'; break;
        case 'multiple': retVal = 'Multiple'; break;
    }

    return retVal;
}

function addBlankTableRow(documentElement) {
    const trElement = document.createElement("tr");
    const tdElement = document.createElement("td");
    tdElement.appendChild(document.createTextNode(' '));
    trElement.appendChild(tdElement);
    trElement.setAttribute( "class", trBlankClassName);
    documentElement.appendChild(trElement);
}

function addHeadingTableRow(documentElement, headerText) {
    const trElement = document.createElement("tr");
    const tdElement = document.createElement("td");
    tdElement.appendChild(document.createTextNode(headerText));
    trElement.appendChild(tdElement);
    trElement.setAttribute( "class", trHeaderClassName);
    documentElement.appendChild(trElement);
}

function updateShardType(shardType) {
    curShardType = shardType;
    switch(shardType) {
        case 'Rare':
            document.body.style.background = "#599fe7";
            document.getElementById("rareSummonBtn").style.boxShadow = "inset 0 0 10px #051644";
            document.getElementById("divineSummonBtn").style.boxShadow = "none";
            document.getElementById("ancientSummoningBtn").style.boxShadow = "none";
            curShardType = 'rareCrystal';
            break;
        case 'Divine':
            document.body.style.background = "#feeb93";
            document.getElementById("rareSummonBtn").style.boxShadow = "none";
            document.getElementById("divineSummonBtn").style.boxShadow = "inset 0 0 10px #440345";
            document.getElementById("ancientSummoningBtn").style.boxShadow = "none";
            curShardType = 'divineCrystal';
            break;
        case 'Ancient':
            document.body.style.background = "#f13b44";
            document.getElementById("rareSummonBtn").style.boxShadow = "none";
            document.getElementById("divineSummonBtn").style.boxShadow = "none";
            document.getElementById("ancientSummoningBtn").style.boxShadow = "inset 0 0 10px #440505";
            curShardType = 'ancientCrystal';
            break;
    }
    return;
}

function clearResults() {
    const _outputResults = document.querySelector('#outputResults');
    _outputResults.innerHTML = "";
}

function debugLogging(consoleObj) {
    if(debugFlag == 1) {
        console.log(consoleObj);
    }
}