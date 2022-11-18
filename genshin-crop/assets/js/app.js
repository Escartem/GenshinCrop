// Escartem

config = {"RCB": true, "DVT": false, "BSC": true, "SRC": true}
setupEMS(config)

var curr_char = null;
var buid = null;

regenBtn = document.getElementById("regenBtn");
regenBtn.addEventListener("click", function(event) {event.preventDefault(); genImage();})

reportBtn = document.getElementById("reportBtn");
reportBtn.addEventListener("click", function(event) {event.preventDefault(); alert("Please join the discord server and provide this : "+buid)})

checkInputBtn = document.getElementById("checkInputBtn");
checkInputBtn.addEventListener("click", function(event) {event.preventDefault(); check();})

document.getElementById("uinput").onkeydown = function(event) {
    if (event.keyCode == 13) {
        check();
    }
}

function genImage() {
    document.getElementById("error-text").style.visibility = "hidden";
    document.getElementById("load-spinner").style.visibility = "visible";
    document.getElementById("char").style.opacity = 0.5;
    
    // disable stuff
    regenBtn.disabled = true;
    regenBtn.style.filter = "brightness(0.7)";

    document.getElementById("uinput").disabled = true;
    document.getElementById("uinput").style.filter = "brightness(0.7)";
    
    checkInputBtn.disabled = true;
    checkInputBtn.style.filter = "brightness(0.7)";

    reportBtn.disabled = true;
    reportBtn.style.filter = "brightness(0.7)";

    var img = new Image();

    img.onload = function() {
        document.getElementById("char").src = img.src;
        document.getElementById("char").style.opacity = 1;
        document.getElementById("load-spinner").style.visibility = "hidden";
        
        // enable stuff
        regenBtn.disabled = false;
        regenBtn.style.filter = "brightness(1)";

        document.getElementById("uinput").disabled = false;
        document.getElementById("uinput").style.filter = "brightness(1)";
        
        checkInputBtn.disabled = false;
        checkInputBtn.style.filter = "brightness(1)";

        reportBtn.disabled = false;
        reportBtn.style.filter = "brightness(1)";

        document.getElementById("input-area").style.visibility = "visible";
        document.getElementById("result-area").style.visibility = "hidden";

        document.getElementById("uinput").focus();
    }

    const req = new Request("https://hm3g1egfy6.execute-api.eu-west-3.amazonaws.com/v1/p/gca");

    fetch(req).then((response) => {
        curr_char = response.headers.get("char");
        buid = response.headers.get("uid");
        response.blob().then((myBlob) => {
            const objectURL = URL.createObjectURL(myBlob);
            img.src = objectURL;
        });
    })
    .catch((error) => {
        document.getElementById("char").src = "./assets/img/load.png";
        document.getElementById("char").style.opacity = 1;
        document.getElementById("load-spinner").style.visibility = "hidden";
        document.getElementById("error-text").style.visibility = "visible";
        regenBtn.disabled = false;
        regenBtn.style.filter = "brightness(1)";
    });
}

function check() {
    var entry = document.getElementById("uinput").value;
    var text = document.getElementById("result-text");

    if (entry.toLowerCase() == curr_char.toLowerCase()) {
        text.innerHTML = "Correct 🎉";
        text.style.color = "#beffbe";
    } else {
        text.innerHTML = "Nope, it was "+curr_char+" 😔";
        text.style.color = "#ff9f9f";
    }

    document.getElementById("uinput").value = "";

    document.getElementById("input-area").style.visibility = "hidden";
    document.getElementById("result-area").style.visibility = "visible";
}

window.onload = genImage();