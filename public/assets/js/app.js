// ems is a simple script that disable some keyboard shortcuts and show a nice message in console
setupEMS({"RCB": true, "DVT": false, "BSC": true, "SRC": true});

// version
VERSION = "2.7";
console.log(`📦 v${VERSION}`);
document.getElementById("version").innerHTML = `V${VERSION}`;
initConfig();

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
optionsConfettis = getElem("optionsConfettis");
optionsNewTheme = getElem("optionsNewTheme")
optionsNewAuto = getElem("optionsNewAuto");
optionsHideReportBtn = getElem("optionsHideWrongImg");
optionsSRMode = getElem("optionsSRMode");
optionsDisableAutoFocus = getElem("optionsDisableAutoFocus");
optionsBetterMap = getElem("optionsBetterMap");
// game modes
leftWrapper = getElem("left-panel-wrapper");
mainWrapper = getElem("main-wrapper");
// map
showMapBtn = getElem("showMapBtn");
genMapBtn = getElem("genMapBtn");
checkMapBtn = getElem("checkMapBtn");
genMapBtnBottom = getElem("genMapBtnBottom");

// shortcuts
document.addEventListener("keydown", function(e) {
	if ((e.ctrlKey && e.keyCode == 13) || (e.ctrlKey && e.keyCode == 81)) { // ctrl+enter or ctrl+q
		e.preventDefault();
		if (gameMode == "char") {  
			if (!gen && !charsListEnabled && !optionsShown) { genImage() };
		} else {
			if (!genMap && !optionsShown) { genMapGuess() };
		}
	} else if (e.keyCode == 13) { // enter
		e.preventDefault();
		if (gameMode == "map" && !checkMapBtn.disabled) {
			checkMap();
		}
	} else if (e.keyCode == 32) { // space
		if (gameMode == "map" && !genMap) {
			e.preventDefault();
			showMap();
		}
	} else if (e.ctrlKey && e.keyCode == 77) { // ctrl+m
		e.preventDefault();
		mode = gameMode == "char" ? "map" : "char";
		switchMode(mode);
	} else if (e.ctrlKey && e.keyCode == 76) { // ctrl+l
		e.preventDefault();
		if (gameMode == "char") {
			switchCharList();
		}
	} else if (e.ctrlKey && e.keyCode == 83) { // ctrl+s
		e.preventDefault();
		switchOptions();
	} else if (e.ctrlKey && e.keyCode == 68) { // ctrl+d
		e.preventDefault();
		switchLeftPanel();
	}
});
// input enter shortcut
uinput.onkeydown = function(event) {if (event.keyCode == 13) {check();}};

// buttons links
getElem("gmMap").addEventListener("click", (e) => {switchMode("map")});
getElem("gmChar").addEventListener("click", (e) => {switchMode("char")});
getElem("resetScores").addEventListener("click", (e) => {resetScores()});
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

//////////////////////
/// SET UP OPTIONS ///
//////////////////////

optionsLightMode.checked = getVar("lightMode");
optionsConfettis.checked = getVar("confettis");
optionsNewTheme.checked = getVar("newTheme");
optionsNewAuto.checked = getVar("newAuto");
optionsHideReportBtn.checked = !getVar("hideReportButton");
optionsSRMode.checked = getVar("isCharStarRail");
optionsDisableAutoFocus.checked = getVar("disableAutoFocus");
optionsBetterMap.checked = getVar("betterMap");

optionsLightMode.addEventListener("click", (e) => { setVar("lightMode", optionsLightMode.checked); themeSwitch(); })
optionsConfettis.addEventListener("click", (e) => { setVar("confettis", optionsConfettis.checked); });
optionsNewTheme.addEventListener("click", (e) => { setVar("newTheme", optionsNewTheme.checked); switchNewTheme(); })
optionsNewAuto.addEventListener("click", (e) => { setVar("newAuto", optionsNewAuto.checked); });
optionsHideReportBtn.addEventListener("click", (e) => { setVar("hideReportButton", !optionsHideReportBtn.checked); reportBtnSwitch(); })
optionsSRMode.addEventListener("click", (e) => { setVar("isCharStarRail", optionsSRMode.checked); genImage(); updateBg(); })
optionsDisableAutoFocus.addEventListener("click", (e) => { setVar("disableAutoFocus", optionsDisableAutoFocus.checked); disableAutoFocus = optionsDisableAutoFocus.checked; })
optionsBetterMap.addEventListener("click", (e) => { setVar("betterMap", optionsBetterMap.checked); updateMapLayer(optionsBetterMap.checked); })

disableAutoFocus = optionsDisableAutoFocus.checked;

//////////////////////
/// MAIN FUNCTIONS ///
//////////////////////

// fetch data
var sr=ys="";

function convertListNew(data, base) {
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
		pic.src = `${paths.db_base}/${base}/${e}.png`

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

var paths = {}
var setupDone = false
function setupData(_callback) {
	console.log("🗿 fetching data")
	const req = new Request("https://api.escartem.eu.org/gcrop/data?v=3");
	fetch(req).then(response => {
		if (response.status == 403) {
			throw new Error("api returned 403 status")
		}

		return response.json()
	}).then(json => {
		// update paths
		paths = json["data"]["paths"]

		// update clist
		var charList = json["ys"]["chars"];
		var SRList = json["sr"]["chars"]; 

		ys = convertListNew(charList, paths.cards_ys);
		sr = convertListNew(SRList, paths.cards_hsr);

		if (json["notification"] != "") {
			showNotification(json["notification"])
		}

		updateCharsList(true)
		_callback();
	}).catch(error => {
		var appError = document.getElementById("appError")
		appError.style.opacity = 1
		appError.innerHTML = appError.innerHTML.replaceAll("$0", error)
	});
}

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

function updateVar(name, val=1) {
	setVar(name, getVar(name)+val);
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

	if (getVar("isCharStarRail")) {
		req = new Request(`${paths.api_base}/${paths.char_hsr}`);
	} else {
		req = new Request(`${paths.api_base}/${paths.char_ys}`);
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
		if (getVar("confettis")) {
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

	if (getVar("newAuto") && win) {
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

var layer = null;
function updateMapLayer(enhanced) {
	var prefix = ["", ""]
	if (enhanced == true) {
		prefix = ["x", "-scale-2_00x"]
	}

	if (layer) { layer.remove() };

	layer = new L.TileLayer.CustomCoords(`${paths.db_base}/${paths.tile_ys}/{z}${prefix[0]}/{z}_{x}-{y}${prefix[1]}.jpg`, {
		bounds: [[-256, -256], [256, 256]],
		tms: true,
		infinite: false,
		minZoom: 1,
		maxZoom: 6,
		zoomOffset: 9,
		errorTileUrl: "assets/img/empty.png"
	}).addTo(map);
}

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
		if (getVar("confettis")) {
			getElem("c").dispatchEvent(triggerConfettis);
		};
	} else if (score.between(0, 80)) {
		updateVar("mapWin")
		message = "Perfectly on spot 🎉";
		if (getVar("confettis")) {
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

	// todo: add easy/hard mode
	var difficulty = "14x512"
	const req = new Request(`${paths.api_base}/${paths.map_ys}/${difficulty}`);

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

	// approximation of ratio between geographic coordinate system and in-game distance
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
	setupData(() => {
		console.log("📈 done !")
		switchMode(gameMode);
		updateMapLayer(optionsBetterMap.checked);
		document.getElementsByClassName("main")[0].style.opacity = 1;
	});
});
