// ems is a simple script that disable some keyboard shortcuts and show a nice message in console
setupEMS({"RCB": true, "DVT": false, "BSC": true, "SRC": true});

// version
VERSION = "2.6";
console.log(`v${VERSION}`);
document.getElementById("version").innerHTML = `V${VERSION}`;

////////////
/// VARS ///
////////////

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
options = getElem("options");
showLeftPanelBtn = getElem("leftPanelSwitch");
showOldVersionsBtn = getElem("oldVersionsSwitch");
// options
optionsLightMode = getElem("optionsLightMode");
optionsNoConfettis = getElem("optionsNoConfettis");
optionsDisableNewTheme = getElem("optionsDisableNewTheme")
optionsNewAuto = getElem("optionsNewAuto");
optionsHideReportBtn = getElem("optionsHideWrongImg");
optionsSRMode = getElem("optionsSRMode");
optionsDisableAutoFocus = getElem("optionsDisableAutoFocus");
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

// shortcuts
document.addEventListener("keydown", function(e) {
	if (e.ctrlKey && e.keyCode == 81) { // ctrl+q
		e.preventDefault();
		if (gameMode == "char") {  
			if (gen==false && charsListEnabled==false && optionsShown==false) {genImage();};
		} else {
			if (genMap==false && optionsShown==false) {genMapGuess();};
		}
	} else if (e.keyCode == 13) { // enter
		e.preventDefault();
		if (gameMode == "map" && checkMapBtn.disabled == false) {
			checkMap();
		}
	} else if (e.keyCode == 32) { // space
		if (gameMode == "map" && genMap == false) {
			e.preventDefault();
			showMap();
		}
	} else if (e.ctrlKey && e.keyCode == 77) { // ctrl+m
		mode = gameMode == "char" ? "map" : "char";
		switchMode(mode);
	}
});
// input enter shortcut
uinput.onkeydown = function(event) {if (event.keyCode == 13) {check();}};

// buttons links
gmMap.addEventListener("click", function(event) {event.preventDefault(); switchMode("map");})
gmChar.addEventListener("click", function(event) {event.preventDefault(); switchMode("char");})
regenBtn.addEventListener("click", function(event) {event.preventDefault(); genImage();});
reportBtn.addEventListener("click", function(event) {event.preventDefault(); showPopup("Report image", "Please join the <a href='https://discord.gg/fzRdtVh', target='_blank'>discord</a> and provide this : <span style='color: white; background: #2a2a2a;'>"+buid+"</span>", 60, 33);});
genMapBtn.addEventListener("click", function(event) {event.preventDefault(); genMapGuess();})
showMapBtn.addEventListener("click", function(event) {event.preventDefault(); showMap();})
checkMapBtn.addEventListener("click", function(event) {event.preventDefault(); checkMap();})
showCharsBtn.addEventListener("click", function(event) {event.preventDefault(); switchCharList();})
checkInputBtn.addEventListener("click", function(event) {event.preventDefault(); check();})
showOptionsBtn.addEventListener("click", function(event) {event.preventDefault(); switchOptions();})
genMapBtnBottom.addEventListener("click", function(event) {event.preventDefault(); genMapGuess();})
showLeftPanelBtn.addEventListener("click", function(event) {event.preventDefault(); switchLeftPanel();})
showOldVersionsBtn.addEventListener("click", function(event) {event.preventDefault(); showOldVersions();})

///////////////////
/// LOCALS VARS ///
///////////////////

function getVar(n,c=false) {t=window.localStorage.getItem(n); if (t!=null) {return t} else {if (c==false) {setVar(n,0); return 0} else {return false}}};
function setVar(n,v) {window.localStorage.setItem(n,v)};
function deleteVar(n) {window.localStorage.removeItem(n)};

//////////////////////
/// SET UP OPTIONS ///
//////////////////////

if (getVar("hideReportBtn", true) === false) {
	setVar("hideReportBtn", 1)
}

