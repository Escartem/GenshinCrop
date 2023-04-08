// Escartem

// ems is a simple script that disable some keyboard shortcuts and show a nice message in console
setupEMS({"RCB": true, "DVT": false, "BSC": true, "SRC": true});

// version
VERSION = "2.0.0"
console.log("v"+VERSION);
document.getElementById("version").innerHTML = "V"+VERSION;

////////////
/// VARS ///
////////////

var curr_char=buid=url_object=url_object_result=full_url=null;
var gen=resultLoading=charsListEnabled=optionsShown=leftPanelShown=oldVersionsShown=charInitialized=mapInitialized=false;

var gameMode = "map";
var charList = ["Aether", "Albedo", "Alhaitham", "Aloy", "Amber", "Ayaka", "Ayato", "Barbara", "Beidou", "Bennett", "Candace", "Chongyun", "Collei", "Cyno", "Dehya", "Diluc", "Diona", "Dori", "Eula", "Faruzan", "Fischl", "Ganyu", "Gorou", "Heizou", "Hu Tao", ["Itto", "Arataki Itto"], "Jean", "Kaeya",  ["Kazuha", "Kaedehara Kazuha"], "Keqing", "Klee", ["Kokomi", "Sangonomiya Kokomi"], ["Sara", "Kujou Sara"], ["Kuki", "Kuki Shinobu"], "Layla", "Lisa", "Lumine", ["Mika", "Mika Schmidt"], ["Mona", "Mona Megistus"], "Nahida", "Nilou", "Ningguang", "Noelle", "Qiqi", ["Ei", "Raiden", "Shogun", "Raiden Shogun", "Baal"], "Razor", "Rosaria", "Sayu", "Shenhe", "Sucrose", ["Tartaglia", "Childe"], "Thoma", "Tighnari", "Venti", ["Wanderer", "Scaramouche"], "Xiangling", "Xiao", "Xingqiu", "Xinyan", ["Yae Miko", "Yae"], "Yanfei", "YaoYao", "Yelan", "Yoimiya", "Yun Jin", "Zhongli"]
var charReplacement = {};
var chars = "";
charList.forEach(function(value) {
    if (typeof(value) === "object") {
        chars += `<br/>${value.join().replaceAll(",",", ")}`;

        charReplacement[value[0].toLowerCase()] = value.map(name => name.toLowerCase());
    } else {
        chars += `<br/>${value}`;
    }
});
chars = chars.slice(5);
const triggerConfettis = new Event("confetti");
let confetti = new Confetti("c");

// tadjikistan
confetti.setCount(300);
confetti.setSize(2);
confetti.setPower(50);
confetti.setFade(true);
confetti.destroyTarget(false);

function getElem(id) {return document.getElementById(id)};

/////////////////////
/// ELEMS + FUNCS ///
/////////////////////

// this is chaotic and need some optimisation but it works so shush
regenBtn = getElem("regenBtn");
reportBtn = getElem("reportBtn");
checkInputBtn = getElem("checkInputBtn");
uinput = getElem("uinput");
inputArea = getElem("input-area");
resultArea = getElem("result-area");
char = getElem("char")
showCharsBtn = getElem("showCharsBtn");
showOptionsBtn = getElem("showOptions");
errorText = getElem("error-text");
loadSpinner = getElem("load-spinner");
mcontent = getElem("main-wrapper");
mcontentchar = getElem("mcontentchar");
clist = getElem("clist");
options = getElem("options");
showLeftPanelBtn = getElem("leftPanelSwitch");
showOldVersionsBtn = getElem("oldVersionsSwitch");
//
optionsLightMode = getElem("optionsLightMode");
optionsNoConfettis = getElem("optionsNoConfettis");
optionsNewAuto = getElem("optionsNewAuto");
optionsHideReportBtn = getElem("optionsHideWrongImg");
// game modes
leftWrapper = getElem("left-panel-wrapper");
mainWrapper = getElem("main-wrapper");
gmMap = getElem("gmMap");
gmChar = getElem("gmChar");
// map
showMapBtn = getElem("showMapBtn");
genMapBtn = getElem("genMapBtn");
checkMapBtn = getElem("checkMapBtn");
genMapBtnBottom = getElem("genMapBtnBottom");

// ctrl + q shortcut
document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.keyCode == 81) {
        e.preventDefault();
        if (gameMode == "char") {  
            if (gen==false && charsListEnabled==false && optionsShown==false) {genImage();};
        } else {
            if (genMap==false && optionsShown==false) {genMapGuess();};
        }
    } else if (e.keyCode == 13) {
        e.preventDefault();
        if (gameMode == "map" && checkMapBtn.disabled == false) {
            checkMap();
        }
    } else if (e.keyCode == 32) {
        if (gameMode == "map" && genMap == false) {
            e.preventDefault();
            showMap();
        }
    }
});
// input enter shortcut
uinput.onkeydown = function(event) {if (event.keyCode == 13) {check();}};

