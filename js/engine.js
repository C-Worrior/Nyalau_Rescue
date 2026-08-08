// ==========================================
// DRAW MAP ON SCREEN
// ==========================================

//Get level information
const board = document.getElementById('game-board');
const robotEl = document.getElementById('robot');

let currentLevel = 0;
let levelData;
let initLocation;
let gridSize;
let cellSize;

//Sounds preload
const step_sfx = new Audio('res/step_sounds.mp3');
const water_sfx = new Audio('res/water_splash.mp3');
const win_sfx = new Audio('res/win_sound.mp3');

let robot = initLocation;
loadLevel(0);

// ==========================================
// BLOCKLY SETUP & DEFINITIONS
// ==========================================
Blockly.defineBlocksWithJsonArray([
// 1. New START Block
{
    "type": "robot_start",
    "message0": "START HERE",
    "nextStatement": null, // Blocks can snap below it, but not above it
    "colour": 0
},
// 2. Step Block
{
    "type": "robot_step",
    "message0": "Step %1 spaces",
    "args0": [{"type": "field_number", "name": "STEPS", "value": 1, "min": 1, "precision": 1}],
    "previousStatement": null, "nextStatement": null, "colour": 230
},
// 3. Turn Block
{
    "type": "robot_turn",
    "message0": "Turn %1 degrees",
    "args0": [{
            "type": "field_dropdown",
            "name": "DIR",
            "options": [
                ["90", "90"],
                ["-90", "-90"],
                ["180", "180"],
                ["270", "270"],
                ["-270", "-270"]
            ]
        }
    ],
    "previousStatement": null, "nextStatement": null, "colour": 285
},
{
    "type": "robot_drop",
    "message0": "Drop Supplies ",
    "previousStatement": null, "colour": 120
    }
    ]);

const workspace = Blockly.inject('blocklyDiv', {
toolbox: document.getElementById('toolbox'),
scrollbars: true,
trashcan: true
});

window.addEventListener('resize', function() {
    Blockly.svgResize(workspace);
});

Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'), workspace);

// Compiler: Translates visual blocks into JavaScript objects        
const robotGenerator = new Blockly.Generator('ROBOT');

robotGenerator.scrub_ = function(block, code, opt_thisOnly){
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = opt_thisOnly ? '' : robotGenerator.blockToCode(nextBlock);
    return code + nextCode
}

robotGenerator.forBlock['robot_start'] = (block) => '';
robotGenerator.forBlock['robot_step'] = (block) => `queue.push({ action: 'step', value: ${block.getFieldValue('STEPS')} });\n`;
robotGenerator.forBlock['robot_turn'] = (block) => `queue.push({ action: 'turn', value: ${block.getFieldValue('DIR')} });\n`;
robotGenerator.forBlock['robot_drop'] = (block) => `queue.push({ action: 'drop', value: null });\n`;


// ==========================================
// THE GAME ENGINE (EXECUTION LOOP)
// ==========================================
        
// A helper function to pause the loop so the animation can play
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runCode() {
// Find the START block
const startBlocks = workspace.getBlocksByType('robot_start');
const startBlock = startBlocks[0];
        
const firstCommandBlock = startBlock.getNextBlock();
    // If no next command on start block
    if (!firstCommandBlock) {
        alert("You need to snap some blocks to the START block first!");
        return;
    }
    resetRobot();
    await sleep(500);

    let commandQueue = [];
            
    const codeString = robotGenerator.blockToCode(firstCommandBlock);
    console.log("Compiled Code: \n", codeString)
            
    const compile = new Function('queue', codeString);
    compile(commandQueue);

    let suscess = false;
    executionLoop: 
    for (let i = 0; i < commandQueue.length; i++) {
        const cmd = commandQueue[i];

        if (cmd.action === 'turn') {
            robot.direction += parseInt(cmd.value);
            drawRobot();
            await sleep(500);
        } 
                
        else if (cmd.action === 'step') {
            for (let s = 0; s < cmd.value; s++) {
                const rad = robot.direction * (Math.PI / 180);
                const nextX = robot.x + Math.round(Math.sin(rad));
                const nextY = robot.y - Math.round(Math.cos(rad));
                        
                if (nextX < 0 || nextX >= gridSize || nextY < 0 || nextY >= gridSize || levelData[nextY][nextX] === 4) {
                    setTimeout(() => {
                        alert("BUMP! The robot hit a solid wall.");
                    }, 50)
                    return;  
                }
                if (levelData[nextY][nextX] === 0) {
                    updateRobot(nextX, nextY, water_sfx, 'robot-drown')
                    await sleep(500);
                    setTimeout(() => {
                        alert(" SPLASH! The robot drove into the floodwaters.");
                    }, 50)
                    return
                }
                updateRobot(nextX, nextY, step_sfx, null);
                await sleep(500);
            }
        } 
                
        else if (cmd.action === 'drop') {
            if (levelData[robot.y][robot.x] === 2) {
                win_sfx.play();
                setTimeout(() => {
                    alert("SUCCESS! Supplies delivered!");
                }, 50)
                
                currentLevel++;
                    if (currentLevel < MapLevels.length) {
                        loadLevel(currentLevel); // Loads the next map instantly!
                    } else {
                        alert("CONGRATULATIONS! You beat the entire game!");
                    }

            } else {
                alert("Dropped in the wrong place!");
                return;
            }
        }
    }
}


// ==========================================
// EXTRA FUNCTION
// ==========================================
//Reset robot position
function resetRobot() {
    robot = {...initLocation};
    
    robotEl.classList.remove('robot-crash', 'robot-drown');
        
    robotEl.style.transition = 'none';
    drawRobot();
        
    setTimeout(() => {
        robotEl.style.transition = 'all 0.4s ease-in-out';
    }, 50);
}

//Move Robot
function updateRobot(targetX, targetY, sound, stateClass) {

    robot.x = targetX;
    robot.y = targetY;

    if (sound !== null) {
        sound.play();
    }

    if (stateClass !== null) {
        robotEl.classList.add(stateClass);
    }

    drawRobot();
}

//Draw Map
function loadLevel(levelIndex) {
    currentLevel = levelIndex;
    levelData = MapLevels[currentLevel].mapping;
    initLocation = MapLevels[currentLevel].initial;
    
    gridSize = levelData.length;
    cellSize = board.offsetWidth / gridSize;

    robotEl.style.width = `${cellSize}px`;
    robotEl.style.height = `${cellSize}px`;

    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    const oldCells = board.querySelectorAll('.cell');
    oldCells.forEach(cell => cell.remove());

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (levelData[y][x] === 0) cell.classList.add('water');
            if (levelData[y][x] === 1) cell.classList.add('path');
            if (levelData[y][x] === 2) cell.classList.add('target');
            if (levelData[y][x] === 4) cell.classList.add('wall');

            board.insertBefore(cell, robotEl); 
        }
    }
    resetRobot();
}

//Draw Robot into map
function drawRobot() {
    robotEl.style.left = `${robot.x * cellSize}px`;
    robotEl.style.top = `${robot.y * cellSize}px`;
    robotEl.style.transform = `rotate(${robot.direction}deg)`;
}