optionsLightMode.checked = getVar("lightMode") == 1 ? true : false;
optionsNoConfettis.checked = getVar("noConfettis") == 1 ? true : false;
optionsDisableNewTheme.checked = getVar("disableNewTheme") == 1 ? true : false;
optionsNewAuto.checked = getVar("newAuto") == 1 ? true : false;
optionsHideReportBtn.checked = getVar("hideReportBtn") == 1 ? true : false;
optionsSRMode.checked = getVar("srMode") == 1 ? true : false;
optionsDisableAutoFocus.checked = getVar("disableAutoFocus") == 1 ? true : false;

optionsLightMode.addEventListener("click", function() { setVar("lightMode", optionsLightMode.checked ? 1 : 0); themeSwitch(); })
optionsNoConfettis.addEventListener("click", function() { setVar("noConfettis", optionsNoConfettis.checked ? 1 : 0); });
optionsDisableNewTheme.addEventListener("click", function() { setVar("disableNewTheme", optionsDisableNewTheme.checked ? 1 : 0); switchNewTheme(); })
optionsNewAuto.addEventListener("click", function() { setVar("newAuto", optionsNewAuto.checked ? 1 : 0); });
optionsHideReportBtn.addEventListener("click", function() { setVar("hideReportBtn", optionsHideReportBtn.checked ? 1 : 0); reportBtnSwitch(); })
optionsSRMode.addEventListener("click", function() { setVar("srMode", optionsSRMode.checked ? 1 : 0); genImage(); updateBg(); })
optionsDisableAutoFocus.addEventListener("click", function() { setVar("disableAutoFocus", optionsDisableAutoFocus.checked ? 1 : 0); disableAutoFocus = optionsDisableAutoFocus.checked; })

disableAutoFocus = optionsDisableAutoFocus.checked;

//////////////////////
/// MAIN FUNCTIONS ///
//////////////////////

// fetch data
var sr=ys="";
function convertList(list) {
	var final = document.createElement("span")
	result = "";
	list.forEach(function(value) {
		if (typeof(value) === "object") {
			result += `<br/>• ${value.join().replaceAll(",",", ")}`;
		} else {
			result += `<br/>• ${value}`;
		}
	});
	result = result.slice(5);

	final.innerHTML = result
	final.classList.add("selectable")
	return final;
}

function convertListNew(data) {
	var result = document.createElement("div")
	result.classList.add("clistWrapper")


	Object.keys(data).forEach((e) => {
		var value = data[e][0]
		var cname = ""
		if (typeof(value) === "object") {
			cname = value[0]
			value.shift()
		} else {
			cname = value
			value = null
		}
		
		var wrapper = document.createElement("div")
		wrapper.classList.add("clistCharWrapper")

		var pic = document.createElement("img")
		pic.classList.add("clistCharImg")
		if (data[e][1] == 5) {
			pic.classList.add("five-star")
		} else {
			pic.classList.add("four-star")
		}
		pic.src = `https://bluedb.escartem.eu.org/gcrop/ys/card/${e}.png`

		var textWrap = document.createElement("div")
		textWrap.classList.add("clistTextWrap")

		var text = document.createElement("span")
		text.classList = "clistCharText selectable"
		text.innerHTML = cname

		wrapper.appendChild(pic)

		textWrap.appendChild(text)

		if (value != null) {
			var altText = document.createElement("span")
			altText.classList = "clistCharAltText selectable"
			altText.innerHTML = value.join().replaceAll(",", ", ")

			textWrap.appendChild(altText)
		}

		wrapper.appendChild(textWrap)
		result.appendChild(wrapper)
	})

	return result
}

var setupDone = false
function setupData() {
	const req = new Request("https://api.escartem.eu.org/p/gca/data?v=3");
	fetch(req).then(response => response.json()).then(json => {
		var charList = json["ys"]["chars"];
		var SRList = json["sr"]["display"]; 

		ys = convertListNew(charList);
		sr = convertList(SRList);

		updateCharsList(true)
	});
}