// buttons links
gmMap.addEventListener("click", function(event) {event.preventDefault(); switchMode("map");})
gmChar.addEventListener("click", function(event) {event.preventDefault(); switchMode("char");})
regenBtn.addEventListener("click", function(event) {event.preventDefault(); genImage();});
reportBtn.addEventListener("click", function(event) {event.preventDefault(); showPopup("Report image", "Please join the <a href='https://discord.gg/fzRdtVh', target='_blank'>discord</a> and provide this : <span style='color: white; background: #2a2a2a;'>"+buid+"</span>", 260, 200);});
genMapBtn.addEventListener("click", function(event) {event.preventDefault(); genMapGuess();})
showMapBtn.addEventListener("click", function(event) {event.preventDefault(); showMap();})
checkMapBtn.addEventListener("click", function(event) {event.preventDefault(); checkMap();})
showCharsBtn.addEventListener("click", function(event) {event.preventDefault(); switchCharList();})
checkInputBtn.addEventListener("click", function(event) {event.preventDefault(); check();})
showOptionsBtn.addEventListener("click", function(event) {event.preventDefault(); switchOptions();})
genMapBtnBottom.addEventListener("click", function(event) {event.preventDefault(); genMapGuess();})
showLeftPanelBtn.addEventListener("click", function(event) {event.preventDefault(); switchLeftPanel();})
showOldVersionsBtn.addEventListener("click", function(event) {event.preventDefault(); showOldVersions();})

getElem("listContent").innerHTML = chars;

////////////////////////////////////////
/// COOKIES LOCAL STORAGE EDITION :) ///
////////////////////////////////////////

function getCookie(name, check=false) {
    t = window.localStorage.getItem(name)
    if (t != null) {
        return t;
    } else {
        if (check == false) {
            setCookie(name, 0)
            return 0
        } else {
            return false
        }
    }
}

function setCookie(name, value) {
    window.localStorage.setItem(name, value);
}

function deleteCookie(name) {
    window.localStorage.removeItem(name);
}

//////////////////////
/// SET UP OPTIONS ///
//////////////////////

optionsLightMode.checked = getCookie("lightMode") == 1 ? true : false;
optionsNoConfettis.checked = getCookie("noConfettis") == 1 ? true : false;
optionsNewAuto.checked = getCookie("newAuto") == 1 ? true : false;
optionsHideReportBtn.checked = getCookie("hideReportBtn") == 1 ? true : false;

optionsLightMode.addEventListener("click", function() { setCookie("lightMode", optionsLightMode.checked ? 1 : 0); themeSwitch(); })
optionsNoConfettis.addEventListener("click", function() { setCookie("noConfettis", optionsNoConfettis.checked ? 1 : 0); });
optionsNewAuto.addEventListener("click", function() { setCookie("newAuto", optionsNewAuto.checked ? 1 : 0); });
optionsHideReportBtn.addEventListener("click", function() { setCookie("hideReportBtn", optionsHideReportBtn.checked ? 1 : 0); reportBtnSwitch(); })

//////////////////////
/// MAIN FUNCTIONS ///
//////////////////////

// change gamemode
function switchMode(mode, initialize=true) {
    if (optionsShown == true) {
        switchOptions();
    }
    if (mode == "char") {
        // map to char
        leftWrapper.style.transform = "translateX(-50%)";
        mainWrapper.style.transform = "translateX(-50%)";

        getElem("gamemodeSelector").style.transform = "translateX(calc(100% + 4px))";

        gameMode = "char";
        setCookie("gamemode", "char");

        if (charInitialized == false && initialize == true) {
            genImage();
        };
    } else {
        // char to map
        leftWrapper.style.transform = "translateX(0)";
        mainWrapper.style.transform = "translateX(0)";

        getElem("gamemodeSelector").style.transform = "translateX(0)";

        gameMode = "map";
        setCookie("gamemode", "map");

        if (mapInitialized == false && initialize == true) {
            genMapGuess();
        };
    }
}

switchMode(getCookie("gamemode"), false);

