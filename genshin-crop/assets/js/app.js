// Escartem

// ems is a simple script that disable some keyboard shortcuts and show a nice message in console
// setupEMS({"RCB": true, "DVT": false, "BSC": true, "SRC": true});

// version
VERSION = "2.0.0"
console.log("v"+VERSION);
document.getElementById("version").innerHTML = "V"+VERSION;

////////////
/// VARS ///
////////////

var curr_char = null;
var buid = null;
var url_object = null;
var url_object_result = null;
var gen = false;
var resultLoading = false;
var full_url = null;
var charsListEnabled = false;
var optionsShown = false;
var leftPanelShown = false;
var oldVersionsShown = false;
var gameMode = "map";
var charList = ["Aether", "Albedo", "Alhaitham", "Aloy", "Amber", "Ayaka", "Ayato", "Barbara", "Beidou", "Bennett", "Candace", "Chongyun", "Collei", "Cyno", "Dehya", "Diluc", "Diona", "Dori", "Eula", "Faruzan", "Fischl", "Ganyu", "Gorou", "Heizou", "Hu Tao", "Itto", "Jean", "Kaeya", "Kazuha", "Keqing", "Klee", "Kokomi", "Kujou Sara", "Kuki", "Layla", "Lisa", "Lumine", "Mika", "Mona", "Nahida", "Nilou", "Ningguang", "Noelle", "Qiqi", "Raiden", "Razor", "Rosaria", "Sayu", "Shenhe", "Sucrose", "Tartaglia", "Thoma", "Tighnari", "Venti", "Wanderer", "Xiangling", "Xiao", "Xingqiu", "Xinyan", "Yae Miko", "Yanfei", "YaoYao", "Yelan", "Yoimiya", "Yun Jin", "Zhongli"]
var chars = charList.join().replaceAll(","," <br/> ")
const triggerConfettis = new Event("confetti");
let confetti = new Confetti('checkInputBtn');

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
showMapBtn = getElem("showMapBtn");
genMapBtn = getElem("genMapBtn");

document.addEventListener("keydown", function(e) {if (e.ctrlKey && e.keyCode == 81) {e.preventDefault(); if (gen==false && charsListEnabled==false && optionsShown==false) {genImage();}}});
gmMap.addEventListener("click", function(event) {event.preventDefault(); switchMode("map");})
gmChar.addEventListener("click", function(event) {event.preventDefault(); switchMode("char");})
uinput.onkeydown = function(event) {if (event.keyCode == 13) {check();}};
regenBtn.addEventListener("click", function(event) {event.preventDefault(); genImage();});
reportBtn.addEventListener("click", function(event) {event.preventDefault(); showPopup("Report image", "Please join the <a href='https://discord.gg/fzRdtVh', target='_blank'>discord</a> and provide this : <span style='color: white; background: #2a2a2a;'>"+buid+"</span>", 260, 200);});
genMapBtn.addEventListener("click", function(event) {event.preventDefault(); genMap();})
showMapBtn.addEventListener("click", function(event) {event.preventDefault(); showMap();})
showCharsBtn.addEventListener("click", function(event) {event.preventDefault(); switchCharList();})
checkInputBtn.addEventListener("click", function(event) {event.preventDefault(); check();})
showOptionsBtn.addEventListener("click", function(event) {event.preventDefault(); switchOptions();})
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
function switchMode(mode) {
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
    } else {
        // char to map
        leftWrapper.style.transform = "translateX(0)";
        mainWrapper.style.transform = "translateX(0)";

        getElem("gamemodeSelector").style.transform = "translateX(0)";

        gameMode = "map";
        setCookie("gamemode", "map");
    }
}

switchMode(getCookie("gamemode"));

// toggle about menu
function switchLeftPanel() {
    mainPanel = getElem("mainPanel");
    leftPanel = getElem("leftPanel");
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
function buttonState(tf, b) {
    regenBtn.disabled = tf;

    uinput.disabled = tf;
    
    checkInputBtn.disabled = tf;

    reportBtn.disabled = tf;
}

///////////////////////////
/// CHARACTERS GAMEMODE ///
///////////////////////////

// gen image
function genImage() {
    gen = true;
    resultLoading = false;
    errorText.style.visibility = "hidden";
    loadSpinner.style.visibility = "visible";
    char.style.opacity = 0.5;

    buttonState(true, 0.7);

    showCharsBtn.disabled = true;
    showOptionsBtn.disabled = true;

    char.style.height = "70%";

    var img = new Image();

    img.onload = function() {
        char.src = img.src;
        char.style.opacity = 1;
        loadSpinner.style.visibility = "hidden";
        
        buttonState(false, 1);

        inputArea.style.opacity = 1;
        resultArea.style.opacity = 0;

        uinput.disabled = false;
        checkInputBtn.disabled = false;

        uinput.focus();

        URL.revokeObjectURL(url_object);
        URL.revokeObjectURL(url_object_result);

        gen = false;
        showCharsBtn.disabled = false;
        showOptionsBtn.disabled = false;
    }

    const req = new Request("https://api.escartem.eu.org/p/gca/c");

    fetch(req).then((response) => {
        curr_char = response.headers.get("char");
        buid = response.headers.get("uid");
        // full_url = response.headers.get("full");
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
        showCharsBtn.disabled = false;
        showOptionsBtn.disabled = false;
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

    if (entry == curr_char.toLowerCase()) {
        if (getCookie("noConfettis") == 0) {
            checkInputBtn.dispatchEvent(triggerConfettis)
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

    if (getCookie("newAuto") == 1 && entry == curr_char.toLowerCase()) {
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
var marker;
var imgMarker;
var rlat = 0;
var rlng = 0;
var polyline = null;

// setup map
var map = L.map("map", {
    crs: L.CRS.Simple
}).setView([0, 0], 0);

L.TileLayer.CustomCoords = L.TileLayer.extend({
    getTileUrl: function(tilecoords) {
        tilecoords.x = tilecoords.x;
        tilecoords.y = -tilecoords.y-1;
        tilecoords.z = tilecoords.z;
        return L.TileLayer.prototype.getTileUrl.call(this, tilecoords);
    }
});

var layer = new L.TileLayer.CustomCoords("https://game-cdn.appsample.com/gim/map-teyvat/v34-rc1/{z}/tile-{x}_{y}.jpg", {
    bounds: [[-256, -256], [256, 256]],
    tms: true,
    infinite: false,
    minZoom: 1,
    maxZoom: 6,
    zoomOffset: 9,
    errorTileUrl: "https://b.thumbs.redditmedia.com/H5nhWWeE6BI_2EOBPwPXaLIWBsFN0pV5YExGorp16zY.png"
}).addTo(map);

// map functions
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
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

function showMap() {
    getElem("mmaplistwrap").style.transform = "translateY(-50%)";
}

map.on("click", function(ev) {
    if (mapChecked == false) {
        // if (checkBtn.disabled = true) {
        //     checkBtn.disabled = false;
        // };

        if (!marker) {
            marker = L.marker(ev.latlng).addTo(map);
        } else {
            marker.setLatLng(ev.latlng);
        };
    }
})

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
})

// todo 
// bouton hide bar en haut et en bas car why not
