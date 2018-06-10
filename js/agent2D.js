var agentArray = [];
var agentScale = 5;
var totalAgent = 40000;
var limitWorld = { x: 1500, y: 1500 };
var agentCoordinateArray = null;
var coordinateArrayCorrespondance = null;

var spiral_diametre = 100;
var a = 1;
var b = 2;
var zfactor = 10000;



// Dat GUI
var gui = new dat.GUI();

gui.add(this, 'spiral_diametre').onChange(function(value) {
    //spiral_diametre = value;
    restart();
});

gui.add(this, 'zfactor').onChange(function(value) {
   restart();
});

gui.add(this, 'a').onChange(function(value) {
   restart();
});

gui.add(this, 'b').onChange(function(value) {
   restart();
});


// Rainbow
var rainbow = new Rainbow();
// 50 for corner seed
rainbow.setNumberRange(1, totalAgent / 100);
rainbow.setSpectrum('red', 'yellow', 'blue', 'white');
// Particle
//var geometry = new THREE.SphereGeometry(agentScale, agentScale, agentScale);
var geometry = new THREE.Geometry();
geometry.colors = []
var mesh = null;
THREE.ImageUtils.crossOrigin = '';
var sprite = THREE.ImageUtils.loadTexture("http://i.imgur.com/lWBb0k4.png");
//var sprite = new THREE.TextureLoader().load("./disc.png");

start();

function restart() {
     
 scene.remove(mesh);
    start();
}

function clean(){  
}

function start() {
    agentArray = [];
    
    geometry = new THREE.Geometry();
    geometry.colors = []

    for (var i = 0; i < totalAgent; i++) {
        agentArray.push(createAgent());
    }
    var material = new THREE.PointsMaterial({ size: agentScale * 4, vertexColors: THREE.VertexColors, map: sprite, transparent: true });
    mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
}


function createAgent() {


    t = (Math.random() ) * (limitWorld.x / spiral_diametre);

    var vertex = new THREE.Vector3();
    vertex.x = (Math.random() - 0.5) * limitWorld.x;
    vertex.y = (Math.random() - 0.5) * limitWorld.y;

    var rand = (t + a);
    var randCos = (Math.random() - 0.5) * 5;
    randCos = Math.cos(randCos)*100;
    var sinusMinMax = 500;

    var x = Math.sin(rand)*b*t;
    var y = Math.cos(rand)*b*t;



    vertex.x = x*sinusMinMax;
     vertex.y = y*sinusMinMax;
    vertex.z = (Math.random() - 0.5) * zfactor;

    geometry.vertices.push(vertex);
    // Color
    geometry.colors.push(new THREE.Color(0xFFFFFF));



    
}


//For compute the distance between 2 points (Vector3 : x,y,z) in 3D space
function distanceAB(v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function isCollided(obj1, obj2) {
    if (Math.abs(obj1.x - obj2.x) < agentScale && Math.abs(obj1.y - obj2.y) < agentScale) {
        return true;
    } else {
        return false;
    }
}



function noise(x, y) {
    var u = x / limitWorld.x;
    var v = y / limitWorld.y;

    return Math.sin(20 * u) * Math.sin(28 * v);
}

function noise2(x, y) {
    var uu = x / limitWorld.x;
    var vv = y / limitWorld.y;
    var t = clock.elapsedTime;
    var a = Math.cos(t) * 0.5;
    var b = Math.sin(t * 2.33) * 0.5;
    var p = new THREE.Vector3(uu, vv, a);
    var v = new THREE.Vector3();
    for (var i = 0; i < 50; i++) {
        var dp = p.dot(p);
        p.x = Math.abs(p.x) / dp;
        p.y = Math.abs(p.y) / dp;
        p.z = Math.abs(p.z) / dp;
        p.sub(new THREE.Vector3(1.0, 1.0, 0.5));
        p.x = Math.abs(p.x);
        p.y = Math.abs(p.y);
        p.z = Math.abs(p.z);
        v = p;
        v.multiply(new THREE.Vector3(1.3, 0.99, 0.7));
        p.x = v.x;
        p.z = v.y;
        p.y = v.z;
    }

    return new THREE.Vector2(p.x - 0.5, p.y - 0.5);
}

function noise3(x, y) {
    var uu = (x / limitWorld.x) * 2;
    var vv = (y / limitWorld.y) * 2;
    var d = uu * uu + vv * vv;
    var amp = 1 / (1 + Math.sqrt(d));

    return new THREE.Vector2(vv * amp, -uu * amp);


}
