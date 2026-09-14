// 1. THE MESSAGE SEQUENCER
function playSequenceMessage(arrayMsg, index = 0){
    // Stop if we reach the end of the array
    if (index >= arrayMsg.length) {
        return; 
    }

    // Grab the text data for this specific popup
    const currentMsg = arrayMsg[index].texts;

    // Create the callback to load the next popup in the array
    const nextCallback = function() {
        playSequenceMessage(arrayMsg, index + 1);
    };

    // Show the modal and pass the callback!
    showModal(currentMsg.title, currentMsg.msg, currentMsg.btnText, nextCallback);
}

// 2. TUTORIAL DATA
const tutoMsg_1 = [
    {
        texts : {
            title: "Your Mission",
            msg: "Nyalau Camp needs emergency supplies. You need to program the robot and send the supplies to the Nyalau Camp.",
            btnText: "Next"
        }
    },
    {
        texts : {
            title: "Step Block",
            msg: "First, use the 'Step' block to move the robot in it's facing direction. Then use 'Drop Supply' at the camp to clear the level",
            btnText: "Okay"
        }

        
    }
];

const tutoMsg_2 = [
    {
        texts : {
            title: "Turn Block",
            msg: "Use the 'Turn' block to rotate the robot before stepping. Select 90 degrees to turn right, or -90 degrees to turn left.",
            btnText: "Got it!"
        }
    }
];

// 3. LEVEL ENTRY TRIGGERS
const levelMessages = [
    {
        texts : {
            title: "HELP", 
            msg: "Nyalau is in Danger! The flood has hit Nyalau and all the Emergency Camp is short of supply.", 
            btnText: "Next", 
            onClose: function() { playSequenceMessage(tutoMsg_1); }
        }
    },

    {
        texts : {
            title: "Navigating Corners",
            msg: "The path to the next survivor station isn't a straight line. If you only use the Step block, the robot will drive straight into the floodwaters!",
            btnText: "Next",
            onClose: function() { playSequenceMessage(tutoMsg_2); }
        }
    }
];

// 4. GAME EVENT MESSAGES
const eventMessages = {
    drown: {
        title: "System Failure!",
        msg: "SPLASH! The robot drove into the deep floodwaters and short-circuited. We need to reset the system.",
        btnText: "Reboot Robot"
    },
    crash: {
        title: "Collision Detected!",
        msg: "BUMP! The robot crashed into solid debris. Review your code and make sure the path is clear before moving.",
        btnText: "Recalibrate Path"
    },
    wrongDrop: {
        title: "Invalid Drop Zone",
        msg: "You dropped the supplies in the wrong sector! The survivors are at the designated camp target.",
        btnText: "Retrieve Supplies"
    },
    levelClear: {
        title: "Supplies Delivered!",
        msg: "Excellent work! The survivors at this station have received the emergency supplies. Ready for the next sector?",
        btnText: "Next Sector"
    },
    gameWin: {
        title: "Mission Accomplished!",
        msg: "CONGRATULATIONS! You successfully navigated all flooded sectors and saved everyone at Nyalau Camp. Your programming skills saved the day!",
        btnText: "Finish Game"
    }
};