// toggle about menu
function switchLeftPanel() {
    mainPanel = getElem("mainPanel");
    leftPanel = getElem("leftPanel");
    if (gameMode == "map") {
        setTimeout(function() {map.invalidateSize()}, 300);
    }
    if (leftPanelShown == false) {
        mainPanel.classList.add("main-panel-moved");
        leftPanel.style.transform = "translateX(0)";
        leftPanelShown = true;
        showLeftPanelBtn.classList.add("btnSelected");
        setCookie("leftPanelVisible", 1);
    } else {
        mainPanel.classList.remove("main-panel-moved");
        leftPanelShown = false;
        leftPanel.style.transform = "translateX(-100vw)";
        showLeftPanelBtn.classList.remove("btnSelected");
        setCookie("leftPanelVisible", 0);
    }
}

if (getCookie("leftPanelVisible", true) === false && window.innerWidth > 690) { switchLeftPanel(); } else { if (getCookie("leftPanelVisible") == 1) { switchLeftPanel(); } }

// dark / light mode
function themeSwitch() {
    if (getCookie("lightMode") == 1) {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
    } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
    }
}

themeSwitch();

// report button hide
function reportBtnSwitch() {
    if (getCookie("hideReportBtn") == 1) {
        reportBtn.style.pointerEvents = "none";
        reportBtn.style.fontSize = "0";
        getElem("reportBtnDiv").style.width = "0";
    } else {
        reportBtn.style.pointerEvents = null;
        reportBtn.style.fontSize = null;
        getElem("reportBtnDiv").style.width = null;
    }
}

reportBtnSwitch();

// characters list
function switchCharList() {
    if (window.innerWidth < 690) {
        switchLeftPanel();
    }
    if (charsListEnabled == false) {   
        // char -> list
        if (optionsShown == true) {
            switchOptions();
        }
        showCharsBtn.classList.add("btnSelected");
        getElem("mcontlistwrap").style.transform = "translateY(0)";
        charsListEnabled = true;
    } else {
        // list -> char
        showCharsBtn.classList.remove("btnSelected");
        getElem("mcontlistwrap").style.transform = "translateY(-50%)";
        charsListEnabled = false;
    }
}

// toggle options
function switchOptions() {
    if (optionsShown == false) {   
        // char -> list
        showOptionsBtn.classList.add("btnSelected");
        optionsShown = true;
        getElem("topwrapper").style.transform = "translateY(0)";
    } else {
        // char -> list
        showOptionsBtn.classList.remove("btnSelected");
        optionsShown = false;
        getElem("topwrapper").style.transform = "translateY(-50%)";
    }
}

// show old versions in settings
function showOldVersions() {
    if (oldVersionsShown == false) {
        showOldVersionsBtn.classList.add("btnSelected");
        oldVersionsShown = true;
        getElem("oldNews").style.opacity = 1;
        getElem("oldNews").style.height = "max-content";
    } else {
        showOldVersionsBtn.classList.remove("btnSelected");
        oldVersionsShown = false;
        getElem("oldNews").style.opacity = 0;
        getElem("oldNews").style.height = "0";
    }
}

// change buttons state
function buttonState(tf, b, mode) {
    if (mode == "char") {
        regenBtn.disabled = tf;
        uinput.disabled = tf;
        checkInputBtn.disabled = tf;
        reportBtn.disabled = tf;
    } else {
        genMapBtn.disabled = tf;
        showMapBtn.disabled = tf;
        genMapBtnBottom.disabled = tf;
    }
}

///////////////////////////
/// CHARACTERS GAMEMODE ///
///////////////////////////

// gen image
function genImage() {
    if (charInitialized == false) {
        charInitialized = true;
    };

    gen = true;
    resultLoading = false;
    errorText.style.visibility = "hidden";
    loadSpinner.style.visibility = "visible";
    char.style.opacity = 0.5;

    buttonState(true, 0.7, "char");

    char.style.height = "70%";

    var img = new Image();

    img.onload = function() {
        char.src = img.src;
        char.style.opacity = 1;
        loadSpinner.style.visibility = "hidden";
        
        buttonState(false, 1, "char");

        inputArea.style.opacity = 1;
        resultArea.style.opacity = 0;

        uinput.disabled = false;
        checkInputBtn.disabled = false;

        if (gameMode == "char" && optionsShown == false && charsListEnabled == false) {
            uinput.focus();
        };

        URL.revokeObjectURL(url_object);
        URL.revokeObjectURL(url_object_result);

        gen = false;
    }

    const req = new Request("https://api.escartem.eu.org/p/gca/c");

    fetch(req).then((response) => {
        curr_char = response.headers.get("char");
        buid = response.headers.get("uid");
        result_url = response.headers.get("result");
        response.blob().then((blob) => {
            const objectURL = URL.createObjectURL(blob);
            url_object = objectURL
            img.src = objectURL;
        });
    })
    .catch((error) => {
        char.src = "./assets/img/load.png";
        char.style.opacity = 1;
        loadSpinner.style.visibility = "hidden";
        errorText.style.visibility = "visible";
        regenBtn.disabled = false;
        regenBtn.style.filter = "brightness(1)";
        gen = false;
    });
}