setupData();

function updateCharsList(setup=false) {
	if (setup == true) {
		setupDone = true
	}

	if (setupDone == true) {
		var listContent = getElem("listContent")
		if (optionsSRMode.checked == true) {
			listContent.innerHTML = ""
			listContent.appendChild(sr)
		} else {
			listContent.innerHTML = ""
			listContent.appendChild(ys)
		};
	}
}

//update bg
function updateBg() {
	if (optionsSRMode.checked == true) {
		document.getElementsByClassName("background-hsr")[0].style.opacity = 1
		document.getElementsByClassName("background-gi")[0].style.opacity = 0

	} else {
		document.getElementsByClassName("background-hsr")[0].style.opacity = 0
		document.getElementsByClassName("background-gi")[0].style.opacity = 1
	}
}

updateBg();

// change gamemode
function switchMode(mode, initialize=true) {
	if (mode == "char") {
		// map to char
		leftWrapper.style.transform = "translateX(-50%)";
		mainWrapper.style.transform = "translateX(-50%)";

		getElem("gamemodeSelector").style.transform = "translateX(calc(100% + 4px))";

		gameMode = "char";
		setVar("gamemode", "char");

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
		setVar("gamemode", "map");

		if (optionsShown == true) {
			switchOptions();
		}

		if (mapInitialized == false && initialize == true) {
			genMapGuess();
		};
	}
}

switchMode(getVar("gamemode"), false);

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
		setVar("leftPanelVisible", 1);
	} else {
		mainPanel.classList.remove("main-panel-moved");
		leftPanelShown = false;
		leftPanel.style.transform = "translateX(-100vw)";
		showLeftPanelBtn.classList.remove("btnSelected");
		setVar("leftPanelVisible", 0);
		if (window.innerWidth < phoneWidth && gameMode == "char" && uinput.disabled == false && disableAutoFocus == false && charsListEnabled == false && optionsShown == false) {
			uinput.focus();
		}
	}
}

if (getVar("leftPanelVisible", true) === false && window.innerWidth > phoneWidth) { switchLeftPanel(); } else { if (getVar("leftPanelVisible") == 1) { switchLeftPanel(); } }

