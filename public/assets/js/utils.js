//// utils ////

var curr_char=buid=url_object=url_object_result=full_url=null;
var gen=resultLoading=charsListEnabled=optionsShown=leftPanelShown=oldVersionsShown=charInitialized=mapInitialized=newThemeEnabled=disableAutoFocus=false;

var gameMode = "map";
var phoneWidth = 800;
var currentGen = 0;

// tadjikistan
const triggerConfettis = new Event("confetti");
let confetti = new Confetti("c");
confetti.setCount(300);
confetti.setSize(2);
confetti.setPower(50);
confetti.setFade(true);
confetti.destroyTarget(false);

function getElem(id) {return document.getElementById(id)};

///////////////////////////
//// UPDATE BACKGROUND ////
///////////////////////////

function updateBg() {
	if (optionsSRMode.checked == true && gameMode == "char") {
		document.getElementsByClassName("background-hsr")[0].style.opacity = 1;
		document.getElementsByClassName("background-ys")[0].style.opacity = 0;

	} else {
		document.getElementsByClassName("background-hsr")[0].style.opacity = 0;
		document.getElementsByClassName("background-ys")[0].style.opacity = 1;
	}
}

//////////////////////
//// RESET SCORES ////
//////////////////////

function resetScores() {
	if (confirm("Reset scores ?")) {
		setVar("mapCount", 0);
		setVar("mapWin", 0);
		setVar("charCount", 0);
		setVar("charWin", 0);
		updateStats();
	}
}

/////////////////////////
//// CHANGE GAMEMODE ////
/////////////////////////

function switchMode(mode, initialize=true) {
	if (mode == "char") {
		// map to char
		leftWrapper.style.transform = "translateX(-50%)";
		mainWrapper.style.transform = "translateX(-50%)";

		getElem("gamemodeSelector").style.transform = "translateX(calc(100% + 4px))";

		gameMode = "char";
		setVar("gameMode", "char");

		if (optionsShown == true) {
			switchOptions();
		}

		if (charInitialized == false && initialize == true) {
			genImage();
		};

		if (uinput.disabled == false && disableAutoFocus == false && charsListEnabled == false) {
			setTimeout(function() {
				uinput.focus();
			}, 250);
		}
	} else {
		// char to map
		leftWrapper.style.transform = "translateX(0)";
		mainWrapper.style.transform = "translateX(0)";

		getElem("gamemodeSelector").style.transform = "translateX(0)";

		gameMode = "map";
		setVar("gameMode", "map");

		if (optionsShown == true) {
			switchOptions();
		}

		if (mapInitialized == false && initialize == true) {
			genMapGuess();
		};
	}

	updateBg();
}

////////////////////
//// LEFT PANEL ////
////////////////////

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
		setVar("leftPanelEnabled", true);
	} else {
		mainPanel.classList.remove("main-panel-moved");
		leftPanelShown = false;
		leftPanel.style.transform = "translateX(-100vw)";
		showLeftPanelBtn.classList.remove("btnSelected");
		setVar("leftPanelEnabled", false);
		if (window.innerWidth < phoneWidth && gameMode == "char" && uinput.disabled == false && disableAutoFocus == false && charsListEnabled == false && optionsShown == false) {
			setTimeout(function() {
				uinput.focus();
			}, 250);
		}
	}
}

///////////////
//// THEME ////
///////////////

function themeSwitch() {
	if (getVar("lightMode")) {
		document.documentElement.classList.remove("dark");
		document.documentElement.classList.add("light");
	} else {
		document.documentElement.classList.remove("light");
		document.documentElement.classList.add("dark");
	}
}

///////////////////////
//// REPORT BUTTON ////
///////////////////////

function reportBtnSwitch() {
	if (getVar("hideReportButton")) {
		reportBtn.style.pointerEvents = "none";
		reportBtn.style.fontSize = "0";
		getElem("reportBtnDiv").style.width = "0";
	} else {
		reportBtn.style.pointerEvents = null;
		reportBtn.style.fontSize = null;
		getElem("reportBtnDiv").style.width = null;
	}
}

/////////////////////////
//// CHARACTERS LIST ////
/////////////////////////