// check input
function check() {
    resultLoading = true;
    uinput.blur()
    uinput.disabled = true;
    checkInputBtn.disabled = true;
    var entry = (uinput.value).toLowerCase().trimEnd();
    var text = getElem("result-text");

    if (curr_char.toLowerCase() in charReplacement) {
        win = (charReplacement[curr_char.toLowerCase()].includes(entry));
    } else {
        win = (entry == curr_char.toLowerCase())
    };

    if (win) {
        if (getCookie("noConfettis") == 0) {
            getElem("c").dispatchEvent(triggerConfettis);
        }
        text.innerHTML = "Correct 🎉";
        text.style.color = "var(--text-green)";
    } else {
        text.innerHTML = "Nope, it was "+curr_char+" 😔";
        text.style.color = "var(--text-red)";
    }

    uinput.value = "";

    inputArea.style.opacity = 0;
    resultArea.style.opacity = 1;

    char.style.opacity = 0.5;
    loadSpinner.style.visibility = "visible";
    char.style.height = "100%";

    if (getCookie("newAuto") == 1 && win) {
        genImage();
    }

    var img = new Image();

    img.onload = function() {
        if (resultLoading == true) {
            char.src = img.src;
            char.style.opacity = 1;
            // char.style.opacity = 1;
            loadSpinner.style.visibility = "hidden";
        }

        resultLoading = false;

    }

    const req = new Request(result_url);

    fetch(req).then((response) => {
        response.blob().then((blob) => {
            const objectURL = URL.createObjectURL(blob);
            url_object_result = objectURL
            img.src = objectURL;
        });
    })
    .catch((error) => {
        char.src = "./assets/img/load.png";
        char.style.opacity = 1;
        loadSpinner.style.visibility = "hidden";
        errorText.style.visibility = "visible";
        regenBtn.disabled = false;
        regenBtn.style.filter = "brightness(1)";
    });
}

////////////////////
/// MAP GAMEMODE ///
////////////////////

mapChecked = false;
var genMap = false;
var marker;
var imgMarker;
var rlat = 0;
var rlng = 0;
var polyline = null;
var guessImg = getElem("guessMap");
var loadSpinnerMap = getElem("load-spinner-map");
var errorTextMap = getElem("error-text-map");

// setup map
var map = L.map("map", {
    crs: L.CRS.Simple
}).setView([0, 0], 1);

L.TileLayer.CustomCoords = L.TileLayer.extend({
    getTileUrl: function(tilecoords) {
        tilecoords.x = tilecoords.x;
        tilecoords.y = -tilecoords.y-1;
        tilecoords.z = tilecoords.z;
        return L.TileLayer.prototype.getTileUrl.call(this, tilecoords);
    }
});

var layer = new L.TileLayer.CustomCoords("https://bluedb.escartem.eu.org/gs/map/{z}/{z}_{x}-{y}.png", {
    bounds: [[-256, -256], [256, 256]],
    tms: true,
    infinite: false,
    minZoom: 1,
    maxZoom: 6,
    zoomOffset: 9,
    errorTileUrl: "assets/img/empty.png"
}).addTo(map);

var resultIcon = L.icon({
    iconUrl: "assets/img/result-marker.png",
    shadowUrl: "assets/img/marker-shadow.png",

    iconSize: [25, 25],
    shadowSize: [41, 41],
    iconAnchor: [12, 24],
    shadowAnchor: [12, 37]
});

// map functions
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
};

if (typeof(Number.prototype.between) === "undefined") {
    Number.prototype.between = function(a, b, i=true) {
        var min = Math.min.apply(Math, [a, b]);
        var max = Math.max.apply(Math, [a, b]);
        return i ? this >= min && this <= max : this > min && this < max;
    }
};

function getXYcoord(lat, lng, size) {
    x = Math.floor(lng/size);
    y = Math.floor(lat/size);
    return [x, y];
};

function getLLcoord(x, y, size) {
    lat = y*size+(size/2);
    lng = x*size+(size/2);
    return [lat, lng];
};

map.on("click", function(ev) {
    if (mapChecked == false) {
        if (checkMapBtn.disabled = true) {
            checkMapBtn.disabled = false;
        };

        if (!marker) {
            marker = L.marker(ev.latlng).addTo(map);
        } else {
            marker.setLatLng(ev.latlng);
        };
    }
})

