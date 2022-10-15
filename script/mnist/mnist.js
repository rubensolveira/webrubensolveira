const NUMDATA = 20000;
const PORCENTAJE_TEST = 0.2;
const IMG_ANCHO = 28;
const IMG_ALTO = 28;
const IMG_CANALES = 1;
const NUMOUTPUTS = 10;

const EPOCAS = 20;
const BATCHSIZE = 1000;

const URLMODELO = 'https://rubensolveira.com/script/mnist/redtf.json';

//El lienzo(dnode se van a trazar los numeros) va a ocupar 1/4 de la pantalla
//Con el INCREMENTO_PIXEL se sabe cuantos pixeles hay respecto a la imagen 28x28
let INCREMENTO_PIXEL;

//El lienzo es un cuadrado, asique da igual el ancho o el alto
//Esto es lo que mide su lado
let SIZE_LIENZO;

//Dependiendo de si el lienzo es mas pequeño o mas grande, el trazo
//de lo que se pinte tiene 'ANCHO_TRAZO' pixeles (respecto a 28x28)
const ANCHO_TRAZO = 3;
let PIXELES_ANCHO_TRAZO; //Se tiene que calcular


//Para introducirlos en TF
let trainx = [];
let trainy = [];
let testx = [];
let testy = [];

let redtf;

let botonPredecir;

function setup() {
	//Quiero que el canvas sea un cuadrado
	//Dependiendo de si es monitor o movil
	let _w = window.innerWidth - 50;
	let _h = window.innerHeight - 50;

	//El lienzo va a ser un cuadrado de la mitad del canvas
	if (_w > _h) {
		createCanvas(_h, _h);
		SIZE_LIENZO = _h / 2;
	} else {
		createCanvas(_w, _w);
		SIZE_LIENZO = _w / 2;
	}

	PIXELES_ANCHO_TRAZO = (SIZE_LIENZO / IMG_ANCHO) * ANCHO_TRAZO;

	cargarModelo();

	//YA ESTA ENTRENADA!! Se carga de un fichero
	//darFormaDatos();
	//crearRed();
	//entrenar(trainx, trainy, testx, testy);

	botonPredecir = createButton('Predecir imagen actual');
	botonPredecir.position(10, height / 2 + 10);
	botonPredecir.mousePressed(predecirImagen);

	background(240);

	pintarLienzo();
}

function guardarModelo() {
	redtf.save('downloads://redtf');
}

async function cargarModelo() {
	redtf = await tf.loadLayersModel(URLMODELO);
}

function draw() {
	let img = get();
	background(img);

	if (mouseIsPressed &&
		mouseX > SIZE_LIENZO * 0.15 &&
		mouseX < SIZE_LIENZO * 0.85 &&
		mouseY > SIZE_LIENZO * 0.15 &&
		mouseY < SIZE_LIENZO * 0.85) {

		strokeWeight(PIXELES_ANCHO_TRAZO);
		stroke(255);
		fill(255);
		point(mouseX, mouseY);
	}


	if (keyIsDown(65)) { //'a'
		let arrimg = getImagenLienzo();
		let indexarr = 0;
		for (let f = 0; f < 28; f++) {
			for (let c = 0; c < 28; c++) {
				let valor = arrimg[indexarr];
				fill(0, valor, 0);
				strokeWeight(1);
				ellipse(c * SIZE_LIENZO / 28 + SIZE_LIENZO + 20, f * SIZE_LIENZO / 28, 12, 12);
				indexarr++;
			}
		}
	}
}


function pintarLienzo() {
	strokeWeight(2);
	stroke(0);
	fill(0);
	rect(0, 0, SIZE_LIENZO, SIZE_LIENZO);

	stroke(0, 255, 255);
	rect(SIZE_LIENZO * 0.15, SIZE_LIENZO * 0.15, SIZE_LIENZO * 0.7, SIZE_LIENZO * 0.7);
	fill(0, 255, 255);
	textSize(13);
	strokeWeight(1);
	text("Intenta que el número sea del tamaño del recuadro", SIZE_LIENZO * 0.15, SIZE_LIENZO * 0.85 + 20)
}

