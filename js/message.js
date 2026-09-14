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
            msg: "First, click the step block to move the robot in its facing direction.",
            btnText: "Okay"
        }
    }
];

// 3. LEVEL ENTRY TRIGGERS
const levelMessages = [
    // Level 0 (The First Level)
    {
        texts : {
            title: "HELP", 
            msg: "Nyalau is in Danger!", 
            btnText: "Next", 
            // This waits for the click, then triggers the tutorial sequence!
            onClose: function() { playSequenceMessage(tutoMsg_1); }
        }
    }
];