var map = L.map('map', {
	crs: L.CRS.Simple
}).setView([0, 0], 0);

if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

// function getTilePos(lat, lon, zoom) {
//     let tilex = parseInt(Math.floor((lon + 180) / 360 * (1 << zoom)));
//     let tiley = parseInt(Math.floor((1 - Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) / 2 * (1 << zoom)));
//     return {"zoom":zoom, "x":tilex, "y":tiley}
// }

function getXYcoord(lat,lng,size) {
    x = Math.floor(lng/size)
    y = Math.floor(lat/size)
    return [x,y]
}

function getLLcoord(x,y,size) {
    lat = y*size+(size/2)
    lng = x*size+(size/2)
    return [lat,lng]
}

function getScorePos(score) {
    if (score >= 0 && score <= 20) {
        scorePos = 0
    } else if (score >= 20 && score <= 80) {
        scorePos = 1
    } else if (score >= 80 && score <= 130) {
        scorePos = 2
    } else if (score >= 130 && score <= 200) {
        scorePos = 3
    } else if (score >= 200 && score <= 270) {
        scorePos = 4
    } else if (score >= 270) {
        scorePos = 5
    }

    return scorePos
}

// map.on('click', function(e) {
//     console.log(e.latlng.lat, e.latlng.lng, map.getZoom());
//     console.log(getTilePos(e.latlng.lat, e.latlng.lng, map.getZoom()))
// });

url_object = null
checked = false

var marker;
var imgMarker;
map.on('click', function(ev){
    // ev.preventDefault()
    // console.log("oui")
    if (checked == false) {
        if (checkBtn.disabled = true) {
            checkBtn.disabled = false
        }

        if (!marker) {
            marker = L.marker(ev.latlng).addTo(map);
        } else {
            marker.setLatLng(ev.latlng);
        }

        t=marker.getLatLng()
        s=map.getZoom()
        os=2**(-s+8)
        var [x,y]=getXYcoord(t.lat,t.lng,os)
        document.getElementById("markerPos").innerHTML = "lat:"+t.lat+" lng:"+t.lng+" size:"+(s+9)+" offsetSize:"+os+" x:"+x+" y:"+y
    }
})

L.TileLayer.CustomCoords = L.TileLayer.extend({
    getTileUrl: function(tilecoords) {
        tilecoords.x = tilecoords.x;
        tilecoords.y = -tilecoords.y-1;
        tilecoords.z = tilecoords.z;
        return L.TileLayer.prototype.getTileUrl.call(this, tilecoords);
    }
});

var layer = new L.TileLayer.CustomCoords('https://game-cdn.appsample.com/gim/map-teyvat/v34-rc1/{z}/tile-{x}_{y}.jpg', {
// var layer = new L.TileLayer.CustomCoords("https://s3.tebi.io/bluedb/genshin/map/{z}c/{z}_{x}-{y}.png", {
    bounds: [[-256, -256], [256, 256]],
    tms: true,
    infinite: false,
	minZoom: 1,
    maxZoom: 6,
    zoomOffset: 9,
    errorTileUrl: "https://b.thumbs.redditmedia.com/H5nhWWeE6BI_2EOBPwPXaLIWBsFN0pV5YExGorp16zY.png",
}).addTo(map);

var rlat = 0
var rlng = 0

reqPngBtn = document.getElementById("reqPng")

reqPngBtn.addEventListener("click", function(e) {
    e.preventDefault()
    reqPng()
})

function reqPng() {

    reqPngBtn.disabled = true
    checkBtn.disabled = true

    if (marker) {marker.remove(); marker=null;}

    if (imgMarker) {imgMarker.remove()}

    if (polyline) {polyline.remove()}

    document.getElementById("map").style.filter = "brightness(0.5)"
    document.getElementById("map").style.pointerEvents = "none"

    var img = new Image()

    img.onload = function() {
        document.getElementById("image").src = img.src

        URL.revokeObjectURL(url_object)

        reqPngBtn.disabled = false
        checked = false

        document.getElementById("map").style.filter = "brightness(1)"
        document.getElementById("map").style.pointerEvents = "all"

        map.setView([0, 0], 0)
    }

    const req = new Request("https://api.escartem.eu.org/p/gca/m/15x512")

    fetch(req).then((response) => {
        rx = response.headers.get("rx")
        ry = response.headers.get("ry")
        size = response.headers.get("size")
        os=2**(-(size-9)+8)
        llc = getLLcoord(rx,ry,os)
        rlat = llc[0]
        rlng = llc[1]

        document.getElementById("imgPos").innerHTML = "rx:"+rx+" ry:"+ry+" size:"+size+" offsetSize:"+os+" lat:"+lat+" lng:"+lng

        response.blob().then((blob) => {
            const objectURL = URL.createObjectURL(blob)
            url_object = objectURL
            img.src = objectURL
        })
    })
    .catch((error) => {
        console.error(error)
        reqPngBtn.disabled = false
    })
}

var checkBtn = document.getElementById("check")
var polyline = null

checkBtn.addEventListener("click", function(e) {
    e.preventDefault()

    checked = true

    checkBtn.disabled = true

    imgMarker = L.marker({"lat": lat, "lng": lng}).addTo(map);

    var dots = Array()
    dots.push(marker.getLatLng())
    dots.push(imgMarker.getLatLng())

    // console.log(dots)

    distance = dots[0].distanceTo(dots[1])
    score = Math.round(distance/10000)

    scorePos = getScorePos(score)

    polyline = L.polyline(dots, {color: "red"}).addTo(map)
    map.fitBounds(polyline.getBounds())

    document.getElementById("score").innerHTML = "distance:"+distance+" score:"+score+" scorePos:"+scorePos
})

// marker.on('click', function(ev){
//   var latlng = map.mouseEventToLatLng(ev.originalEvent);
//   console.log(latlng.lat + ', ' + latlng.lng);
// });

// L.tileLayer('https://game-cdn.appsample.com/gim/map-teyvat/v34-rc1/{z}/tile-{x}_{y}.jpg', {
//     bounds: [[-2560, -2560], [2560, 2560]],
//     tms: true,
//     infinite: false,
// 	minZoom: 1,
//     maxZoom: 6,
//     zoomOffset: 9,
//     errorTileUrl: "https://b.thumbs.redditmedia.com/H5nhWWeE6BI_2EOBPwPXaLIWBsFN0pV5YExGorp16zY.png",
// }).addTo(map);

reqPng()
