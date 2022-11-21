// Escartem

setupEMS({"RCB": true, "DVT": false, "BSC": true, "SRC": true});

// version
VERSION = "1.0.1"
console.log("v"+VERSION);

// vars
var curr_char = null;
var buid = null;
var url_object = null;
var gen = false;
var full_url = null;
var chars = "Aether <br/> Albedo <br/> Aloy <br/> Amber <br/> Itto <br/> Ayaka <br/> Ayato <br/> Barbara <br/> Beidou <br/> Bennett <br/> Chongyun <br/> Collei <br/> Diluc <br/> Diona <br/> Dori <br/> Eula <br/> Fischl <br/> Ganyu <br/> Gorou <br/> Heizou <br/> Hu Tao <br/> Jean <br/> Kaeya <br/> Kazuha <br/> Keqing <br/> Klee <br/> Kokomi <br/> Kuki Shinobu <br/> Lisa <br/> Mona <br/> Ningguang <br/> Noelle <br/> Qiqi <br/> Raiden <br/> Razor <br/> Rosaria <br/> Kujou Sara <br/> Sayu <br/> Shenhe <br/> Sucrose <br/> Tartaglia <br/> Thoma <br/> Tighnari <br/> Lumine <br/> Venti <br/> Xiangling <br/> Xiao <br/> Xingqiu <br/> Xinyan <br/> Yae Miko <br/> Yanfei <br/> Yelan <br/> Yoimiya <br/> Yun Jin <br/> Zhongli <br/><br/><br/><br/>"
const triggerConfettis = new Event("confetti");
let confetti = new Confetti('checkInputBtn');

confetti.setCount(150);
confetti.setSize(1);
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
errorText = getElem("error-text");
loadSpinner = getElem("load-spinner");

document.addEventListener("keydown", function(e) {if (e.ctrlKey && e.keyCode == 81) {e.preventDefault(); if (gen==false) {genImage();}}});
uinput.onkeydown = function(event) {if (event.keyCode == 13) {check();}};
regenBtn.addEventListener("click", function(event) {event.preventDefault(); genImage();});
reportBtn.addEventListener("click", function(event) {event.preventDefault(); showPopup("Report image", "Please join the <a href='https://discord.gg/fzRdtVh', target='_blank'>discord</a> and provide this : <span style='color: white; background: #2a2a2a;'>"+buid+"</span>", 260, 200);});
checkInputBtn.addEventListener("click", function(event) {event.preventDefault(); check();})
showCharsBtn.addEventListener("click", function(event) {event.preventDefault(); showPopup("List of characters names", chars, 250, 500);});

// change buttons state
function buttonState(tf, b) {
    regenBtn.disabled = tf;
    regenBtn.style.filter = "brightness("+b+")";

    uinput.disabled = tf;
    uinput.style.filter = "brightness("+b+")";
    
    checkInputBtn.disabled = tf;
    checkInputBtn.style.filter = "brightness("+b+")";

    reportBtn.disabled = tf;
    reportBtn.style.filter = "brightness("+b+")";
}

function genImage() {
    gen = true;
    errorText.style.visibility = "hidden";
    loadSpinner.style.visibility = "visible";
    char.style.opacity = 0.5;

    buttonState(true, 0.7);

    var img = new Image();

    img.onload = function() {
        char.src = img.src;
        char.style.opacity = 1;
        loadSpinner.style.visibility = "hidden";
        
        buttonState(false, 1);

        inputArea.style.opacity = 1;
        resultArea.style.opacity = 0;

        uinput.focus();

        // for some reason this does not seem to work
        URL.revokeObjectURL(url_object);

        gen = false;
    }

    const req = new Request("https://hm3g1egfy6.execute-api.eu-west-3.amazonaws.com/v1/p/gca");

    fetch(req).then((response) => {
        curr_char = response.headers.get("char");
        buid = response.headers.get("uid");
        full_url = response.headers.get("full");
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
    });
}

function check() {
    var entry = uinput.value;
    var text = getElem("result-text");

    if (entry.toLowerCase() == curr_char.toLowerCase()) {
        checkInputBtn.dispatchEvent(triggerConfettis)
        text.innerHTML = "Correct 🎉";
        text.style.color = "#beffbe";
    } else {
        text.innerHTML = "Nope, it was "+curr_char+" 😔";
        text.style.color = "#ff9f9f";
    }

    uinput.value = "";

    inputArea.style.opacity = 0;
    resultArea.style.opacity = 1;

    char.src = full_url;
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

// TODO
// * blob files does not seems to be revoked correctly
// * phone support sucks
// * support for multiples languages