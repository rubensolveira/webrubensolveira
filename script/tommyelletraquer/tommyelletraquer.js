const PORCENTAJE_TEST = 0.2;
let IMG_ANCHO = 64;
let IMG_ALTO = 64;
const IMG_CANALES = 3;
let sliderPixeles;

let PUNTOSPORFILA = 4;
let FILAS = 4;
let NUMOUTPUTS = PUNTOSPORFILA * FILAS;
let sliderNumeroPuntos;

const RADIOPUNTOS = 16;
let numeroPunto = 0;

let zoomOjo;
let sliderZoomOjo;

let SEPARACION_COL;
let SEPARACION_FIL;

const EPOCAS = 35;
let BATCHSIZE = 200;

let videoCompleto;
let imagenOjo;

let numMuestrasPorPunto = [];

let arrayImagenesOjoYLabel = [];

// --- ESTADOS ---
// 0 -> cargando
// 1->inicio
// 2 -> obteniendoDatos
// 3 -> entrenando
// 4 -> prediciendo
let estado = 0;

let redCreada = false;

//Para introducirlos en TF
let trainx = [];
let trainy = [];
let testx = [];
let testy = [];

let output;

let redtf;

let modeloFaceApi;
let faceApiPreparada = false;
let ojoderx;
let ojodery;
let ojoizx;
let ojoizy;
let partesCara;

let iniciarMuestrasPreparado = false;
let entrenarPreparado = false;

let logsTrain;

let botonIniciarMuestras;
let botonEntrenar;
let botonPredecir;

function setup() {
    let _w = window.innerWidth - 50;
    let _h = window.innerHeight - 50;

    createCanvas(_w, _h);

    SEPARACION_COL = width / PUNTOSPORFILA;
    SEPARACION_FIL = height / FILAS;

    videoCompleto = createCapture(VIDEO);
    videoCompleto.hide();

    modeloFaceApi = ml5.faceApi(videoCompleto, faceApiLista);


    botonIniciarMuestras = createButton('Iniciar toma de muestras');
    botonIniciarMuestras.mousePressed(iniciarMuestras);
    botonIniciarMuestras.hide()

    botonEntrenar = createButton('Entrenar red');
    botonEntrenar.mousePressed(entrenarRed);
    botonEntrenar.hide()

    botonPredecir = createButton('Predecir Output');
    botonPredecir.mousePressed(predecirOutput);
    botonPredecir.hide();

    sliderZoomOjo = createSlider(0.3, 1, 0.75, 0.01);
    sliderZoomOjo.position(0, height * 0.28);
    sliderZoomOjo.hide();

    sliderPixeles = createSlider(8, 128, 64, 1);
    sliderPixeles.position(0, height * 0.33);
    sliderPixeles.hide();

    sliderNumeroPuntos = createSlider(3, 15, 4, 1);
    sliderNumeroPuntos.position(0, height * 0.38);
    sliderNumeroPuntos.hide();
    background(240);
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        numeroPunto--;
        if (numeroPunto <= -1) {
            numeroPunto = FILAS * PUNTOSPORFILA - 1;
        }
    } else if (keyCode === RIGHT_ARROW) {
        numeroPunto++;
        if (numeroPunto >= FILAS * PUNTOSPORFILA) {
            numeroPunto = 0;
        }
    }
    console.log("Punto Actual: " + numeroPunto);
}

function faceApiLista() {
    modeloFaceApi.detect(videoCompleto, (err, results) => {
        faceApiPreparada = true;
        ojoderx = results[0].parts.rightEye[3]._x;
        ojodery = results[0].parts.rightEye[3]._y;
        ojoizx = results[0].parts.leftEye[0]._x;
        ojoizy = results[0].parts.leftEye[0]._y;
        partesCara = results[0].parts;
        return true;
    });
}

function entrenarRed() {
    let datos = darFormaDatos();
    if (redCreada == false) {
        crearRed();
        redCreada = true;
    }
    entrenarPreparado = true;
    console.log("ENTRENANDO")
    BATCHSIZE = floor(arrayImagenesOjoYLabel.length / 4);
    entrenar(datos.tensortrainx, datos.tensortrainy, datos.tensortestx, datos.tensortesty);

}

function pintarPuntos() {
    let indice = 0;

    for (let fil = 0; fil < FILAS; fil++) {
        for (let col = 0; col < PUNTOSPORFILA; col++) {
            fill(0, 0, 255);
            stroke(0, 0, 255);
            ellipse(col * SEPARACION_COL + SEPARACION_COL / 1.2, fil * SEPARACION_FIL + SEPARACION_FIL / 2, RADIOPUNTOS, RADIOPUNTOS);

            stroke(255);
            fill(0);
            text(indice, col * SEPARACION_COL + SEPARACION_COL / 1.2 - 5, fil * SEPARACION_FIL + SEPARACION_FIL / 2 + 25);
            indice++;
        }
    }
}

