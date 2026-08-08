// ==========================================
// DRAW MAP ON SCREEN
// ==========================================

const board = document.getElementById('game-board');
const robotEl = document.getElementById('robot');
const gridSize = levelData.length;
const cellSize = board.offsetWidth / gridSize;

//Sounds preload
const step_sfx = new Audio('res/step_sounds.mp3');
const water_sfx = new Audio('res/water_splash.mp3');
const win_sfx = new Audio('res/win_sound.mp3');


// Set up CSS Grid columns/rows based on array size
board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

// Draw the map cells
for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        if (levelData[y][x] === 0) { cell.classList.add('water'); cell.innerText = ''; }
        if (levelData[y][x] === 1) { cell.classList.add('path'); cell.innerText = ''; }
        if (levelData[y][x] === 2) { cell.classList.add('target'); cell.innerText = ''; }
        board.appendChild(cell);
    }
}

// Set initial robot state (Facing North 0 degrees)
let robot = initLocation;
robotEl.style.width = `${cellSize}px`;
robotEl.style.height = `${cellSize}px`;

function drawRobot() {
    robotEl.style.left = `${robot.x * cellSize}px`;
    robotEl.style.top = `${robot.y * cellSize}px`;
    robotEl.style.transform = `rotate(${robot.direction}deg)`;
}
drawRobot();

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
                    robotEl.classList.add('robot-drown'); // Sink into water!
                    water_sfx.play();
                    setTimeout(() => {
                        alert(" SPLASH! The robot drove into the floodwaters.");
                    }, 50)
                    return
                }

                robot.x = nextX;
                robot.y = nextY;
                step_sfx.play();
                drawRobot();
                await sleep(500); 
            }
        } 
                
        else if (cmd.action === 'drop') {
            if (levelData[robot.y][robot.x] === 2) {
                win_sfx.play();
                setTimeout(() => {
                    alert("SUCCESS! Supplies delivered!");
                }, 50)
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
function resetRobot() {
    robot = {...initLocation};
    
    robotEl.classList.remove('robot-crash', 'robot-drown');
        
    robotEl.style.transition = 'none';
    drawRobot();
        
    setTimeout(() => {
        robotEl.style.transition = 'all 0.4s ease-in-out';
    }, 50);
}