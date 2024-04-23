//// config manager ////

// internal
function _parse(data) { return JSON.parse(data) }; // atob inner
function _dumps(data) { return JSON.stringify(data) }; // btoa outer

function _get(key="config") {
	t = window.localStorage.getItem(key);
	o = key == "config" ? _parse(t) : t;
	return o;
}

function _set(data, key="config") {
	t = key == "config" ? _dumps(data) : data;
	window.localStorage.setItem(key, t);
}

function _del(key) {
	window.localStorage.removeItem(key);
}

// externals
var deleteVar = _del; // sync

function getVar(name) {
	return _get()[name];
}

function setVar(name, value) {
	t = _get();
	t[name] = value;
	_set(t);
}

// init
const configTemplate = {
	"betterMap": false,
	"newTheme": true,
	"confettis": true,
	"disableAutoFocus": false,
	"newAuto": false,
	"lightMode": false,
	"isCharStarRail": false,
	"leftPanelEnabled": true,
	"hideReportButton": true,
	"gameMode": "char",
	// stats 
	"mapCount": 0,
	"charCount": 0,
	"charWin": 0,
	"mapWin": 0,
}

function initConfig() {
	console.log("⚙ loading config");

	// check if config exists
	if (_get() == null) { _set(configTemplate) };

	// retrieve config
	var config = _get();

	// check if config is missing new keys
	if (Object.entries(configTemplate).length > Object.entries(config).length) {
		for (key in configTemplate) {
			if (key in config == false) {
				setVar(key, configTemplate[key]);
			}
		}
	}

	// migrate old scores and clean up old vars
	if (_get("gamemode") != null) {
		setVar("charCount", parseInt(_get("charCount")));
		setVar("charWin", parseInt(_get("charWin")));
		setVar("mapCount", parseInt(_get("mapCount")));
		setVar("mapWin", parseInt(_get("mapWin")));

		oldKeys = ["betterMap", "disableNewTheme", "noConfettis", "disableAutoFocus", "newAuto", "lightMode", "srMode", "leftPanelVisible", "hideReportBtn", "gamemode", "mapCount", "mapWin", "charCount", "charWin"];

		for (index in oldKeys) {
			deleteVar(oldKeys[index]);
		}
	}
}