function destacarPunto(num, r, g, b) {
    let fila = floor(num / FILAS);
    let columna = num % PUNTOSPORFILA;
    fill(r, g, b);
    stroke(b, g, r);
    ellipse(columna * SEPARACION_COL + SEPARACION_COL / 1.2, fila * SEPARACION_FIL + SEPARACION_FIL / 2, RADIOPUNTOS, RADIOPUNTOS);
}

function muestrasPorPunto(num) {
    let fila = floor(num / FILAS);
    let columna = num % PUNTOSPORFILA;
    let muestras = numMuestrasPorPunto[num];
    console.log(muestras);
    fill(0, 255, 0);
    stroke(0, 255, 0);
    text(muestras + " muestras", columna * SEPARACION_COL + SEPARACION_COL / 1.2 - 15, fila * SEPARACION_FIL + SEPARACION_FIL / 2 + 40);
}

function pintarMiniatura() {
    image(videoCompleto, 0, 0, videoCompleto.width / videoCompleto.height * SEPARACION_COL * 0.5, videoCompleto.width / videoCompleto.height * SEPARACION_FIL * 0.5);
}

function pintarIdentificacionOjo() {
    let posiciones = obtenerPosicionOjos();
    stroke(0, 255, 0);
    fill(0, 255, 0);
    ellipse(map(posiciones.ojox, 0, videoCompleto.width, 0, videoCompleto.width / videoCompleto.height * SEPARACION_COL * 0.5),
        map(posiciones.ojoy, 0, videoCompleto.height, 0, videoCompleto.width / videoCompleto.height * SEPARACION_FIL * 0.5),
        5, 5
    );
}

function draw() {

    if (estado <= 1) {
        zoomOjo = sliderZoomOjo.value();
        FILAS = sliderNumeroPuntos.value();
        PUNTOSPORFILA = sliderNumeroPuntos.value();
        NUMOUTPUTS = FILAS * PUNTOSPORFILA;
        SEPARACION_COL = width / PUNTOSPORFILA;
        SEPARACION_FIL = height / FILAS;

        IMG_ALTO = sliderPixeles.value();
        IMG_ANCHO = sliderPixeles.value();
    }
    if (estado >= 1) {
        faceApiLista();
        image(videoCompleto, 0, 0);
        imagenOjo = obtenerImagenOjo();

        background(240);
        pintarPuntos();
        pintarMiniatura();
        pintarIdentificacionOjo();
        if (imagenOjo) pintarArray3d(imagenOjo, 0, height - SEPARACION_FIL * 1.3, SEPARACION_COL * 0.8);

    }

    switch (estado) {
        //CARGANDO
        case 0: console.log(estado);
            text("CARGANDO ESPERA UNOS SEGUNDOS", width / 2, height / 2);
            if (faceApiPreparada) estado = 1;
            break;

        //INICIO
        case 1:
            sliderZoomOjo.show();
            sliderNumeroPuntos.show();
            sliderPixeles.show();

            botonIniciarMuestras.show();

            fill(0, 255);
            stroke(0, 255);
            text("Elige los parametros para obtener las muestras", 0, height * 0.42);
            text("Si quieres que la detección funcione mejor debes", 0, height * 0.44);
            text("elegir un zoom mas pequeño, para que te pille parte de la cara", 0, height * 0.46);
            text("y así saber si tienes la cabeza girada o no.", 0, height * 0.48);
            text("También debes de elegir mas píxeles para que la red", 0, height * 0.50);
            text("sea entrenada con una imagen con buena resolución (mas lento).", 0, height * 0.52);

            if (iniciarMuestrasPreparado) estado = 2;
            break;

        //OBTENIENDO DATOS
        case 2: console.log(estado);
            botonIniciarMuestras.hide();
            sliderNumeroPuntos.hide();
            sliderPixeles.hide();
            sliderZoomOjo.hide();

            fill(0, 255);
            stroke(0, 255);
            text("Intenta no mover mucho la cabeza y mira fijamente al punto verde,", 0, height * 0.42);
            text("mantén pulsado la tecla 'G' para grabar la imagen del ojo", 0, height * 0.44);
            text("mientras miras al punto verde. Deja pulsado la 'G' unos", 0, height * 0.46);
            text("segundos, debe de haber unas 5 muestras por lo menos", 0, height * 0.48);
            text("para que la red se entrene bien. Luego pulsa 'Flecha derecha'", 0, height * 0.50);
            text("para avanzar el punto verde, y repite el proceso hasta que", 0, height * 0.52);
            text("acabes con todos los puntos. Luego dale al boton 'Entrenar'", 0, height * 0.54);

            destacarPunto(numeroPunto, 0, 255, 0);
            muestrasPorPunto(numeroPunto);

            if (keyIsDown(71)) { //'g'
                console.log("GRABANDO!");
                arrayImagenesOjoYLabel.push([imagenOjo, codificarOneHot(numeroPunto)]);
                console.log(arrayImagenesOjoYLabel);
                numMuestrasPorPunto[numeroPunto]++;
            }

            botonEntrenar.show();
            if (entrenarPreparado) estado = 3;
            break;

        //ENTRENANDO
        case 3: console.log(estado);
            estado = 4;//La funcion entrenar es asincrona
            break;

        //PREDICIENDO
        case 4: console.log(estado);
            //Los logs de entrenamiento se enseñan en este estado
            if (logsTrain != undefined) {
                stroke(0,255);
                fill(0,255);
                text("epoca: " + logsTrain.epoch + "/35", 0, height * 0.42);
                text("Coste: " + logsTrain.loss, 0, height * 0.44);
                text("Porcentaje acierto muestras entrenamiento: " + logsTrain.aciertoTrain, 0, height * 0.46);
                text("Porcentaje acierto muestras test: " + logsTrain.aciertoTest, 0, height * 0.48);
            }

            output = predecirOutput();
            text(255, 0, 0);
            text("EL PUNTO ROJO ES UNA PREDICION", 10, height / 2);
            console.log(output);
            destacarPunto(output, 255, 0, 0);
            break;
    }


    if (estado >= 1 && estado <= 3) {
        fill(0, 255);
        stroke(0, 255);
        text("Zoom: " + 1 / zoomOjo, 0, height * 0.27);
        text("Pixeles: " + IMG_ANCHO + "x" + IMG_ANCHO, 0, height * 0.32);
        text("Numero de puntos: " + FILAS, 0, height * 0.37);
    }
}