function crearRed() {
	redtf = tf.sequential();

	redtf.add(tf.layers.conv2d({
		inputShape: [IMG_ANCHO, IMG_ALTO, IMG_CANALES],
		activation: 'relu',
		kernelSize: 3,
		filters: 8,
		strides: 1,
		kernelInitializer: 'varianceScaling'
	}));

	redtf.add(tf.layers.maxPooling2d({
		poolSize: [2, 2],
		strides: [2, 2]
	}));

	redtf.add(tf.layers.conv2d({
		activation: 'relu',
		kernelSize: 5,
		filters: 16,
		strides: 1,
		kernelInitializer: 'varianceScaling'
	}));

	redtf.add(tf.layers.maxPooling2d({
		poolSize: [2, 2],
		strides: [2, 2]
	}));


	redtf.add(tf.layers.flatten());

	redtf.add(tf.layers.dense({
		units: 128,
		activation: 'relu',
	}));

	redtf.add(tf.layers.dense({
		units: 64,
		activation: 'relu',
	}));

	redtf.add(tf.layers.dense({
		units: NUMOUTPUTS,
		activation: 'softmax',
		kernelInitializer: 'varianceScaling'
	}));

	const learningRate = 0.05;
	const optimizer = tf.train.adam();
	// const optimizer = tf.train.sgd(learningRate);

	redtf.compile({
		optimizer: optimizer,
		loss: 'categoricalCrossentropy',
		metrics: ['accuracy']
	});

	return redtf;
}



async function entrenar(trax, tray, tesx, tesy) {
	const metricas = await redtf.fit(trax, tray, {
		epochs: EPOCAS,
		shuffle: true,
		batchSize: BATCHSIZE,
		validationData: [tesx, tesy],
		callbacks: {
			onEpochEnd: async (epoch, logs) => {
				let totalTraining = trax.shape[0];
				let aciertosTraining = 0;

				let outputPredicion = redtf.predict(trax).argMax(-1).dataSync();
				let outputReal = tray.argMax(-1).dataSync();
				for (let i = 0; i < trax.shape[0]; i++) {
					if (outputPredicion[i] == outputReal[i]) {
						aciertosTraining++;
					}
				}

				let porcentajeTraining = aciertosTraining / totalTraining;

				let totalTest = tesx.shape[0];
				let aciertosTest = 0;
				outputPredicion = redtf.predict(tesx).argMax(-1).dataSync();
				outputReal = tesy.argMax(-1).dataSync();
				for (let i = 0; i < tesx.shape[0]; i++) {
					if (outputPredicion[i] == outputReal[i]) {
						aciertosTest++;
					}
				}

				let porcentajeTest = aciertosTest / totalTest;


				console.log("---------------------------------------");
				console.log("Epoca " + epoch);
				console.log("loss: " + logs.loss);
				console.log("acc (porcentaje acierto datos train)   : " + logs.acc);
				console.log("val_loss: " + logs.val_loss);
				console.log("val_acc (porcentaje acierto datos test): " + logs.val_acc);
				console.log("Acierto en training: " + porcentajeTraining);
				console.log("Acierto en test    : " + porcentajeTest);
				await tf.nextFrame();
			}
		}
	});
}

function darFormaDatos() {
	// ###### PREPARAR DATOS PARA METERLOS EN TF #############################################
	//Se va a usar una capa convolucional en TF
	//Se necesita que la imagen estee en un array de 28x28x1
	//A continuaciópn simplifico un array de 3x3x1
	//arrayImagen =   [ [[0],[255],[10]],
	//					[[0],[255],[0]],		
	//					[[0],[255],[0]],
	//				  ]

	// NOTA: el array "image" de mnist contiene los valores como si se recorriera
	//por fila-columna en vez de columna-fila que seria lo más 'natural'
	xdatatemp = [];
	ydatatemp = [];

	let array2828 = [];

	//mnist está en JSON, pasar sus datos a un array
	for (let i = 0; i < NUMDATA; i++) {
		xdatatemp[i] = mnistdata[i].image;
		ydatatemp[i] = mnistdata[i].label;
	}

	//Obtener las imagenes en formato 28x28x1 y acumularlas en array2828
	for (let i = 0; i < NUMDATA; i++) {
		let img = crear2828vacio();
		let indice = 0;

		for (let c = 0; c < IMG_ANCHO; c++) {
			for (let f = 0; f < IMG_ALTO; f++) {
				for (let p = 0; p < IMG_CANALES; p++) {
					img[c][f][p] = xdatatemp[i][indice] / 255; //Normalizar
					indice++;
				}
			}
		}

		array2828[i] = img;
	}

	// Poner los datos y las etiquetas en 'trainx' e 'trainy' respectivamente
	// Codificar las etiquetas en OneHot
	// Obtener ya el conjunto de test
	for (let i = 0; i < NUMDATA; i++) {
		if (i >= numtest) {
			trainx.push(array2828[i]);
			trainy.push(codificarOneHot(ydatatemp[i]));
		} else {
			testx.push(array2828[i]);
			testy.push(codificarOneHot(ydatatemp[i]));
		}
	}


	console.log(trainx, trainy, testx, testy)
	trainx = tf.tensor4d(trainx, [trainx.length, IMG_ANCHO, IMG_ALTO, IMG_CANALES]);
	trainy = tf.tensor2d(trainy, [trainy.length, NUMOUTPUTS]);
	testx = tf.tensor4d(testx, [testx.length, IMG_ANCHO, IMG_ALTO, IMG_CANALES]);
	testy = tf.tensor2d(testy, [testy.length, NUMOUTPUTS]);
}

