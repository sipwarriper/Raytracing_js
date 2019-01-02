
var incX;
var incY;
var P0;

// Inicialitzem el RayTracing
function inicialitzar(Scene) {

	//Camera
	Scene.Camera.position = [
		parseFloat(document.getElementById("CamX").value),
		parseFloat(document.getElementById("CamY").value),
		parseFloat(document.getElementById("CamZ").value)];
	Scene.Camera.up = [
		parseFloat(document.getElementById("UpX").value),
		parseFloat(document.getElementById("UpY").value),
		parseFloat(document.getElementById("UpZ").value)];
	Scene.Camera.centre = [
		parseFloat(document.getElementById("CentreX").value),
		parseFloat(document.getElementById("CentreY").value),
		parseFloat(document.getElementById("CentreZ").value)];
	
	Scene.Camera.fov = parseInt(document.getElementById("fov").value);
	

	var cam_info = "Camera Position: [".concat(String(Scene.Camera.position[0]), ", ", 
												String(Scene.Camera.position[1]), ", ", 
												String(Scene.Camera.position[2]), "]"); 
	document.getElementById("Cam_info").innerHTML=cam_info;
	//Camera Position: [3, 3.5, 5]

	// Parametres de les llums
	// Put it interactively
	Scene.Lights[0].position = [
		parseFloat(document.getElementById("lightPositionX1").value),
		parseFloat(document.getElementById("lightPositionY1").value),
		parseFloat(document.getElementById("lightPositionZ1").value)];
	Scene.Lights[0].diffuse = [
		parseFloat(document.getElementById("diffuseR1").value),
		parseFloat(document.getElementById("diffuseG1").value),
		parseFloat(document.getElementById("diffuseB1").value)];
	Scene.Lights[0].specular = [
		parseFloat(document.getElementById("specularR1").value),
		parseFloat(document.getElementById("specularG1").value),
		parseFloat(document.getElementById("specularB1").value)];


	Scene.Lights[1].position = [
		parseFloat(document.getElementById("lightPositionX2").value),
		parseFloat(document.getElementById("lightPositionY2").value),
		parseFloat(document.getElementById("lightPositionZ2").value)];
	Scene.Lights[1].diffuse = [
		parseFloat(document.getElementById("diffuseR2").value),
		parseFloat(document.getElementById("diffuseG2").value),
		parseFloat(document.getElementById("diffuseB2").value)];
	Scene.Lights[1].specular = [
		parseFloat(document.getElementById("specularR2").value),
		parseFloat(document.getElementById("specularG2").value),
		parseFloat(document.getElementById("specularB2").value)];

	
	Scene.AmbientLight = [
		parseFloat(document.getElementById("ambientR").value),
		parseFloat(document.getElementById("ambientG").value),
		parseFloat(document.getElementById("ambientB").value)];


	Screen.canvas = document.getElementById("glcanvas");
	if (Screen.canvas == null)	{
		alert("Invalid element: " + id);
		return;
	}
	Screen.context = Screen.canvas.getContext("2d");
	if(Screen.context == null){
		alert("Could not get context");
		return;
	}
	Screen.width = Screen.canvas.width;
	Screen.height = Screen.canvas.height;
	Screen.buffer = Screen.context.createImageData(Screen.width,Screen.height);

	// Calculem els eixos de la camera
	calcularEixos(Scene);

	// Calculem els increments i P0 (GLOBALS)
	incX = calcularIncrementX(Scene.Camera,Screen);
	incY = calcularIncrementY(Scene.Camera,Screen);
	P0 = calcularP0(incX,incY,Scene.Camera,Screen);

	// Executem RayTracing
	rayTracing(Scene, Screen);
	Screen.context.putImageData(Screen.buffer, 0, 0);
};


// Calcular increment de X
function calcularIncrementX(Cam,Scr) {
	var rati = (Scr.height/Scr.width);

	var theta = (Cam.fov * Math.PI / 180);
	var w = 2*Math.tan(theta/2); // Calculem w' = 2*tg(theta/2)
	var h = w*rati; // Calculem h' = w'*rati

	var aux = w/Scr.width; // w'/W
	var incX = vec3.scale(Cam.X,aux); // Calculem increment de X (X * 2*tg(theta/2)/W)

	return incX;
}


// Calcular increment de Y
function calcularIncrementY(Cam,Scr) {
	var rati = (Scr.height/Scr.width);

	var theta = (Cam.fov * Math.PI / 180);
	var w = 2*Math.tan(theta/2); // Calculem w' = 2*tg(theta/2)
	var h = w*rati; // Calculem h' = w'*rati

	var aux = rati*w/Scr.height; // rati*w'/H
	var incY = vec3.scale(Cam.Y,aux); // Calculem increment de Y (Y * 2*tg(theta/2)/W)

	return incY;
}