function iniciarMuestras() {
    iniciarMuestrasPreparado = true;
    for (let i = 0; i < NUMOUTPUTS; i++) {
        numMuestrasPorPunto[i] = 0;
    }
}

function obtenerPosicionOjos() {
    // Calcular la distancia con el otro ojo para obtener una relacion,
    // para intentar obtener la misma imagen independientemente de si
    // se esta mas lejos o mas cerca de la camara
    let relacion = dist(ojoderx, ojodery, ojoizx, ojoizy);

    //El inicio del cuadrado de la imagen del ojo y su longitud
    //Obtener un zoom de la cara
    let inicioOjox = ojoizx - relacion * 0.1;
    let inicioOjoy = ojoizy - relacion * 0.2;
    let longitud = relacion * 1.2;

    return { ojox: inicioOjox, ojoy: inicioOjoy, longitud: longitud };
}

function obtenerImagenOjo() {
    //Obtener la imagen de los ojos con el zoom de la cara
    //La imagenOjo se pasará a la red tf
    let posiciones = obtenerPosicionOjos();

    let imagenOjo = obtenerArray3DImagen(posiciones.ojox, posiciones.ojoy, posiciones.longitud * zoomOjo);
    return imagenOjo;
}

function crearArray3dVacio() {
    let img = [];
    for (let f = 0; f < IMG_ALTO; f++) {
        img[f] = [];
        for (let c = 0; c < IMG_ANCHO; c++) {
            img[f][c] = [];
            for (let p = 0; p < IMG_CANALES; p++) {
                img[f][c][p] = 0;
            }
        }
    }

    return img;
}

function obtenerArray3DImagen(iniciox, inicioy, longitud) {
    let incremento = longitud / IMG_ANCHO;
    let imagen = crearArray3dVacio();
    for (let fil = 0; fil < IMG_ALTO; fil++) {
        for (let col = 0; col < IMG_ANCHO; col++) {
            for (let canal = 0; canal < IMG_CANALES; canal++) {
                let valor = get(col * incremento + iniciox, fil * incremento + inicioy);
                imagen[fil][col][canal] = valor[canal];
            }
        }
    }
    return imagen;
}

function pintarArray3d(imagen, iniciox, inicioy, longitud) {
    let incrementox = longitud / IMG_ANCHO;
    let incrementoy = longitud / IMG_ALTO;
    for (let fil = 0; fil < IMG_ALTO; fil++) {
        for (let col = 0; col < IMG_ANCHO; col++) {

            let valorRed = imagen[fil][col][0];
            let valorGreen = imagen[fil][col][1];
            let valorBlue = imagen[fil][col][2];

            fill(valorRed, valorGreen, valorBlue);
            stroke(valorRed, valorGreen, valorBlue);
            rect(col * incrementox + iniciox, fil * incrementoy + inicioy, incrementox);
        }
    }
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
        // loss: 'categoricalCrossentropy',
        loss: 'meanSquaredError',
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

                logsTrain = { epoch: epoch, loss: logs.loss, aciertoTrain: porcentajeTraining, aciertoTest: porcentajeTest };
                await tf.nextFrame();
            }
        }
    });
}


