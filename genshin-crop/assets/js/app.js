// Escartem

config = {"RCB": true, "DVT": false, "BSC": true, "SRC": true}
setupEMS(config)

var curr_char = null;
var buid = null;
var url_object = null;
var gen = false;

regenBtn = document.getElementById("regenBtn");
regenBtn.addEventListener("click", function(event) {event.preventDefault(); genImage();})

reportBtn = document.getElementById("reportBtn");
reportBtn.addEventListener("click", function(event) {event.preventDefault(); showPopup("Report image", "Please join the <a href='https://discord.gg/fzRdtVh', target='_blank'>discord</a> and provide this : <span style='color: white; background: #2a2a2a;'>"+buid+"</span>", 260, 200);})

checkInputBtn = document.getElementById("checkInputBtn");
checkInputBtn.addEventListener("click", function(event) {event.preventDefault(); check();})

document.getElementById("uinput").onkeydown = function(event) {
    if (event.keyCode == 13) {
        check();
    }
}

function genImage() {
    gen = true;
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

        document.getElementById("input-area").style.opacity = 1;
        document.getElementById("result-area").style.opacity = 0;

        document.getElementById("uinput").focus();

        // for some reason this does not seem to work
        URL.revokeObjectURL(url_object);

        gen = false;
    }

    const req = new Request("https://hm3g1egfy6.execute-api.eu-west-3.amazonaws.com/v1/p/gca");

    fetch(req).then((response) => {
        curr_char = response.headers.get("char");
        buid = response.headers.get("uid");
        response.blob().then((blob) => {
            const objectURL = URL.createObjectURL(blob);
            url_object = objectURL
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

    document.getElementById("input-area").style.opacity = 0;
    document.getElementById("result-area").style.opacity = 1;
}

document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.keyCode == 81) {
        e.preventDefault();
        if (gen == false) {
            genImage();
        }
    }
})

function showPopup(title, text, width="150", height="90") {
    var popupDialog = document.getElementById("popupDialog");

    if (! popupDialog.showModal) {
        dialogPolyfill.registerDialog(popupDialog);
    }

    document.getElementById("popupTitle").innerHTML = title;
    document.getElementById("popupContent").innerHTML = text;

    popupDialog.style.height = height + "px";
    popupDialog.style.width = width + "px";

    popupDialog.showModal();

    popupDialog.querySelector('.close').addEventListener('click', function() {
        popupDialog.close();
    });
}

chars = "Aether <br/> Albedo <br/> Aloy <br/> Amber <br/> Itto <br/> Ayaka <br/> Ayato <br/> Barbara <br/> Beidou <br/> Bennett <br/> Chongyun <br/> Collei <br/> Diluc <br/> Diona <br/> Dori <br/> Eula <br/> Fischl <br/> Ganyu <br/> Gorou <br/> Heizou <br/> Hu Tao <br/> Jean <br/> Kaeya <br/> Kazuha <br/> Keqing <br/> Klee <br/> Kokomi <br/> Kuki Shinobu <br/> Lisa <br/> Mona <br/> Ningguang <br/> Noelle <br/> Qiqi <br/> Raiden <br/> Razor <br/> Rosaria <br/> Kujou Sara <br/> Sayu <br/> Shenhe <br/> Sucrose <br/> Tartaglia <br/> Thoma <br/> Tighnari <br/> Lumine <br/> Venti <br/> Xiangling <br/> Xiao <br/> Xingqiu <br/> Xinyan <br/> Yae Miko <br/> Yanfei <br/> Yelan <br/> Yoimiya <br/> Yun Jin <br/> Zhongli <br/><br/><br/><br/>"
showCharsBtn = document.getElementById("showCharsBtn");
showCharsBtn.addEventListener("click", function(event) {event.preventDefault(); showPopup("List of characters names", chars, 250, 500);})

window.onload = genImage();

// TODO
// * blob delete ?
// * confetis
// * clean assets
// * phone support