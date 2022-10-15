let cubo;
let iniciador;
let cubos;
let cubosIniciados = false; //Para que Cubos solo se cree una vez en draw

let NUMGENES = 30;
let CICLO = 0; //Cada ciclo es un gen consumido
const NUMCUBOSMAX = 100000;
let NUMCUBOS = 10000;

let sliderNumCubos;

let botonRandom;
let botonGuardar;
let botonRandomizarClicado = false;
let botonGuardarClicado = false;
let botonMostrarHistorial;


// 0 -> iniciar Cubo
// 1 -> algoritmo genetico
// 2 -> resuelto! (se cumplirá alguna vez?)
let estado = 0;

let cubosPorFila;

function setup() {
    createCanvas(window.innerWidth * 0.95, window.innerHeight * 0.95);
    cubo = new Cubo(NUMGENES);
    cubo.purpurearCubo();

    iniciador = new Iniciador(cubo);

    iniciador.botonGuardarEstado();
    iniciador.botonRandomizar();

    sliderNumCubos = createSlider(10, NUMCUBOSMAX, 10000, 1);
    sliderNumCubos.position(10, height * 0.99);
    sliderNumCubos.hide();

    botonMostrarHistorial = createButton('Mostrarel historial de movimientos');
    botonMostrarHistorial.mousePressed(mostrarHistorialMejorCubo);
    botonMostrarHistorial.hide();

    //Si la fila es mas grande se pintan mas cubos
    cubosPorFila = width / 150; //un cubo cada 150 px
    cubosPorFila = width / cubosPorFila;
}

function draw() {
    background(220);

    switch (estado) {
        case 0: //Inicio, dar colores al cubo
            sliderNumCubos.show();
            NUMCUBOS = sliderNumCubos.value();
            fill(0);
            stroke(0, 0);
            text("Número de cubos: " + NUMCUBOS, 150, height - 10);
            text("Estos son los colores de tu cubo. Rellénalos con los colores que quieras o dale a", 20, 10);
            text("'Randomizar' para obtener un cubo random", 20, 25);
            cubo.pintarCubo(20, 28, height / 2);

            //Cuando se pulsa el boton Randomizar
            if (botonRandomizarClicado == false) {
                fill(0);
                stroke(0, 0);
                text("Cick en los siguientes colores para obtener la forma del cubo que desees", 20, height / 2 + 60);
                iniciador.botonesCubo(20, height / 2 + 80, height / 2);
                //Cuando se pulsa el boton GuardarEstado
                if (!iniciador.coloresValidos) {
                    fill(255, 0, 0);
                    stroke(0, 0);
                    text("Aún hay colores púrpuras que debes de rellenar!", 20, height / 2 + 45);
                }
            }

            if (botonGuardarClicado) iniciador.comprobarColoresValidos();

            if (iniciador.coloresValidos && botonGuardarClicado) estado = 1;
            break;

        case 1: //Generando generaciones e intentando resolver
            sliderNumCubos.hide();
            botonMostrarHistorial.show();

            if (cubosIniciados == false) { //Ejecutar solo 1 vez al principio
                cubos = new Cubos(NUMCUBOS, cubo, NUMGENES);
                cubosIniciados = true;
            }
            cubos.obtenerMejorCuboEnAlgunPuntoGeneracion();
            cubos.pintarEstadisticas(2, 2, width - 2, (height * 0.25) - 2);
            cubos.pintarCubos(0, height * 0.25, width, height * 0.95, cubosPorFila);
            cubos.actualizarCubos();
            CICLO++;
            if (CICLO == NUMGENES - 1) {
                CICLO = 0;
            }
            break;

        case 2: //Resuelto. owO Owo OwO owo
            break;
    }
}

function mostrarHistorialMejorCubo() {
    let p = document.getElementById("historial");
    p.innerHTML = "";
    for (let i = 0; i < cubos.mejorCuboGeneracion.historialMovimientos.length; i++) {
        p.innerHTML += i + 1 + " paso -> cara " + cubos.mejorCuboGeneracion.historialMovimientos[i].cara + " sentido " + cubos.mejorCuboGeneracion.historialMovimientos[i].sentido + " ||&emsp;";
    }
}

function mouseClicked() {
    //cubo.girar("amarilla", "antihorario");
}