function darFormaDatos() {
    // ###### PREPARAR DATOS PARA METERLOS EN TF #############################################
    //Se va a usar una capa convolucional en TF
    //Se necesita que la imagen estee en un array de 28x28x3
    //A continuaciópn simplifico un array de 3x3x1
    //arrayImagen =   [ [[0],[255],[10]],
    //					[[0],[255],[0]],		
    //					[[0],[255],[0]],
    //				  ]

    arrayImagenesOjoYLabel = shuffle(arrayImagenesOjoYLabel);

    // NOTA: el array "image" de mnist contiene los valores como si se recorriera
    //por fila-columna en vez de columna-fila que seria lo más 'natural'
    let xdatatemp = [];
    let ydatatemp = [];

    for (let i = 0; i < arrayImagenesOjoYLabel.length; i++) {
        xdatatemp[i] = normalizarImagen(arrayImagenesOjoYLabel[i][0]);
        ydatatemp[i] = arrayImagenesOjoYLabel[i][1];
    }

    // Poner los datos y las etiquetas en 'trainx' e 'trainy' respectivamente
    // Codificar las etiquetas en OneHot
    // Obtener ya el conjunto de test
    let numtest = arrayImagenesOjoYLabel.length * PORCENTAJE_TEST;

    for (let i = 0; i < arrayImagenesOjoYLabel.length; i++) {
        if (i >= numtest) {
            trainx.push(xdatatemp[i]);
            trainy.push(ydatatemp[i]);
        } else {
            testx.push(xdatatemp[i]);
            testy.push(ydatatemp[i]);
        }
    }



    console.log(trainx, trainy, testx, testy)

    let tensortrainx = tf.tensor4d(trainx, [trainx.length, IMG_ANCHO, IMG_ALTO, IMG_CANALES]);
    let tensortrainy = tf.tensor2d(trainy, [trainy.length, NUMOUTPUTS]);
    let tensortestx = tf.tensor4d(testx, [testx.length, IMG_ANCHO, IMG_ALTO, IMG_CANALES]);
    let tensortesty = tf.tensor2d(testy, [testy.length, NUMOUTPUTS]);

    return tensores = {
        tensortrainx: tensortrainx, tensortrainy: tensortrainy,
        tensortestx: tensortestx, tensortesty: tensortesty
    };
}


function normalizarImagen(imagen) {
    console.log(imagen);
    let toret = crearArray3dVacio();

    for (let f = 0; f < IMG_ALTO; f++) {
        for (let c = 0; c < IMG_ANCHO; c++) {
            for (let p = 0; p < IMG_CANALES; p++) {
                toret[f][c][p] = imagen[f][c][p] / 255; //Normalizar
            }
        }
    }

    return toret;
}

function codificarOneHot(tipo) {
    //El label tiene que ser un array para meterlo en la redtf
    //tipo == 0 -> [1,0,0,0,0,0,0,0,0,0]
    // 						...
    //tipo == 9 -> [0,0,0,0,0,0,0,0,0,1]
    let toret = [];
    for (let i = 0; i < FILAS * PUNTOSPORFILA; i++) {
        if (i == tipo) {
            toret[i] = 1;
        } else {
            toret[i] = 0;
        }
    }
    return toret;
}

function getIndexArrayOne(array) {
    //Si nos pasan [0.3, 0.2, 0.7] devolver 2 (el indice mas alto)
    return array.indexOf(max(array));
}

function getImagenLienzo() {
    INCREMENTO_PIXEL = SIZE_LIENZO / IMG_ALTO;
    let imagenLienzo = [];
    let indice = 0;
    let filaTemp = 0;
    let columnaTemp = 0;

    console.log(INCREMENTO_PIXEL)
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


function predecirOutput() {
    //A tf hay que pasarle un tensor de 4 dimensiones
    //1x28x28x1 -> 1 - se pueden pasar varias imagenes a la vez, pero solo paso una
    //			-> 28 - px filas
    // 			-> 28 - px columnas
    // 			-> 1 - canales
    imagenOjo = [imagenOjo];
    imagenOjo = tf.tensor4d(imagenOjo, [1, IMG_ANCHO, IMG_ALTO, IMG_CANALES]);
    output = redtf.predict(imagenOjo).dataSync();
    console.log(indiceMaximo(output));
    return indiceMaximo(output);
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