function crear2828vacio() {
	let img = [];
	for (let c = 0; c < IMG_ANCHO; c++) {
		img[c] = [];
		for (let f = 0; f < IMG_ALTO; f++) {
			img[c][f] = [];
			for (let p = 0; p < IMG_CANALES; p++) {
				img[c][f][p] = 0;
			}
		}
	}

	return img;
}

function crear2828(array) {
	let img = [];
	let indice = 0;
	for (let c = 0; c < IMG_ANCHO; c++) {
		img[c] = [];
		for (let f = 0; f < IMG_ALTO; f++) {
			img[c][f] = [];
			for (let p = 0; p < IMG_CANALES; p++) {
				img[c][f][p] = array[indice] / 255;
				indice++;
			}
		}
	}

	return img;
}

function normalizarInputs(array) {
	let toret = [];
	for (let i = 0; i < array.length; i++) {
		toret[i] = array[i] / 255;
	}
	return toret;
}

function codificarOneHot(tipo) {
	//El label tiene que ser un array para meterlo en la redtf
	//tipo == 0 -> [1,0,0,0,0,0,0,0,0,0]
	// 						...
	//tipo == 9 -> [0,0,0,0,0,0,0,0,0,1]
	let toret = [];
	for (let i = 0; i < 10; i++) {
		if (i == tipo) {
			toret[i] = 1;
		} else {
			toret[i] = 0;
		}
	}
	return toret;
}

function getImagenLienzo() {
	INCREMENTO_PIXEL = SIZE_LIENZO / IMG_ALTO;
	let imagenLienzo = [];
	let indice = 0;
	let filaTemp = 0;
	let columnaTemp = 0;

	for (let f = 0; f < 28; f++) {
		for (let c = 0; c < 28; c++) {
			let pixeltemp = get(columnaTemp, filaTemp);
			imagenLienzo[indice] = pixeltemp[0];
			indice++;
			columnaTemp += INCREMENTO_PIXEL;
		}
		columnaTemp = 0;
		filaTemp += INCREMENTO_PIXEL;
	}

	return imagenLienzo;
}

function predecirImagen() {
	let imagen = getImagenLienzo();

	//A tf hay que pasarle un tensor de 4 dimensiones
	//1x28x28x1 -> 1 - se pueden pasar varias imagenes a la vez, pero solo paso una
	//			-> 28 - px filas
	// 			-> 28 - px columnas
	// 			-> 1 - canales
	imagen = [crear2828(imagen)];
	console.log(imagen)
	imagen = tf.tensor4d(imagen, [1, 28, 28, 1]);
	output = redtf.predict(imagen).dataSync();
	console.log(indiceMaximo(output));

    background(240);
	pintarLienzo();

    textSize(20);
    fill(150,0,0);
    stroke(150,0,0);
	text("Predicción: " + indiceMaximo(output), 20, height / 2 + 100);
}

function indiceMaximo(array) {
	let maximo = -1;
	let indice;
	for (let i = 0; i < array.length; i++) {
		if (array[i] > maximo) {
			maximo = array[i];
			indice = i;
		}
	}
	return indice;
}