function switchCharList() {
	if (charsListEnabled == false) {   
		// char -> list
		charsListEnabled = true;
		if (optionsShown == true) {
			switchOptions();
		}
		if (window.innerWidth < phoneWidth) {
			switchLeftPanel();
		}
		showCharsBtn.classList.add("btnSelected");
		getElem("mcontlistwrap").style.transform = "translateY(0)";
	} else {
		// list -> char
		showCharsBtn.classList.remove("btnSelected");
		getElem("mcontlistwrap").style.transform = "translateY(-50%)";
		charsListEnabled = false;

		if (window.innerWidth < phoneWidth) {
			switchLeftPanel();
		}

		if (uinput.disabled == false && optionsShown == false && disableAutoFocus == false) {
			setTimeout(function() {
				uinput.focus();
			}, 250);
		}
	}
}

/////////////////
//// OPTIONS ////
/////////////////

function switchOptions() {
	if (window.innerWidth < phoneWidth && getVar("leftPanelEnabled")) {
		switchLeftPanel();
	}
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

		if (uinput.disabled == false && gameMode == "char" && charsListEnabled == false && disableAutoFocus == false) {
			setTimeout(function() {
				uinput.focus();
			}, 250);
		}
	}
}

//////////////////////
//// OLD VERSIONS ////
//////////////////////

function showOldVersions() {
	if (oldVersionsShown == false) {
		showOldVersionsBtn.classList.add("btnSelected");
		oldVersionsShown = true;
		getElem("oldAppUpdates").style.opacity = 1;
		getElem("oldAppUpdates").style.height = "max-content";
	} else {
		showOldVersionsBtn.classList.remove("btnSelected");
		oldVersionsShown = false;
		getElem("oldAppUpdates").style.opacity = 0;
		getElem("oldAppUpdates").style.height = "0";
	}
}

///////////////////
//// NEW THEME ////
///////////////////

function switchNewTheme() {
	var topBar = getElem("top-bar");
	var topLeft = getElem("bar-left");
	var barMiddle = getElem("bar-middle");

	var barBottom = document.getElementsByClassName("bottom")[0];
	var bottomLeft = document.getElementsByClassName("left")[0];
	var bottomRight = document.getElementsByClassName("right")[0];

	if (getVar("newTheme")) {
		// update top bar
		topBar.style.transform = "translateY(-100%)";
		topLeft.style.transform = "translateY(calc(100% + 1px))";
		barMiddle.style.transform = "translateY(calc(100% + 1px))";

		// update bottom bar
		barBottom.classList.add("bottomMovedParent");
		bottomLeft.classList.add("bottomMovedChild");
		bottomRight.classList.add("bottomMovedChild");

		// update bg
		document.getElementsByClassName("background")[0].style.opacity = 0.7;

		newThemeEnabled = true;
	} else {
		topBar.style.transform = null;
		topLeft.style.transform = null;
		barMiddle.style.transform = null;

		barBottom.classList.remove("bottomMovedParent");
		bottomLeft.classList.remove("bottomMovedChild");
		bottomRight.classList.remove("bottomMovedChild");

		document.getElementsByClassName("background")[0].style.opacity = 0;

		newThemeEnabled = false;
	}
}

//////////////////////
//// UPDATE STATS ////
//////////////////////

function createStatSpan(text) { return Object.assign(document.createElement("span"), { innerHTML: text, classList: "statNumber" }) }

function updateStats() {
	// map
	var statsMap = getElem("stats-map")
	var [count, win] = [createStatSpan(getVar("mapCount")), createStatSpan(getVar("mapWin"))]
	
	statsMap.innerHTML = `${count.outerHTML} games in map mode with ${win.outerHTML} won (${createStatSpan(Math.round((win.innerHTML/(parseInt(count.innerHTML)+Number.EPSILON))*100)+"%").outerHTML} win ratio)`

	// char
	var statsChar = getElem("stats-char")
	var [count, win] = [createStatSpan(getVar("charCount")), createStatSpan(getVar("charWin"))]
	var charText = `${count.outerHTML} games in character mode with ${win.outerHTML} won (${createStatSpan(Math.round((win.innerHTML/(parseInt(count.innerHTML)+Number.EPSILON))*100)+"%").outerHTML} win ratio)`

	statsChar.innerHTML = charText
}

// update buttons state //
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

// display error message //
function showError(id, message=null) {
	span = id;

	if (message == null) {
		span.innerHTML = "Something went wrong 😞<br/>Please try again";
	} else {
		span.innerHTML = message;
	}

	span.style.visibility = "visible";
}

// show notification //
function showNotification(message) {
	notifBar = getElem("notificationBar")
	notifText = getElem("notifBarText")
	notifBtn = getElem("notifBarCloseBtn")

	notifText.innerHTML = message
	notifBtn.onclick = () => { notifBar.style.transform = "translateY(-100%)"; }

	notifBar.style.transform = "translateY(0%)";
}