// Calcular P0
function calcularP0(incX,incY,Cam,Scr) {

	var P = vec3.subtract(Cam.position,Cam.Z); // Calculem P (O - Z)
	var aux = vec3.scale(incX,((Scr.width-1)/2)); // Increment de X * (W-1)/2
	var aux2 = vec3.scale(incY,((Scr.height-1)/2)); // Increment de Y * (H-1)/2
	var aux3 = vec3.subtract(P,aux); // P - Increment de X * (W-1)/2
	var P0 = vec3.add(aux3,aux2); // Calculem P0 (P - Increment de X * (W-1)/2 + Increment de Y * (H-1)/2)

	return P0;
}


// Calcular els eixos de la camera
function calcularEixos(Scene) {
	Scene.Camera.Z = vec3.normalize(vec3.subtract(Scene.Camera.position, Scene.Camera.centre)); // |O - C|
	Scene.Camera.X = vec3.normalize(vec3.cross(Scene.Camera.up, Scene.Camera.Z)); // |up x Z|
	Scene.Camera.Y = vec3.cross(Scene.Camera.Z, Scene.Camera.X); // Z x X

};


function plot(x,y,color){
	var index = (x+y*Screen.buffer.width)*4;
	Screen.buffer.data[index+0] = color[0] * 255;
	Screen.buffer.data[index+1] = color[1] * 255;
	Screen.buffer.data[index+2] = color[2] * 255;
	Screen.buffer.data[index+3] = 255;
	return index;
}


// Pintar cada pixel
function rayTracing(Scene, Screen) {
	for(var x = 0; x < Screen.width; x++){
		for (y = 0; y < Screen.height; y++){
			var rDirection = computeRay(incX,incY,P0,Scene.Camera,x,y);
			//var color = [0.3,0.4,1];
			// TO BE IMPLEMENTED
			// var t = intersectPrimitive(Scene, Scene.Shapes[2], rDirection);
			// if (isNaN(t)) console.log("t = ".concat(String(t)));
			var color = intersectarScene(Scene, rDirection);
			plot(x,y,color);
		}
	}
};


// Computar el raig
function computeRay(incX,incY,P0,Cam,x,y){

	// Calculem la direccio per a cada pixel
	var aux = vec3.scale(incX,x); // Increment de X * x
	var aux2 = vec3.scale(incY,y); // Increment de Y * y
	var aux3 = vec3.add(P0,aux); // P0 + Increment de X * x
	var aux4 = vec3.subtract(aux3,aux2); // P0 + Increment de X * x - Increment de Y * y
	var ray = vec3.subtract(aux4,Cam.position); // Obtenim raig (P0 + Increment de X * x - Increment de Y * y - O)
	var rayNorm = vec3.normalize(ray); // Normalitzem el raig

	return rayNorm;
}


function intersectarScene(Scene, rDirection){
	let hit = computeIntersection(Scene, Scene.Camera.position, rDirection);
	if (interaction(hit)) return computeIllumination(Scene, Scene.Camera.position, hit);
	return Scene.Fons;
}

function computeIntersection(Scene, o, rDirection){
	var h = null;
	for (let i = 0; i<Scene.Shapes.length; i++){
		var h2 = intersectPrimitive(Scene, o, Scene.Shapes[i], rDirection);
		if ((h==null || h2.t<h.t) && h2.t>0 && !isNaN(h2.t)){
			h = h2;
		}
	}
	return h;	
}


function computeIllumination(Scene, o, hit){
	// I = Ambient * constantAmbient + sumatori per cada llum (colorllum_i * difusió * cos(angle llum, normal) + colorllum_i * specular * cos^n(un altre angle q no se))
	// els angles es poden simplifcar
	I_r = Scene.AmbientLight[0];
	I_g = Scene.AmbientLight[1];
	I_b = Scene.AmbientLight[2];
	for (let i = 0; i< Scene.Lights.length; i++){
		let L = vec3.normalize(vec3.subtract(Scene.Lights[i].position, hit.p));
		let V = vec3.normalize(vec3.subtract(o, hit.p));
		let r = vec3.add(L,V);
		
		
		let Vi = 1; //No intersecta amb res
		let hitplus = vec3.add(hit.p, vec3.fromValues(0.001,0.001,0.001));
		let hit2 = computeIntersection(Scene, hitplus, L); //raig des del hit fins a la llum, mirem interseccions
		//var rDirection = computeRay(incX,incY,P0,Scene.Camera,x,y);
		if(interaction(hit2) && hit2.t < vec3.distance(hit.p, Scene.Lights[i].position)){ //si choca amb algo hi ha ombra
			//let distancehit2 = vec3.distance(Scene.Lights[i].position, hit2.p);
			// Vi = (hit2.t < vec3.distance(hit.p, Scene.Lights[i].position) ? 0 : 1);	
			Vi = 0;
		}
		
		//Diffuse Reflection
		I_r += Vi*Scene.Lights[i].diffuse[0]*Math.max(vec3.dot(L, hit.n)/(vec3.length(L)*vec3.length(hit.n)), 0);
		I_g += Vi*Scene.Lights[i].diffuse[1]*Math.max(vec3.dot(L, hit.n)/(vec3.length(L)*vec3.length(hit.n)), 0);
		I_b += Vi*Scene.Lights[i].diffuse[2]*Math.max(vec3.dot(L, hit.n)/(vec3.length(L)*vec3.length(hit.n)), 0);
		//specular Ilumination
		I_r += Vi*Scene.Lights[i].specular[0]*Math.pow(Math.max(vec3.dot(r, hit.n)/(vec3.length(r)*vec3.length(hit.n)), 0),hit.Shape.specular);
		I_g += Vi*Scene.Lights[i].specular[1]*Math.pow(Math.max(vec3.dot(r, hit.n)/(vec3.length(r)*vec3.length(hit.n)), 0),hit.Shape.specular);
		I_b += Vi*Scene.Lights[i].specular[2]*Math.pow(Math.max(vec3.dot(r, hit.n)/(vec3.length(r)*vec3.length(hit.n)), 0),hit.Shape.specular);

	}
	I_r *= hit.Shape.color[0]
	I_g *= hit.Shape.color[1]
	I_b *= hit.Shape.color[2]
	return [I_r, I_g, I_b];
}