function showMap() {
    getElem("mmaplistwrap").style.transform = "translateY(-50%)";
    map.invalidateSize();
};

function mapScorePos(score) {
    message = "";
    if (score == 0) {
        message = "How.";
        if (getCookie("noConfettis") == 0) {
            getElem("c").dispatchEvent(triggerConfettis);
        };
    } else if (score.between(0, 80)) {
        message = "Perfectly on spot 🎉";
        if (getCookie("noConfettis") == 0) {
            getElem("c").dispatchEvent(triggerConfettis);
        };
    } else if (score.between(80, 140)) {
        message = "Pretty close 😔";
    } else if (score.between(140, 320)) {
        message = "Good, but not good enough 🗿";
    } else if (score.between(320, 580)) {
        message = "Better luck next time 🍀";
    } else if (score.between(580, 800)) {
        message = "You tried 🤓";
    } else {
        message = "You are completly lost 🤨";
    }
    return message;
}

function genMapGuess() {
    if (mapInitialized == false) {
        mapInitialized = true;
    };

    genMap = true;
    getElem("mmaplistwrap").style.transform = "translateY(0)";

    errorTextMap.style.visibility = "hidden";
    loadSpinnerMap.style.visibility = "visible";
    guessImg.style.opacity = 0.5;
    getElem("mapMessage").style.transform = "translateY(-10vh)";
    
    buttonState(true, 0.7, "map");
    checkMapBtn.disabled = true;

    if (marker) {marker.remove(); marker=null};
    if (imgMarker) {imgMarker.remove()};
    if (polyline) {polyline.remove()};

    var img = new Image();

    img.onload = function() {
        guessImg.src = img.src;
        guessImg.style.opacity = 1;
        loadSpinnerMap.style.visibility = "hidden";

        buttonState(false, 0.7, "map");

        genMap = false;

        URL.revokeObjectURL(url_object);

        mapChecked = false;

        map.setView([0, 0], 1);
        map.invalidateSize();
    }

    // defaults to medium difficulty, will add easy/hard mode later
    const req = new Request("https://api.escartem.eu.org/p/gca/m/14x512");

    fetch(req).then((response) => {
        rx = response.headers.get("rx");
        ry = response.headers.get("ry");
        size = response.headers.get("size");
        os = 2**(-(size-9)+8);
        llc = getLLcoord(rx,ry,os);
        [rlat,rlng]= [llc[0],llc[1]];

        response.blob().then((blob) => {
            const objectURL = URL.createObjectURL(blob);
            url_object = objectURL;
            img.src = objectURL;
        });
    })
    .catch((error) => {
        guessImg.src = "./assets/img/load.png";
        guessImg.style.opacity = 1;
        loadSpinnerMap.style.visibility = "hidden";
        errorTextMap.style.visibility = "visible";
        genMapBtn.disabled = false;
        genMapBtn.style.filter = "brightness(1)";
        genMap = false;
    })
};

function checkMap() {
    mapChecked = true;

    checkMapBtn.disabled = true;

    imgMarker = L.marker([lat, lng], {icon: resultIcon}).addTo(map);

    var dots = Array();
    dots.push(marker.getLatLng());
    dots.push(imgMarker.getLatLng());

    distance = dots[0].distanceTo(dots[1]);
    score = Math.round(distance/10000);

    polyline = L.polyline(dots, {color: "red"}).addTo(map);
    map.fitBounds(polyline.getBounds());

    // approximation of ratio between geographic coordonate system and in-game distance
    coeff = 2.948595429*10**-4

    gameDistance = distance * coeff;
    distanceMessage = mapScorePos(gameDistance);

    getElem("mapMessageTop").innerHTML = `You were ${Math.round(gameDistance)} meters away`;
    getElem("mapMessageBottom").innerHTML = distanceMessage;
    getElem("mapMessage").style.transform = "translateY(0)";
}

////////////
/// MISC ///
////////////

function showPopup(title, text, width="150", height="90") {
    var popupDialog = getElem("popupDialog");

    if (! popupDialog.showModal) {
        dialogPolyfill.registerDialog(popupDialog);
    }

    getElem("popupTitle").innerHTML = title;
    getElem("popupContent").innerHTML = text;

    popupDialog.style.height = height+"px";
    popupDialog.style.width = width+"px";

    popupDialog.showModal();

    popupDialog.querySelector('.close').addEventListener('click', function() {popupDialog.close();});
}

window.addEventListener("load", () => {
    document.body.style.opacity = 1;
    switchMode(gameMode);
});