// dark / light mode
function themeSwitch() {
	if (getVar("lightMode") == 1) {
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
	if (getVar("hideReportBtn") == 1) {
		reportBtn.style.pointerEvents = "none";
		reportBtn.style.fontSize = "0";
		reportBtn.marginLeft
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
	if (window.innerWidth < phoneWidth) {
		switchLeftPanel();
	}
	if (charsListEnabled == false) {   
		// char -> list
		charsListEnabled = true;
		if (optionsShown == true) {
			switchOptions();
		}
		showCharsBtn.classList.add("btnSelected");
		getElem("mcontlistwrap").style.transform = "translateY(0)";
	} else {
		// list -> char
		showCharsBtn.classList.remove("btnSelected");
		getElem("mcontlistwrap").style.transform = "translateY(-50%)";
		charsListEnabled = false;

		if (uinput.disabled == false && optionsShown == false && disableAutoFocus == false) {
			setTimeout(function() {
				uinput.focus();
			}, 250);
		}
	}
}

// toggle options
function switchOptions() {
	if (window.innerWidth < phoneWidth && getVar("leftPanelVisible") == 1) {
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

// show old versions in settings
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

function showError(id, message=null) {
	span = id;

	if (message == null) {
		span.innerHTML = "Something went wrong 😞<br/>Please try again";
	} else {
		span.innerHTML = message;
	}

	span.style.visibility = "visible";
}

function switchNewTheme() {
	var topBar = getElem("top-bar")
	var topLeft = getElem("bar-left")
	var barMiddle = getElem("bar-middle")

	var barBottom = document.getElementsByClassName("bottom")[0]
	var bottomLeft = document.getElementsByClassName("left")[0]
	var bottomRight = document.getElementsByClassName("right")[0]

	if (getVar("disableNewTheme") == 0) {
		// update top bar
		topBar.style.transform = "translateY(-100%)";
		topLeft.style.transform = "translateY(calc(100% + 1px))";
		barMiddle.style.transform = "translateY(calc(100% + 1px))";

		// update bottom bar
		barBottom.classList.add("bottomMovedParent")
		bottomLeft.classList.add("bottomMovedChild")
		bottomRight.classList.add("bottomMovedChild")

		// update bg
		document.getElementsByClassName("background")[0].style.opacity = 0.7

		newThemeEnabled = true
	} else {
		topBar.style.transform = null;
		topLeft.style.transform = null;
		barMiddle.style.transform = null;

		barBottom.classList.remove("bottomMovedParent")
		bottomLeft.classList.remove("bottomMovedChild")
		bottomRight.classList.remove("bottomMovedChild")

		document.getElementsByClassName("background")[0].style.opacity = 0

		newThemeEnabled = false
	}
}

switchNewTheme()

// update stats
function updateStats() {
	// map
	var statsMap = getElem("stats-map")
	var [count, win] = [getVar("mapCount"), getVar("mapWin")]
	var mapText = `${count} games in map mode with ${win} won (${Math.round((win/count)*100)}% win ratio)`
	
	statsMap.innerHTML = mapText

	// char
	var statsChar = getElem("stats-char")
	var [count, win] = [getVar("charCount"), getVar("charWin")]
	var charText = `${count} games in character mode with ${win} won (${Math.round((win/count)*100)}% win ratio)`

	statsChar.innerHTML = charText
}

updateStats()

function updateVar(name, val=1) {
	setVar(name, (parseInt(getVar(name))+val).toString());
	updateStats()
}

///////////////////////////
/// CHARACTERS GAMEMODE ///
///////////////////////////

// gen image
function genImage() {
	updateVar("charCount")
	currentGen += 1;
	updateCharsList()
	if (charsListEnabled == true) {
		switchCharList();
	}

	if (charInitialized == false) {
		charInitialized = true;
	};

	gen = true;
	resultLoading = false;
	errorText.style.visibility = "hidden";
	loadSpinner.style.visibility = "visible";
	char.style.opacity = 0.5;

	buttonState(true, 0.7, "char");

	char.style.transform = "scale(0.8)";

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

		if (gameMode == "char" && optionsShown == false && charsListEnabled == false && disableAutoFocus == false) {
			uinput.focus();
		};

		URL.revokeObjectURL(url_object);
		URL.revokeObjectURL(url_object_result);

		gen = false;
	}

	var req = null

	if (getVar("srMode") == 1) {
		req = new Request("https://api.escartem.eu.org/p/gca/srs");
	} else {
		req = new Request("https://api.escartem.eu.org/p/gca/c");
	}


	fetch(req).then((response) => {
		if (response.status == 200) {
			curr_char = response.headers.get("char");
			display = response.headers.get("display");
			alias = response.headers.get("alias").split(".");
			buid = response.headers.get("uid");
			result_url = response.headers.get("result");
			response.blob().then((blob) => {
				const objectURL = URL.createObjectURL(blob);
				url_object = objectURL
				img.src = objectURL;
			});
		} else {
			if (response.status != 403) {response.json().then(data => {charErrorHandle(data["message"])})};
			charErrorHandle();
		}
	})
	.catch((error) => {charErrorHandle(); gen=false;});
}

// check input
function check() {
	resultLoading = true;
	uinput.blur()
	uinput.disabled = true;
	checkInputBtn.disabled = true;
	var entry = (uinput.value).toLowerCase().trimEnd();
	var text = getElem("result-text");

	win = (entry == curr_char || alias.includes(entry));

	if (win) {
		if (getVar("noConfettis") == 0) {
			getElem("c").dispatchEvent(triggerConfettis);
		}
		text.innerHTML = "Correct 🎉";
		text.style.color = "var(--text-green)";
		updateVar("charWin")
	} else {
		text.innerHTML = `Nope, it was ${display} 😔`;
		text.style.color = "var(--text-red)";
	}

	uinput.value = "";

	inputArea.style.opacity = 0;
	resultArea.style.opacity = 1;

	char.style.opacity = 0.5;
	loadSpinner.style.visibility = "visible";
	char.style.transform = "scale(1)";

	if (getVar("newAuto") == 1 && win) {
		genImage();
		return
	}

	var img = new Image();

	img.onload = function() {
		if (resultLoading == true) {
			char.src = img.src;
			char.style.opacity = 1;
			loadSpinner.style.visibility = "hidden";
		}

		resultLoading = false;

	}

	const req = new Request(result_url);
	const cur = currentGen
	fetch(req).then((response) => {
		if (response.status == 200) {
			response.blob().then((blob) => {
				if (cur == currentGen) {
					const objectURL = URL.createObjectURL(blob);
					url_object_result = objectURL
					img.src = objectURL;
				}
			});
		} else {
			if (response.status != 403) {response.json().then(data => {charErrorHandle(data["message"])})};
			charErrorHandle();
		}
	})
	.catch((error) => {charErrorHandle()});
};

function charErrorHandle(msg=null) {
	char.src = "./assets/img/load.png";
	char.style.opacity = 1;
	loadSpinner.style.visibility = "hidden";
	showError(errorText, msg);
	regenBtn.disabled = false;
	regenBtn.style.filter = "brightness(1)";
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

var layer = new L.TileLayer.CustomCoords("https://bluedb.escartem.eu.org/gs/map/{z}/{z}_{x}-{y}.jpg", {
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
		updateVar("mapWin")
		message = "How.";
		if (getVar("noConfettis") == 0) {
			getElem("c").dispatchEvent(triggerConfettis);
		};
	} else if (score.between(0, 80)) {
		updateVar("mapWin")
		message = "Perfectly on spot 🎉";
		if (getVar("noConfettis") == 0) {
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
	updateVar("mapCount")
	if (mapInitialized == false) {
		mapInitialized = true;
	};

	genMap = true;
	getElem("mmaplistwrap").style.transform = "translateY(0)";

	errorTextMap.style.visibility = "hidden";
	loadSpinnerMap.style.visibility = "visible";
	guessImg.style.opacity = 0.5;
	getElem("mapMessage").style.transform = "translateY(-20vh)";
	getElem("mapMessage").style.opacity = "0";
	
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
		if (response.status == 200) {
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
		} else {
			if (response.status != 403) {response.json().then(data => {mapErrorHandle(data["message"])})};
			mapErrorHandle();
		}
	})
	.catch((error) => {mapErrorHandle()});
};

function mapErrorHandle(msg=null) {
	guessImg.src = "./assets/img/load.png";
	guessImg.style.opacity = 1;
	loadSpinnerMap.style.visibility = "hidden";
	showError(errorTextMap, msg);
	genMapBtn.disabled = false;
	genMapBtn.style.filter = "brightness(1)";
	genMap = false;
}

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
	getElem("mapMessage").style.opacity = "1";
}

////////////
/// MISC ///
////////////

// w150 et h90
function showPopup(title, content, width=80, height=70) {
	var popup = getElem("popup")
	var app = getElem("app")

	// update
	getElem("popup-title").innerHTML = title
	getElem("popup-content").innerHTML = content

	popup.style.width = `${width}%`
	popup.style.height = `${height}%`

	getElem("close-popup").addEventListener("click", () => { popup.classList.add("popup-disabled"); app.classList.remove("app-disabled"); });

	popup.classList.remove("popup-disabled")
	app.classList.add("app-disabled")
}

window.addEventListener("load", () => {
	document.body.style.opacity = 1;
	switchMode(gameMode);
});

// TODO
// use high-res map and btn to low res
// add difficulties with 13x and 15x
// translate 50.1% to fix left bar  