function interaction(hit){
	if (hit == null) return false;
	if (isNaN(hit.t) || hit.t<0) return false;
	return true;
}


// interseccions de primitives

function intersectPrimitive(Scene, o, primitive, rDirection){
	let t;
	switch(primitive.tipus) {
		case "pla":
			t = intersectPlane(Scene, o, primitive, rDirection);
			return  new Hit(primitive, o, t, rDirection);
		case "esfera":
			t = intersectSphere(Scene, o, primitive, rDirection);
			return new Hit(primitive, o, t, rDirection);
		case "triangle":
			//let ts = intersectTriangle(Scene, primitive, rDirection);
			t = intersectTriangle(Scene, o, primitive, rDirection);
			return new Hit(primitive, o, t, rDirection);
		default:
		  	// code block
	}
}


function intersectPlane(Scene, o, primitive, rDirection){
	return intersectPlaneWithData(Scene, o, primitive.normal, primitive.punt, rDirection);
}


function intersectPlaneWithData(Scene, o, normal, punt, rDirection){
	let A = normal[0];
	let B = normal[1];
	let C = normal[2];
	let D = 0-(A*punt[0] + B*punt[1] + C*punt[2]);
	let t = (-D-vec3.dot(normal,o))/vec3.dot(normal,rDirection);
	return t;
}

function intersectSphere(Scene,o, primitive, rDirection){
	let oMinusC = vec3.subtract(o, primitive.centre);
	let b = vec3.dot(vec3.scale(oMinusC, 2), rDirection);
	let c = vec3.dot(oMinusC, oMinusC) - (primitive.radi*primitive.radi);
	let d = b*b - 4*c;
	let t0 = (-b - Math.sqrt(d))/2;
	//let t1 = (-b + Math.sqrt(d))/2;
	//console.log("------- NO INTERSECCIO");
	//=====si no hi ha intersecció t0 és igual a NaN!! 
	//CAL REPASSAR
	//if (t0<0) return t1;
	return t0;
}

function intersectTriangle(Scene, o, primitive, rDirection){
	//aixó es pot representar d'altres formes, nosaltres usarem punts. 
	if(primitive.u == null){
		primitive.u = vec3.subtract(primitive.v1, primitive.v0);
		primitive.v = vec3.subtract(primitive.v2, primitive.v0);
		primitive.UV = vec3.dot(primitive.u,primitive.v);
		primitive.UU = vec3.dot(primitive.u,primitive.u);
		primitive.VV = vec3.dot(primitive.v,primitive.v);
		primitive.D = primitive.UV*primitive.UV - primitive.UU*primitive.VV;
	}
	//calcul interseccio pla

	let u = primitive.u
	let v = primitive.v
	let UV = primitive.UV
	let UU = primitive.UU
	let VV = primitive.VV
	let D = primitive.D

	let normal = vec3.normalize(vec3.cross(u,v));

	let tPla = intersectPlaneWithData(Scene, o, normal, primitive.v0, rDirection);
	let P = vec3.scaleAndAdd(o, rDirection, tPla);

	let I = vec3.subtract(P, primitive.v0);


	let t = (UV*vec3.dot(I,v) - VV*vec3.dot(I,u))/D;
	let s = (UV*vec3.dot(I,u) - UU*vec3.dot(I,v))/D;

	// hi ha intersecció if(0<=s+t && s+t<= 1)
	// si no hi ha intersecció tornem NaN
	// if(!((s+t)>=0 && (s+t)<=1 && t>0 && s>0)) t = NaN;
	if(!((s+t)>=0 && (s+t)<=1 && t>0 && s>0)) tPla = NaN;
	return tPla;
}