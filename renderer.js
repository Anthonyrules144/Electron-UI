// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const $ = require('jquery');
const fs = require('fs');

//    I might add this later on
//   Note: xboxapi.com
//var XBox = require('node-xbox')("nothx");
//const xuid = XBox.profile.xuid('Anthonyrules144');
//setTimeout(() => {console.log(xuid);}, 2000);

// --- GAMEPAD SETUP --- //
const jsgamepad = require('jsgamepad');
function remapGamepadButtons(index) {
    var index = index.toString().replace('10', 'LEFT-STICK-DOWN').replace('11', 'RIGHT-STICK-DOWN')
    .replace('12', 'DPAD-UP').replace('13', 'DPAD-DOWN').replace('14', 'DPAD-LEFT').replace('15', 'DPAD-RIGHT')
    .replace('16', 'HOME')
    .replace('0', 'A').replace('1', 'B').replace('2', 'X').replace('3', 'Y')
    .replace('4', 'LB').replace('5', 'RB').replace('6', 'LT').replace('7', 'RT')
    .replace('8', 'BACK').replace('9', 'START');
    return index;
}
jsgamepad.gamepad.on("connected", (gamepad) => {
    console.log("Gamepad was connected: Gamepad#" + gamepad.index);
    console.log(gamepad);
}).on("disconnected", (gamepad) => {
    console.log("Gamepad was disconnected: Gamepad#" + gamepad.index);
}).on("buttonPressed", ({ button, buttonIndex, gamepad }) => {
    var buttonIndex = remapGamepadButtons(buttonIndex);
    button["press"] = buttonIndex;
    console.log(button);
}).on("axisChanged", function(ref) {
    var axis = ref.axis,
        axisIndex = ref.axisIndex,
        gamepad = ref.gamepad;
    // index 0 - 1 are left stick
    // index 2 - 3 are right stick
    $("#axis" + (axisIndex)).text(axis);
    if(axisIndex == 1 || axisIndex == 3) {
        var sNew = $("#axis" + (axisIndex - 1)).text();
        $("#axisReal" + (axisIndex - 1)).text(0);
        if(axis < -0.5 && sNew <= 1 || axis < -0.5 && sNew <= 0) {
            $("#axisReal" + (axisIndex - 1)).text("up");
        } else if(axis > -0.5 && sNew == -1) {
            $("#axisReal" + (axisIndex - 1)).text("left");
        } else if(axis == 1 && sNew < 0.5) {
            $("#axisReal" + (axisIndex - 1)).text("down");
        } else if(axis > -0.5 && sNew == 1) {
            $("#axisReal" + (axisIndex - 1)).text("right");
        }
    }
});
jsgamepad.gamepad.watch();
// --- END OF GAMEPAD SETUP --- //



// --- MAIN FUNCTIONS --- //
function pushFocus(idName) {
    $("#" + idName).focusin();
}

function checkInternet(_callback) {
    require('dns').lookup('google.com:80'), (err) => {
        if(err)
            return _callback(false);
        return _callback(true);
    }
}
// --- END OF MAIN FUNCTIONS --- //



// --- INSIDE FUNCTIONING --- //
module.exports = {
    ___ifyoufoundthis___: "nice job, have fun messing with my stuff",
    debug: {
        toggle: (trigger) => {
            if(trigger)
                $(".invisible").css('visibility', 'visible');
            else
                $('.invisible').css('visibility', 'hidden');
            return trigger;
        },
        selectFile: () => {
            var app = require('electron').remote;
            var dialog = app.dialog;
            dialog.showOpenDialog(function (fileNames) {
                if(fileNames === undefined) {
                    console.warn("ERR: No file was selected");
                } else {
                    return fileNames[0];
                }
            });
        },
        showMessageBox: (buttons, msg) => {
            var app = require('electron').remote;
            var dialog = app.dialog;
            dialog.showMessageBox({ buttons: buttons, message: msg }, (button) => {
                console.info(button);
            });
        },
        showErrorBox: (msg, functione) => {
            var app = require('electron').remote;
            var dialog = app.dialog;
            dialog.showMessageBox({ type: 'error', title: 'Something went wrong', message: msg }, (button) => {
                if(functione)
                    setTimeout(functione, 100);
            });
        }
    },
    loadSidebar: (type) => {
        if(type == 0) $(".sidebar").load("./resources/HTML/sidebar.html");
        else $(".sidebar").load("./resources/HTML/sidebar.html");
    },
    loadConfig: (_callback) => {
        fs.readFile('./config/config.json', 'utf8', (err, data) => {
            _callback(JSON.parse(data));
        });
    },
    loadUserInfo: (type, _callback) => {
        if(type === "name") {
            fs.readFile('./config/username.txt', 'utf8', (err, data) => {
                if(err) {
                    if(!data) {
                        fs.writeFileSync("./config/username.txt", (data="Placeholder"));
                        console.info("Username was written to a file and \"" + data + "\" was used");
                    } else console.warn("Username data is there but could not be received.");
                }
                $(".debug-username").text(_callback(data));
                if((data.length) > 23)
                    console.warn("Username length is over 20 characters: may not show full username length!");
            });
        } else if(type === "icon") {
            fs.readFile('./config/usericon.txt', 'utf8', (err, data) => {
                if(err) {
                    if(!data) {
                        console.warn("No user icon data was found");
                    } else console.warn("Username data is there but could not be received.");
                } else {
                    if(fs.existsSync(data)) {
                        $(".usericon").attr("src", data);
                    }
                    else
                        console.warn("User icon file was not found!");
                }
            });
        }
    },
    loadGames: () => {
        fs.readFile('./config/gameslocation.txt', 'utf8', (err, data) => {
            if(err) {
                if(!data) {
                    console.warn("Could not find game location");
                } else console.warn("Found game location, but could not be received");
            } else {
                if(fs.existsSync(data)) {
                    //
                } else
                    console.warn("Games location was not found");
            }
        });
    },
    loadHTML: (element, pagename) => {
        if(!element || !pagename)
            return console.warn("changePage ERR: Unstated variable");
        const div = $(element);
        if(div.length < 1)
            return console.warn("Element non-existant");
        if(fs.existsSync("./resources/HTML/" + pagename + ".html"))
            div.load("./resources/HTML/" + pagename + ".html");
    },
}
// --- END OF INSIDE FUNCTIONS --- //



// --- DATA SETTING FOR INDEX --- //
$("body").animate({
    opacity: "1",
    height: "100%",
    backgroundColor: "rgb(21,20,20)"
}, 1500, function() {
    //blah?
});
// --- END OF DATA SETTING --- //
