// Escartem

// ems is a simple script that disable some keyboard shortcuts and show a nice message in console
setupEMS({"RCB": true, "DVT": false, "BSC": true, "SRC": true});

// version
VERSION = "1.6.1"
console.log("v"+VERSION);
document.getElementById("version").innerHTML = "V"+VERSION;

// vars
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
var charList = ["Aether", "Albedo", "Alhaitham", "Aloy", "Amber", "Ayaka", "Ayato", "Barbara", "Beidou", "Bennett", "Candace", "Chongyun", "Collei", "Cyno", "Diluc", "Diona", "Dori", "Eula", "Faruzan", "Fischl", "Ganyu", "Gorou", "Heizou", "Hu Tao", "Itto", "Jean", "Kaeya", "Kazuha", "Keqing", "Klee", "Kokomi", "Kujou Sara", "Kuki", "Layla", "Lisa", "Lumine", "Mona", "Nahida", "Nilou", "Ningguang", "Noelle", "Qiqi", "Raiden", "Razor", "Rosaria", "Sayu", "Shenhe", "Sucrose", "Tartaglia", "Thoma", "Tighnari", "Venti", "Wanderer", "Xiangling", "Xiao", "Xingqiu", "Xinyan", "Yae Miko", "Yanfei", "YaoYao", "Yelan", "Yoimiya", "Yun Jin", "Zhongli"]
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

// elems and functions
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
mcontent = getElem("mcontent");
clist = getElem("clist");
options = getElem("options");
showLeftPanelBtn = getElem("leftPanelSwitch")
//
optionsLightMode = getElem("optionsLightMode");
optionsNoConfettis = getElem("optionsNoConfettis");
optionsNewAuto = getElem("optionsNewAuto");
optionsHideReportBtn = getElem("optionsHideWrongImg");

document.addEventListener("keydown", function(e) {if (e.ctrlKey && e.keyCode == 81) {e.preventDefault(); if (gen==false && charsListEnabled==false && optionsShown==false) {genImage();}}});
uinput.onkeydown = function(event) {if (event.keyCode == 13) {check();}};
regenBtn.addEventListener("click", function(event) {event.preventDefault(); genImage();});
reportBtn.addEventListener("click", function(event) {event.preventDefault(); showPopup("Report image", "Please join the <a href='https://discord.gg/fzRdtVh', target='_blank'>discord</a> and provide this : <span style='color: white; background: #2a2a2a;'>"+buid+"</span>", 260, 200);});
checkInputBtn.addEventListener("click", function(event) {event.preventDefault(); check();})
showCharsBtn.addEventListener("click", function(event) {event.preventDefault(); switchCharList();})
showOptionsBtn.addEventListener("click", function(event) {event.preventDefault(); switchOptions();})
showLeftPanelBtn.addEventListener("click", function(event) {event.preventDefault(); switchLeftPanel();})

getElem("listContent").innerHTML = chars;

// cookies -> switched to local storage for better perf but kept old names
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

// set up options
optionsLightMode.checked = getCookie("lightMode") == 1 ? true : false;
optionsNoConfettis.checked = getCookie("noConfettis") == 1 ? true : false;
optionsNewAuto.checked = getCookie("newAuto") == 1 ? true : false;
optionsHideReportBtn.checked = getCookie("hideReportBtn") == 1 ? true : false;

optionsLightMode.addEventListener("click", function() { setCookie("lightMode", optionsLightMode.checked ? 1 : 0); themeSwitch(); })
optionsNoConfettis.addEventListener("click", function() { setCookie("noConfettis", optionsNoConfettis.checked ? 1 : 0); });
optionsNewAuto.addEventListener("click", function() { setCookie("newAuto", optionsNewAuto.checked ? 1 : 0); });
optionsHideReportBtn.addEventListener("click", function() { setCookie("hideReportBtn", optionsHideReportBtn.checked ? 1 : 0); reportBtnSwitch(); })

// app functions
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

function switchCharList() {
    if (window.innerWidth < 690) {
        switchLeftPanel();
    }
    if (charsListEnabled == false) {   
        // char -> list
        mcontent.style.transform = "translateY(100%)";
        mcontent.style.height = "0";
        clist.style.transform = "translateY(0)";
        clist.style.height = "100%";
        getElem("clist-title").style.transform = "translateY(0)";
        getElem("list").style.transform = "translateY(0)";
        showCharsBtn.classList.add("btnSelected");
        showOptionsBtn.disabled = true;
        charsListEnabled = true;
        getElem("bottomText").style.visibility = "hidden";
    } else {
        // char -> list
        mcontent.style.transform = "translateY(0)";
        mcontent.style.height = "100%";
        clist.style.transform = "translateY(-100%)";
        clist.style.height = "0";
        getElem("clist-title").style.transform = "translateY(-100vh)";
        getElem("list").style.transform = "translateY(-100vh)";
        showCharsBtn.classList.remove("btnSelected");
        showOptionsBtn.disabled = false;
        charsListEnabled = false;
    }
}

function switchOptions() {
    if (optionsShown == false) {   
        // char -> list
        mcontent.style.transform = "translateY(100%)";
        mcontent.style.height = "0";
        options.style.transform = "translateY(0)";
        options.style.height = "100%";
        getElem("options-title").style.transform = "translateY(0)";
        getElem("optionsContent").style.transform = "translateY(0)";
        showOptionsBtn.classList.add("btnSelected");
        showCharsBtn.disabled = true;
        optionsShown = true;
        getElem("bottomText").style.visibility = "visible";
    } else {
        // char -> list
        mcontent.style.transform = "translateY(0)";
        mcontent.style.height = "100%";
        options.style.transform = "translateY(-100%)";
        options.style.height = "0";
        getElem("options-title").style.transform = "translateY(-100vh)";
        getElem("optionsContent").style.transform = "translateY(-100vh)";
        showOptionsBtn.classList.remove("btnSelected");
        showCharsBtn.disabled = false;
        optionsShown = false;
    }
}

// change buttons state
function buttonState(tf, b) {
    regenBtn.disabled = tf;

    uinput.disabled = tf;
    
    checkInputBtn.disabled = tf;

    reportBtn.disabled = tf;
}

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

        // for some reason this does not seem to work
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
        text.style.color = "#beffbe";
    } else {
        text.innerHTML = "Nope, it was "+curr_char+" 😔";
        text.style.color = "#ff9f9f";
    }

    uinput.value = "";

    inputArea.style.opacity = 0;
    resultArea.style.opacity = 1;

    // char.style.opacity = 0;
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

    // img.src = full_url;

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

window.onload = genImage();
