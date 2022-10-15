//IMPORTANTE : as funcions de girar teñen en conta que o cubo estase mirando desde a cara
//azul, arriba esta a cara blanca, abaixo a amarilla, izq a roja, e dereita a naranja.
let cubo;
let iniciador;
let botonGuardar;
let botonRandom;

let mostrarIniciador = true;
let coloresValidos;

let resolvedor;
let bolComprobarCruzBlancaCaraAmarilla = false;
let bolCruzBlancaCaraBlanca = false;
let bolComprobarCaraBlancaCompleta = false;
let bolComprobarDosFilas = false;
let bolComprobarL = false;
let bolComprobarLineaAmarilla = false;
let bolCruzAmarilla = true;
let bolCuadrarCarasAmarillas = false;

let movimientoCara = new Array();
let movimientoSentido = new Array();

function setup() {
  createCanvas(innerWidth * 0.9, innerHeight * 0.9);
  cubo = new Rubik();
  // cubo.cuboResuelto();
  cubo.purpurearCubo();
  iniciador = new Iniciador(cubo);
  iniciador.botonGuardarEstado();
  iniciador.botonRandomizar();
  coloresValidos = false;
  resolvedor = new Resolvedor(cubo);
}

function draw() {
  background(220);


  cubo.pintarCubo(20, 20, height * 0.4);
  if (mostrarIniciador) {
    iniciador.botonesCubo(20, height * 0.5, height * 0.4);
    fill(0);
    text("No se comprueba si los colores que has introducido son correctos, no seas malo por favor:D", 20, height * 0.92);
    text("Dale a randomizar para que aparezca un cubo random si quieres", 20, height * 0.95);
  }

  if (coloresValidos == false) {
    fill(0);
    text("Aún hay piezas púrpuras, rellénalas para poder empezar a resolver el cubo!", 20, height * 0.45);
  } else {
    mostrarMovimientos();
    textSize(18); fill(0);
    text("haz click en cualquier para ir resolviendo el cubo", 10, height * 0.5);
  }
}

function mouseClicked() {
  if (mostrarIniciador == false) {
    movimientoCara = [];
    movimientoSentido = [];
    if (!bolComprobarCruzBlancaCaraAmarilla) {
      resolvedor.resolverCruzBlancaCaraAmarilla();
      resolvedor.comprobarCruzBlancaCaraAmarilla();
      console.log("Haciendo cruz en cara amarilla...");
    } else if (!bolCruzBlancaCaraBlanca) {
      resolvedor.cruzBlancaCaraBlanca();
      resolvedor.comprobarCruzBlancaCaraBlanca();
      console.log("Haciendo cruz en cara blanca...");
    } else if (!bolComprobarCaraBlancaCompleta) {
      resolvedor.caraBlancaCompleta();
      resolvedor.comprobarCaraBlancaCompleta();
      console.log("Haciendo cara blanca...");
    } else if (!bolComprobarDosFilas) {
      resolvedor.dosFilas();
      resolvedor.comprobarDosFilas();
      console.log("Haciendo las dos filas");
    } else if (!bolComprobarLineaAmarilla) {
      console.log("Haciendo la L");
      resolvedor.resolverLineaAmarilla();

    } else if (!bolCruzAmarilla) {
      console.log("Haciendo la cruz amarilla");
      resolvedor.resolverLineaAmarilla();
    } else if (!bolCuadrarCarasAmarillas) {
      console.log("Cuadrando caras amarillas");
    }
  }

}

function keyPressed() {
  if (keyCode === 65) { // A
    cubo.girar("azul", "antihorario");
  }
  if (keyCode === 66) { // B
    cubo.girar("blanca", "antihorario");
  }
  if (keyCode === 78) { // N
    cubo.girar("naranja", "antihorario");
  }
  if (keyCode === 82) { // R
    cubo.girar("roja", "antihorario");
  }
  if (keyCode === 86) { // V
    cubo.girar("verde", "antihorario");
  }

  return false; // prevent default
}

function mostrarMovimientos() {

  let incremento = 0;
  for (let i = 0; i < movimientoCara.length; i++) {

    //console.log(movimientoCara[i] + "---" + movimientoSentido[i]);
    fill(0);
    textSize(12); text(movimientoCara[i] + "---" + movimientoSentido[i], 10, incremento + height * 0.55);
    incremento += 20;
  }
}

//IMPORTANTE : as funcions de girar teñen en conta que o cubo estase mirando desde a cara
//azul, arriba esta a cara blanca, abaixo a amarilla, izq a roja, e dereita a naranja.
class Rubik {

  constructor() {
    this.caraRoja = [
      ["rojo", "rojo", "rojo"],
      ["rojo", "rojo", "rojo"],
      ["rojo", "rojo", "rojo"]
    ];

    this.caraAzul = [
      ["azul", "azul", "azul"],
      ["azul", "azul", "azul"],
      ["azul", "azul", "azul"]
    ];

    this.caraBlanca = [
      ["blanco", "blanco", "blanco"],
      ["blanco", "blanco", "blanco"],
      ["blanco", "blanco", "blanco"]
    ];

    this.caraAmarilla = [
      ["amarillo", "amarillo", "amarillo"],
      ["amarillo", "amarillo", "amarillo"],
      ["amarillo", "amarillo", "amarillo"]
    ];

    this.caraVerde = [
      ["verde", "verde", "verde"],
      ["verde", "verde", "verde"],
      ["verde", "verde", "verde"]
    ];

    this.caraNaranja = [
      ["naranja", "naranja", "naranja"],
      ["naranja", "naranja", "naranja"],
      ["naranja", "naranja", "naranja"]
    ];
  }

  getColor(color) {
    if (color == "blanco") return "#FFFFFF";
    if (color == "rojo") return "#FF0000";
    if (color == "verde") return "#00FF00";
    if (color == "azul") return "#0000FF";
    if (color == "amarillo") return "#FFFF00";
    if (color == "naranja") return "#FF7700";
    if (color == "purpura") return "#FF00FF";
  }

  purpurearCaraAzul() {
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        if (!(i == 1 && j == 1)) this.caraAzul[i][j] = "purpura";
      }
    }
  }

  purpurearCaraAmarilla() {
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        if (!(i == 1 && j == 1)) this.caraAmarilla[i][j] = "purpura";
      }
    }
  }
  purpurearCaraBlanca() {
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        if (!(i == 1 && j == 1)) this.caraBlanca[i][j] = "purpura";
      }
    }
  }
  purpurearCaraNaranja() {
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        if (!(i == 1 && j == 1)) this.caraNaranja[i][j] = "purpura";
      }
    }
  }
  purpurearCaraRoja() {
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        if (!(i == 1 && j == 1)) this.caraRoja[i][j] = "purpura";
      }
    }
  }

  purpurearCaraVerde() {
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        if (!(i == 1 && j == 1)) this.caraVerde[i][j] = "purpura";
      }
    }
  }

  purpurearCubo() {
    this.purpurearCaraAzul();
    this.purpurearCaraAmarilla();
    this.purpurearCaraBlanca();
    this.purpurearCaraNaranja();
    this.purpurearCaraRoja();
    this.purpurearCaraVerde();
  }

  cuboResuelto() {
    this.caraRoja = [
      ["rojo", "rojo", "rojo"],
      ["rojo", "rojo", "rojo"],
      ["rojo", "rojo", "rojo"]
    ];

    this.caraAzul = [
      ["azul", "azul", "azul"],
      ["azul", "azul", "azul"],
      ["azul", "azul", "azul"]
    ];

    this.caraBlanca = [
      ["blanco", "blanco", "blanco"],
      ["blanco", "blanco", "blanco"],
      ["blanco", "blanco", "blanco"]
    ];

    this.caraAmarilla = [
      ["amarillo", "amarillo", "amarillo"],
      ["amarillo", "amarillo", "amarillo"],
      ["amarillo", "amarillo", "amarillo"]
    ];

    this.caraVerde = [
      ["verde", "verde", "verde"],
      ["verde", "verde", "verde"],
      ["verde", "verde", "verde"]
    ];

    this.caraNaranja = [
      ["naranja", "naranja", "naranja"],
      ["naranja", "naranja", "naranja"],
      ["naranja", "naranja", "naranja"]
    ];
    // this.caraRoja= [ 
    // ["1r", "2r", "3r"],
    // ["4r", "5r", "6r"],
    // ["7r", "8r", "9r"] 
    // ];

    // this.caraAzul= [ 
    // ["1az", "2az", "3az"],
    // ["4az", "5az", "6az"], 
    // ["7az", "8az", "9az"] 
    // ];

    // this.caraBlanca= [ 
    // ["1b", "2b", "3b"],
    // ["4b", "5b", "6b"], 
    // ["7b", "8b", "9b"] 
    // ];

    // this.caraAmarilla= [ 
    // ["1am", "2am", "3am"],
    // ["4am", "5am", "6am"], 
    // ["7am", "8am", "9am"] 
    // ];

    // this.caraVerde= [ 
    // ["1v", "2v", "3v"],
    // ["4v", "5v", "6v"], 
    // ["7v", "8v", "9v"] 
    // ];

    // this.caraNaranja= [ 
    // ["1n", "2n", "3n"],
    // ["4n", "5n", "6n"], 
    // ["7n", "8n", "9n"] 
    // ];
  }

  pintarCubo(iniciox, inicioy, longitudCubo) {
    fill(240);
    square(iniciox, inicioy, longitudCubo);

    const longitudCara = longitudCubo / 4;
    const longitudPieza = longitudCara / 3 - 1;


    let piezax = iniciox;
    let piezay = inicioy + longitudCara;
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        fill(this.getColor(this.caraRoja[i][m]));
        square(piezax, piezay, longitudPieza - 1);
        piezax += longitudPieza;
      }
      piezax = iniciox;
      piezay += longitudPieza;
    }

    piezax = iniciox + longitudCara;
    piezay = inicioy + longitudCara;
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        fill(this.getColor(this.caraAzul[i][m]));
        square(piezax, piezay, longitudPieza - 1);
        piezax += longitudPieza;
      }
      piezax = iniciox + longitudCara;
      piezay += longitudPieza;
    }

    piezax = iniciox + longitudCara + longitudCara;
    piezay = inicioy + longitudCara;
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        fill(this.getColor(this.caraNaranja[i][m]));
        square(piezax, piezay, longitudPieza - 1);
        piezax += longitudPieza;
      }
      piezax = iniciox + longitudCara + longitudCara;
      piezay += longitudPieza;
    }

    piezax = iniciox + longitudCara + longitudCara + longitudCara;
    piezay = inicioy + longitudCara;
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        fill(this.getColor(this.caraVerde[i][m]));
        square(piezax, piezay, longitudPieza - 1);
        piezax += longitudPieza;
      }
      piezax = iniciox + longitudCara + longitudCara + longitudCara;
      piezay += longitudPieza;
    }

    piezax = iniciox + longitudCara;
    piezay = inicioy;
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        fill(this.getColor(this.caraBlanca[i][m]));
        square(piezax, piezay, longitudPieza - 1);
        piezax += longitudPieza;
      }
      piezax = iniciox + longitudCara;
      piezay += longitudPieza;
    }

    piezax = iniciox + longitudCara;
    piezay = inicioy + longitudCara + longitudCara;
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        fill(this.getColor(this.caraAmarilla[i][m]));
        square(piezax, piezay, longitudPieza - 1);
        piezax += longitudPieza;
      }
      piezax = iniciox + longitudCara;
      piezay += longitudPieza;
    }

  } //fin pintar()

  girar(cara, sentido) {
    movimientoCara.push(cara);
    movimientoSentido.push(sentido);

    let caraActual = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    let filaIzq = [];
    let filaSup = [];
    let filaDer = [];
    let filaInf = [];

    //Almacenar colores de las filas adyacentes a la cara
    //Si miramos a la cara azul, la fila izquierda será la 'fila' de la cara roja mas pegada a la cara azul.
    if (cara == "azul") {
      caraActual = this.caraAzul;
      for (let i = 0; i < 3; i++) filaIzq[i] = this.caraRoja[i][2];
      for (let i = 0; i < 3; i++) filaSup[i] = this.caraBlanca[2][i];
      for (let i = 0; i < 3; i++) filaDer[i] = this.caraNaranja[i][0];
      for (let i = 0; i < 3; i++) filaInf[i] = this.caraAmarilla[0][i];
    } else if (cara == "naranja") {
      caraActual = this.caraNaranja;
      for (let i = 0; i < 3; i++) filaIzq[i] = this.caraAzul[i][2];
      for (let i = 0; i < 3; i++) filaSup[i] = this.caraBlanca[i][2];
      for (let i = 0; i < 3; i++) filaDer[i] = this.caraVerde[i][0];
      for (let i = 0; i < 3; i++) filaInf[i] = this.caraAmarilla[i][2];
    } else if (cara == "verde") {
      caraActual = this.caraVerde;
      for (let i = 0; i < 3; i++) filaIzq[i] = this.caraNaranja[i][2];
      for (let i = 0; i < 3; i++) filaSup[i] = this.caraBlanca[0][i];
      for (let i = 0; i < 3; i++) filaDer[i] = this.caraRoja[i][0];
      for (let i = 0; i < 3; i++) filaInf[i] = this.caraAmarilla[2][i];
    } else if (cara == "roja") {
      caraActual = this.caraRoja;
      for (let i = 0; i < 3; i++) filaIzq[i] = this.caraVerde[i][2];
      for (let i = 0; i < 3; i++) filaSup[i] = this.caraBlanca[i][0];
      for (let i = 0; i < 3; i++) filaDer[i] = this.caraAzul[i][0];
      for (let i = 0; i < 3; i++) filaInf[i] = this.caraAmarilla[i][0];
    } else if (cara == "blanca") {
      caraActual = this.caraBlanca;
      for (let i = 0; i < 3; i++) filaIzq[i] = this.caraRoja[0][i];
      for (let i = 0; i < 3; i++) filaSup[i] = this.caraVerde[0][i];
      for (let i = 0; i < 3; i++) filaDer[i] = this.caraNaranja[0][i];
      for (let i = 0; i < 3; i++) filaInf[i] = this.caraAzul[0][i];
    } else if (cara == "amarilla") {
      caraActual = this.caraAmarilla;
      for (let i = 0; i < 3; i++) filaIzq[i] = this.caraRoja[2][i];
      for (let i = 0; i < 3; i++) filaSup[i] = this.caraAzul[2][i];
      for (let i = 0; i < 3; i++) filaDer[i] = this.caraNaranja[2][i];
      for (let i = 0; i < 3; i++) filaInf[i] = this.caraVerde[2][i];
    }


    //Giro horario
    if (sentido == "horario") {
      //Girar cara entera en sentido horario, almacenarla en un temp para no sobrescribir
      let temp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      for (let n = 0; n < 3; n++) {
        for (let m = 0, mm = 2; m < 3 && mm > -1; m++, mm--) {
          temp[n][m] = caraActual[mm][n];
        }
      }

      //Pasar la cara temporal ya girada a la cara actual
      if (cara == "azul") this.caraAzul = temp;
      else if (cara == "naranja") this.caraNaranja = temp;
      else if (cara == "verde") this.caraVerde = temp;
      else if (cara == "roja") this.caraRoja = temp;
      else if (cara == "blanca") this.caraBlanca = temp;
      else if (cara == "amarilla") this.caraAmarilla = temp;

      //Almacenar las filas en las caras con el sentido girado, giro horario.
      //Ejemplo: si estamos mirando la cara azul, la fila de la cara roja 
      //contendrá la fila de la cara azul inferior.
      if (cara == "azul") {
        for (let i = 0; i < 3; i++) this.caraRoja[i][2] = filaInf[i];
        for (let i = 0; i < 3; i++) this.caraBlanca[2][i] = filaIzq[2 - i];
        for (let i = 0; i < 3; i++) this.caraNaranja[i][0] = filaSup[i];
        for (let i = 0; i < 3; i++) this.caraAmarilla[0][i] = filaDer[2 - i];
      } else if (cara == "naranja") {
        for (let i = 0; i < 3; i++) this.caraAzul[i][2] = filaInf[i];
        for (let i = 0; i < 3; i++) this.caraBlanca[i][2] = filaIzq[i];
        for (let i = 0; i < 3; i++) this.caraVerde[i][0] = filaSup[2 - i];
        for (let i = 0; i < 3; i++) this.caraAmarilla[i][2] = filaDer[2 - i];
      } else if (cara == "verde") {
        for (let i = 0; i < 3; i++) this.caraNaranja[i][2] = filaInf[2 - i];
        for (let i = 0; i < 3; i++) this.caraBlanca[0][i] = filaIzq[i];
        for (let i = 0; i < 3; i++) this.caraRoja[i][0] = filaSup[2 - i];
        for (let i = 0; i < 3; i++) this.caraAmarilla[2][i] = filaDer[i];
      } else if (cara == "roja") {
        for (let i = 0; i < 3; i++) this.caraVerde[i][2] = filaInf[2 - i];
        for (let i = 0; i < 3; i++) this.caraBlanca[i][0] = filaIzq[2 - i];
        for (let i = 0; i < 3; i++) this.caraAzul[i][0] = filaSup[i];
        for (let i = 0; i < 3; i++) this.caraAmarilla[i][0] = filaDer[i];
      } else if (cara == "blanca") {
        for (let i = 0; i < 3; i++) this.caraRoja[0][i] = filaInf[i];
        for (let i = 0; i < 3; i++) this.caraVerde[0][i] = filaIzq[i];
        for (let i = 0; i < 3; i++) this.caraNaranja[0][i] = filaSup[i];
        for (let i = 0; i < 3; i++) this.caraAzul[0][i] = filaDer[i];
      } else if (cara == "amarilla") {
        for (let i = 0; i < 3; i++) this.caraRoja[2][i] = filaInf[i];
        for (let i = 0; i < 3; i++) this.caraAzul[2][i] = filaIzq[i];
        for (let i = 0; i < 3; i++) this.caraNaranja[2][i] = filaSup[i];
        for (let i = 0; i < 3; i++) this.caraVerde[2][i] = filaDer[i];
      }
    }//fin giro horario

    //Giro antihorario
    if (sentido == "antihorario") {
      //Girar cara entera en sentido antihorario, almacenarla en un temp para no sobrescribir
      let temp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      for (let n = 0, nn = 2; n < 3 && nn > -1; n++, nn--) {
        for (let m = 0; m < 3; m++) {
          temp[n][m] = caraActual[m][nn];
        }
      }

      //Pasar la cara temporal ya girada a la cara actual
      if (cara == "azul") this.caraAzul = temp;
      else if (cara == "naranja") this.caraNaranja = temp;
      else if (cara == "verde") this.caraVerde = temp;
      else if (cara == "roja") this.caraRoja = temp;
      else if (cara == "blanca") this.caraBlanca = temp;
      else if (cara == "amarilla") this.caraAmarilla = temp;

      //Almacenar las filas en las caras con el sentido girado, giro antihorario.
      //Ejemplo: si estamos mirando la cara azul, la fila de la cara roja 
      //contendrá la fila de la cara azul superior.
      if (cara == "azul") {
        for (let i = 0; i < 3; i++) this.caraRoja[i][2] = filaSup[2 - i];
        for (let i = 0; i < 3; i++) this.caraBlanca[2][i] = filaDer[i];
        for (let i = 0; i < 3; i++) this.caraNaranja[i][0] = filaInf[2 - i];
        for (let i = 0; i < 3; i++) this.caraAmarilla[0][i] = filaIzq[i];
      } else if (cara == "naranja") {
        for (let i = 0; i < 3; i++) this.caraAzul[i][2] = filaSup[i];
        for (let i = 0; i < 3; i++) this.caraBlanca[i][2] = filaDer[2 - i];
        for (let i = 0; i < 3; i++) this.caraVerde[i][0] = filaInf[2 - i];
        for (let i = 0; i < 3; i++) this.caraAmarilla[i][2] = filaIzq[i];
      } else if (cara == "verde") {
        for (let i = 0; i < 3; i++) this.caraNaranja[i][2] = filaSup[i];
        for (let i = 0; i < 3; i++) this.caraBlanca[0][i] = filaDer[2 - i];
        for (let i = 0; i < 3; i++) this.caraRoja[i][0] = filaInf[i];
        for (let i = 0; i < 3; i++) this.caraAmarilla[2][i] = filaIzq[2 - i];
      } else if (cara == "roja") {
        for (let i = 0; i < 3; i++) this.caraVerde[i][2] = filaSup[2 - i];
        for (let i = 0; i < 3; i++) this.caraBlanca[i][0] = filaDer[i];
        for (let i = 0; i < 3; i++) this.caraAzul[i][0] = filaInf[i];
        for (let i = 0; i < 3; i++) this.caraAmarilla[i][0] = filaIzq[2 - i];
      } else if (cara == "blanca") {
        for (let i = 0; i < 3; i++) this.caraRoja[0][i] = filaSup[i];
        for (let i = 0; i < 3; i++) this.caraVerde[0][i] = filaDer[i];
        for (let i = 0; i < 3; i++) this.caraNaranja[0][i] = filaInf[i];
        for (let i = 0; i < 3; i++) this.caraAzul[0][i] = filaIzq[i];
      } else if (cara == "amarilla") {
        for (let i = 0; i < 3; i++) this.caraRoja[2][i] = filaSup[i];
        for (let i = 0; i < 3; i++) this.caraAzul[2][i] = filaDer[i];
        for (let i = 0; i < 3; i++) this.caraNaranja[2][i] = filaInf[i];
        for (let i = 0; i < 3; i++) this.caraVerde[2][i] = filaIzq[i];
      }
    }//fin giro horario

  }//Fin girar()


}//Fin clase Cubo

class Iniciador {
  constructor(c) {
    this.cubo = c;
  }

  getColor(color) {
    if (color == "blanco") return "#FFFFFF";
    if (color == "rojo") return "#FF0000";
    if (color == "verde") return "#00FF00";
    if (color == "azul") return "#0000FF";
    if (color == "amarillo") return "#FFFF00";
    if (color == "naranja") return "#FF7700";
    if (color == "purpura") return "#FF00FF";
  }

  //Crea un único boton en la posicion y de la longitud que se indica
  //Cuando se clicka en el devuelve su color de la pieza y la cara a la que corresponde
  //Funcion privada
  boton(iniciox, inicioy, longitudx, longitudy, colorPieza, colorCara, indiceFil, indiceCol) {
    let colorCodificado = this.getColor(colorPieza);
    fill(colorCodificado);
    rect(iniciox, inicioy, longitudx, longitudy);
    if (mouseX > iniciox && mouseX < (iniciox + longitudx) &&
      mouseY > inicioy && mouseY < (inicioy + longitudy) &&
      mouseIsPressed) {

      console.log({ colorPieza, colorCara, indiceFil, indiceCol });

      if (colorCara == "rojo") this.cubo.caraRoja[indiceFil][indiceCol] = colorPieza;
      else if (colorCara == "azul") this.cubo.caraAzul[indiceFil][indiceCol] = colorPieza;
      else if (colorCara == "naranja") this.cubo.caraNaranja[indiceFil][indiceCol] = colorPieza;
      else if (colorCara == "verde") this.cubo.caraVerde[indiceFil][indiceCol] = colorPieza;
      else if (colorCara == "blanco") this.cubo.caraBlanca[indiceFil][indiceCol] = colorPieza;
      else if (colorCara == "amarillo") this.cubo.caraAmarilla[indiceFil][indiceCol] = colorPieza;
    }
  }

  //Funcion privada
  boton6Colores(iniciox, inicioy, longitudx, longitudy, colorCara, indiceFil, indiceCol) {
    let colores = ["blanco", "rojo", "verde", "azul", "amarillo", "naranja"];
    let incrementox = longitudx / 3;
    let incrementoy = longitudy / 2;
    let posicionx = iniciox;
    let posiciony = inicioy;

    for (let i = 0; i < 6; i++) {
      this.boton(posicionx, posiciony, incrementox, incrementoy, colores[i], colorCara, indiceFil, indiceCol);
      posicionx += incrementox;
      if (i == 2) {
        //saltar de linea
        posicionx = iniciox;
        posiciony = inicioy + incrementoy;
      }
    }
  }

  //Funcion privada
  botonesCara(iniciox, inicioy, longitud, colorCara) {
    let incremento = longitud / 3;
    let incrementoConSeparacion = longitud / 3 - (longitud / 3) * 0.20;
    let posicionx = iniciox;
    let posiciony = inicioy;

    let indices = {};

    for (let i = 0; i < 3; i++) {
      posicionx = iniciox;
      for (let m = 0; m < 3; m++) {
        //Si no es el boton central pintar los 6 colores
        if (i != 1 || m != 1) {
          this.boton6Colores(posicionx, posiciony, incrementoConSeparacion, incrementoConSeparacion, colorCara, i, m);

          //Si es el boton central pintarlo entero del color de la cara
        } else {
          this.boton(posicionx, posiciony, incrementoConSeparacion, incrementoConSeparacion, colorCara, colorCara, i, m);
        }
        posicionx += incremento;
      }
      posiciony += incremento;
    }
  }

  //Funcion publica
  botonesCubo(iniciox, inicioy, longitudCubo) {

    const longitudCara = longitudCubo / 4;

    let carax = iniciox;
    let caray = inicioy + longitudCara;
    fill(this.getColor("rojo"));
    square(carax - 4, caray - 4, longitudCara);
    this.botonesCara(iniciox, caray, longitudCara, "rojo");

    carax = iniciox + longitudCara;
    caray = inicioy + longitudCara;
    fill(this.getColor("azul"));
    square(carax - 4, caray - 4, longitudCara);
    this.botonesCara(carax, caray, longitudCara, "azul");

    carax = iniciox + longitudCara + longitudCara;
    caray = inicioy + longitudCara;
    fill(this.getColor("naranja"));
    square(carax - 4, caray - 4, longitudCara);
    this.botonesCara(carax, caray, longitudCara, "naranja");

    carax = iniciox + longitudCara + longitudCara + longitudCara;
    caray = inicioy + longitudCara;
    fill(this.getColor("verde"));
    square(carax - 4, caray - 4, longitudCara);
    this.botonesCara(carax, caray, longitudCara, "verde");

    carax = iniciox + longitudCara;
    caray = inicioy;
    fill(this.getColor("blanco"));
    square(carax - 4, caray - 4, longitudCara);
    this.botonesCara(carax, caray, longitudCara, "blanco");

    carax = iniciox + longitudCara;
    caray = inicioy + longitudCara + longitudCara;
    fill(this.getColor("amarillo"));
    square(carax - 4, caray - 4, longitudCara);
    this.botonesCara(carax, caray, longitudCara, "amarillo");
  }

  botonGuardarEstado() {
    botonGuardar = createButton('GUARDAR');
    botonGuardar.mousePressed(this.guardarYContinuar);
  }

  guardarYContinuar() {
    coloresValidos = true;
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        if (cubo.caraAzul[i][m] == "purpura") coloresValidos = false;
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        if (cubo.caraNaranja[i][m] == "purpura") coloresValidos = false;
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        if (cubo.caraRoja[i][m] == "purpura") coloresValidos = false;
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        if (cubo.caraVerde[i][m] == "purpura") coloresValidos = false;
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        if (cubo.caraBlanca[i][m] == "purpura") coloresValidos = false;
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        if (cubo.caraAmarilla[i][m] == "purpura") coloresValidos = false;
      }
    }

    //Desplazar los botones para que no se vean y dar paso al Resolvedor.
    if (coloresValidos == true) {
      botonGuardar.remove();
      botonRandom.remove();
      mostrarIniciador = false;
    }
  }


  botonRandomizar() {
    botonRandom = createButton('RANDOMIZAR');
    botonRandom.mousePressed(this.randomizarCubo);
  }

  randomizarCubo() {
    cubo.cuboResuelto();
    coloresValidos = true;
    botonGuardar.remove();
    botonRandom.remove();
    mostrarIniciador = false;

    //randomizar
    for (let i = 0; i <= 10; i++) {
      let rand = random();
      if (rand <= 0.1) cubo.girar("amarilla", "antihorario");
      else if (rand <= 0.2) cubo.girar("azul", "antihorario");
      else if (rand <= 0.3) cubo.girar("blanca", "antihorario");
      else if (rand <= 0.4) cubo.girar("naranja", "antihorario");
      else if (rand <= 0.5) cubo.girar("roja", "antihorario");
      else if (rand <= 0.6) cubo.girar("verde", "antihorario");
    }
  }


}//fin clase Iniciador

// para los selects. por alguna razon esto de los selects solo funciona de esta manera, la funcion tiene que ser global.
function guardarCaraAzul() {
  cubo.caraAzul[0][0] = select00azul.value();
  cubo.caraAzul[0][1] = select01azul.value();
  cubo.caraAzul[0][2] = select02azul.value();
  cubo.caraAzul[1][0] = select10azul.value();
  cubo.caraAzul[1][1] = select11azul.value();
  cubo.caraAzul[1][2] = select12azul.value();
  cubo.caraAzul[2][0] = select20azul.value();
  cubo.caraAzul[2][1] = select21azul.value();
  cubo.caraAzul[2][2] = select22azul.value();
}

function guardarCaraNaranja() {
  cubo.caraNaranja[0][0] = select00naranja.value();
  cubo.caraNaranja[0][1] = select01naranja.value();
  cubo.caraNaranja[0][2] = select02naranja.value();
  cubo.caraNaranja[1][0] = select10naranja.value();
  cubo.caraNaranja[1][1] = select11naranja.value();
  cubo.caraNaranja[1][2] = select12naranja.value();
  cubo.caraNaranja[2][0] = select20naranja.value();
  cubo.caraNaranja[2][1] = select21naranja.value();
  cubo.caraNaranja[2][2] = select22naranja.value();
}

function guardarCaraRoja() {
  cubo.caraRoja[0][0] = select00rojo.value();
  cubo.caraRoja[0][1] = select01rojo.value();
  cubo.caraRoja[0][2] = select02rojo.value();
  cubo.caraRoja[1][0] = select10rojo.value();
  cubo.caraRoja[1][1] = select11rojo.value();
  cubo.caraRoja[1][2] = select12rojo.value();
  cubo.caraRoja[2][0] = select20rojo.value();
  cubo.caraRoja[2][1] = select21rojo.value();
  cubo.caraRoja[2][2] = select22rojo.value();
}

function guardarCaraVerde() {
  cubo.caraVerde[0][0] = select00verde.value();
  cubo.caraVerde[0][1] = select01verde.value();
  cubo.caraVerde[0][2] = select02verde.value();
  cubo.caraVerde[1][0] = select10verde.value();
  cubo.caraVerde[1][1] = select11verde.value();
  cubo.caraVerde[1][2] = select12verde.value();
  cubo.caraVerde[2][0] = select20verde.value();
  cubo.caraVerde[2][1] = select21verde.value();
  cubo.caraVerde[2][2] = select22verde.value();
}

function guardarCaraBlanca() {
  cubo.caraBlanca[0][0] = select00blanco.value();
  cubo.caraBlanca[0][1] = select01blanco.value();
  cubo.caraBlanca[0][2] = select02blanco.value();
  cubo.caraBlanca[1][0] = select10blanco.value();
  cubo.caraBlanca[1][1] = select11blanco.value();
  cubo.caraBlanca[1][2] = select12blanco.value();
  cubo.caraBlanca[2][0] = select20blanco.value();
  cubo.caraBlanca[2][1] = select21blanco.value();
  cubo.caraBlanca[2][2] = select22blanco.value();
}

function guardarCaraAmarilla() {
  cubo.caraAmarilla[0][0] = select00amarillo.value();
  cubo.caraAmarilla[0][1] = select01amarillo.value();
  cubo.caraAmarilla[0][2] = select02amarillo.value();
  cubo.caraAmarilla[1][0] = select10amarillo.value();
  cubo.caraAmarilla[1][1] = select11amarillo.value();
  cubo.caraAmarilla[1][2] = select12amarillo.value();
  cubo.caraAmarilla[2][0] = select20amarillo.value();
  cubo.caraAmarilla[2][1] = select21amarillo.value();
  cubo.caraAmarilla[2][2] = select22amarillo.value();
}

class Resolvedor {

  resolverCruzBlancaCaraAmarilla() {
    //Comprobar si hay piezas medias blancas arriba y pasarlas a la cara amarilla
    if (cubo.caraBlanca[0][1] == "blanco" && cubo.caraAmarilla[2][1] != "blanco") {
      cubo.girar("verde", "antihorario");
      cubo.girar("verde", "antihorario");
    } else if (cubo.caraBlanca[0][1] == "blanco" && cubo.caraAmarilla[2][1] == "blanco") {
      cubo.girar("amarilla", "antihorario");
      cubo.girar("verde", "antihorario");
      cubo.girar("verde", "antihorario");
    } else

      if (cubo.caraBlanca[1][0] == "blanco" && cubo.caraAmarilla[1][0] != "blanco") {
        cubo.girar("roja", "antihorario");
        cubo.girar("roja", "antihorario");
      } else if (cubo.caraBlanca[1][0] == "blanco" && cubo.caraAmarilla[1][0] == "blanco") {
        cubo.girar("amarilla", "antihorario");
        cubo.girar("roja", "antihorario");
        cubo.girar("roja", "antihorario");
      } else

        if (cubo.caraBlanca[2][1] == "blanco" && cubo.caraAmarilla[0][1] != "blanco") {
          cubo.girar("azul", "antihorario");
          cubo.girar("azul", "antihorario");
        } else if (cubo.caraBlanca[2][1] == "blanco" && cubo.caraAmarilla[0][1] == "blanco") {
          cubo.girar("amarilla", "antihorario");
          cubo.girar("azul", "antihorario");
          cubo.girar("azul", "antihorario");
        } else

          if (cubo.caraBlanca[1][2] == "blanco" && cubo.caraAmarilla[1][2] != "blanco") {
            cubo.girar("naranja", "antihorario");
            cubo.girar("naranja", "antihorario");
          } else if (cubo.caraBlanca[1][2] == "blanco" && cubo.caraAmarilla[1][2] == "blanco") {
            cubo.girar("amarilla", "antihorario");
            cubo.girar("naranja", "antihorario");
            cubo.girar("naranja", "antihorario");
          } else


            //Comprobar si hay piezas blancas en las caras azul rojo verde y naranja y pasarlas a la cara amarilla.
            if (cubo.caraAzul[1][0] == "blanco" && cubo.caraAmarilla[1][0] != "blanco") {
              cubo.girar("roja", "horario");
            } else if (cubo.caraAzul[1][0] == "blanco" && cubo.caraAmarilla[1][0] == "blanco") {
              while (cubo.caraAmarilla[1][0] == "blanco") {
                cubo.girar("amarilla", "horario");
              }
              cubo.girar("roja", "horario");
            } else

              if (cubo.caraAzul[1][2] == "blanco" && cubo.caraAmarilla[1][2] != "blanco") {
                cubo.girar("naranja", "antihorario");
              } else if (cubo.caraAzul[1][2] == "blanco" && cubo.caraAmarilla[1][2] == "blanco") {
                while (cubo.caraAmarilla[1][2] == "blanco") {
                  cubo.girar("amarilla", "horario");
                }
                cubo.girar("naranja", "antihorario");
              } else

                if (cubo.caraNaranja[1][0] == "blanco" && cubo.caraAmarilla[0][1] != "blanco") {
                  cubo.girar("azul", "horario");
                } else if (cubo.caraNaranja[1][0] == "blanco" && cubo.caraAmarilla[0][1] == "blanco") {
                  while (cubo.caraAmarilla[0][1] == "blanco") {
                    cubo.girar("amarilla", "horario");
                  }
                  cubo.girar("azul", "horario");
                } else

                  if (cubo.caraNaranja[1][2] == "blanco" && cubo.caraAmarilla[2][1] != "blanco") {
                    cubo.girar("verde", "antihorario");
                  } else if (cubo.caraNaranja[1][2] == "blanco" && cubo.caraAmarilla[2][1] == "blanco") {
                    while (cubo.caraAmarilla[2][1] == "blanco") {
                      cubo.girar("amarilla", "horario");
                    }
                    cubo.girar("verde", "antihorario");
                  } else

                    if (cubo.caraVerde[1][0] == "blanco" && cubo.caraAmarilla[1][2] != "blanco") {
                      cubo.girar("naranja", "horario");
                    } else if (cubo.caraVerde[1][0] == "blanco" && cubo.caraAmarilla[1][2] == "blanco") {
                      while (cubo.caraAmarilla[1][2] == "blanco") {
                        cubo.girar("amarilla", "horario");
                      }
                      cubo.girar("naranja", "horario");
                    } else

                      if (cubo.caraVerde[1][2] == "blanco" && cubo.caraAmarilla[0][1] != "blanco") {
                        cubo.girar("roja", "antihorario");
                      } else if (cubo.caraVerde[1][2] == "blanco" && cubo.caraAmarilla[0][1] == "blanco") {
                        while (cubo.caraAmarilla[0][1] == "blanco") {
                          cubo.girar("amarilla", "horario");
                        }
                        cubo.girar("roja", "antihorario");
                      } else

                        if (cubo.caraRoja[1][0] == "blanco" && cubo.caraAmarilla[2][1] != "blanco") {
                          cubo.girar("verde", "horario");
                        } else if (cubo.caraRoja[1][0] == "blanco" && cubo.caraAmarilla[2][1] == "blanco") {
                          while (cubo.caraAmarilla[2][1] == "blanco") {
                            cubo.girar("amarilla", "horario");
                          }
                          cubo.girar("verde", "horario");
                        } else

                          if (cubo.caraRoja[1][2] == "blanco" && cubo.caraAmarilla[0][1] != "blanco") {
                            cubo.girar("azul", "antihorario");
                          } else if (cubo.caraRoja[1][2] == "blanco" && cubo.caraAmarilla[0][1] == "blanco") {
                            while (cubo.caraAmarilla[0][1] == "blanco") {
                              cubo.girar("amarilla", "horario");
                            }
                            cubo.girar("azul", "antihorario");
                          } else

                            //Si las piezas blancas estan justo encima de las piezas del medio de las caras
                            if (cubo.caraAzul[0][1] == "blanco") {
                              cubo.girar("azul", "antihorario");
                              while (cubo.caraAmarilla[1][0] == "blanco") {
                                cubo.girar("amarilla", "horario");
                              }
                              cubo.girar("roja", "horario");
                            } else if (cubo.caraAzul[2][1] == "blanco") {
                              cubo.girar("azul", "horario");
                              while (cubo.caraAmarilla[1][0] == "blanco") {
                                cubo.girar("amarilla", "horario");
                              }
                              cubo.girar("roja", "horario");
                            }
                            else if (cubo.caraNaranja[0][1] == "blanco") {
                              cubo.girar("naranja", "antihorario");
                              while (cubo.caraAmarilla[0][1] == "blanco") {
                                cubo.girar("amarilla", "horario");
                              }
                              cubo.girar("azul", "horario");
                            } else if (cubo.caraNaranja[2][1] == "blanco") {
                              cubo.girar("naranja", "horario");
                              while (cubo.caraAmarilla[0][1] == "blanco") {
                                cubo.girar("amarilla", "horario");
                              }
                              cubo.girar("azul", "horario");
                            }
                            else if (cubo.caraVerde[0][1] == "blanco") {
                              cubo.girar("verde", "antihorario");
                              while (cubo.caraAmarilla[1][2] == "blanco") {
                                cubo.girar("amarilla", "horario");
                              }
                              cubo.girar("naranja", "horario");
                            } else if (cubo.caraVerde[2][1] == "blanco") {
                              cubo.girar("verde", "horario");
                              while (cubo.caraAmarilla[1][2] == "blanco") {
                                cubo.girar("amarilla", "horario");
                              }
                              cubo.girar("naranja", "horario");
                            }
                            else if (cubo.caraRoja[0][1] == "blanco") {
                              cubo.girar("roja", "antihorario");
                              while (cubo.caraAmarilla[2][1] == "blanco") {
                                cubo.girar("amarilla", "horario");
                              }
                              cubo.girar("verde", "horario");
                            } else if (cubo.caraRoja[2][1] == "blanco") {
                              cubo.girar("roja", "horario");
                              while (cubo.caraAmarilla[2][1] == "blanco") {
                                cubo.girar("amarilla", "horario");
                              }
                              cubo.girar("verde", "horario");
                            }
  }

  comprobarCruzBlancaCaraAmarilla() {
    if (cubo.caraAmarilla[0][1] == "blanco" && cubo.caraAmarilla[1][0] == "blanco" && cubo.caraAmarilla[1][2] == "blanco" && cubo.caraAmarilla[2][1] == "blanco") {
      bolComprobarCruzBlancaCaraAmarilla = true;;
    }
  }

  cruzBlancaCaraBlanca() {
    if (cubo.caraAzul[2][1] == "naranja" && cubo.caraAmarilla[0][1] == "blanco") {
      cubo.girar("amarilla", "horario"); cubo.girar("naranja", "antihorario"); cubo.girar("naranja", "antihorario");
    } else
      if (cubo.caraAzul[2][1] == "azul" && cubo.caraAmarilla[0][1] == "blanco") {
        cubo.girar("azul", "antihorario"); cubo.girar("azul", "antihorario");
      } else
        if (cubo.caraAzul[2][1] == "rojo" && cubo.caraAmarilla[0][1] == "blanco") {
          cubo.girar("amarilla", "antihorario"); cubo.girar("roja", "antihorario"); cubo.girar("roja", "antihorario");
        } else
          if (cubo.caraAzul[2][1] == "verde" && cubo.caraAmarilla[0][1] == "blanco") {
            cubo.girar("amarilla", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("verde", "antihorario"); cubo.girar("verde", "antihorario");
          } else
            cubo.girar("amarilla", "antihorario");
  }

  comprobarCruzBlancaCaraBlanca() {
    if (cubo.caraBlanca[0][1] == "blanco" && cubo.caraBlanca[1][0] == "blanco" && cubo.caraBlanca[1][2] == "blanco" && cubo.caraBlanca[2][1] == "blanco") {
      bolCruzBlancaCaraBlanca = true;
    }
  }

  caraBlancaCompleta() {

    if (cubo.caraAzul[2][2] == "blanco") {
      let colorAsociado = cubo.caraNaranja[2][0];
      if (colorAsociado == "naranja") {
        cubo.girar("amarilla", "antihorario"); cubo.girar("naranja", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("naranja", "horario");
      } else if (colorAsociado == "verde") {
        cubo.girar("verde", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("verde", "horario");
      } else if (colorAsociado == "rojo") {
        cubo.girar("amarilla", "horario"); cubo.girar("roja", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("roja", "horario");
      } else if (colorAsociado == "azul") {
        cubo.girar("amarilla", "horario"); cubo.girar("amarilla", "horario"); cubo.girar("azul", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("azul", "horario");
      }
    } else if (cubo.caraAzul[2][0] == "blanco") {
      let colorAsociado2 = cubo.caraRoja[2][2];
      if (colorAsociado2 == "azul") {
        cubo.girar("amarilla", "horario"); cubo.girar("naranja", "antihorario"); cubo.girar("amarillo", "antihorario"); cubo.girar("naranja", "horario");
      } else if (colorAsociado2 == "rojo") {
        cubo.girar("azul", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("azul", "horario");
      } else if (colorAsociado2 == "verde") {
        cubo.girar("amarilla", "antihorario"); cubo.girar("roja", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("roja", "horario");
      } else if (colorAsociado2 == "naranja") {
        cubo.girar("amarilla", "horario"); cubo.girar("amarilla", "horario"); cubo.girar("verde", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("verde", "horario");
      }
    } else {
      //Si se queda estancado... probar para el otro lado
      if (random(1) > 0.5) {
        cubo.girar("amarilla", "horario");
      } else {
        cubo.girar("amarilla", "antihorario");
      }


      //Si no hay blancas en la fila inferior...
      if (cubo.caraAzul[2][2] != "blanco" && cubo.caraAzul[2][0] != "blanco") {
        //Quitar piezas blancas que estan en la fila superior pero mal colocadas.
        if (cubo.caraAzul[0][2] != "azul" || cubo.caraBlanca[2][2] != "blanco") {
          cubo.girar("naranja", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("naranja", "horario");
        } else if (cubo.caraNaranja[0][2] != "naranja" || cubo.caraBlanca[0][2] != "blanco") {
          cubo.girar("verde", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("verde", "horario");
        } else if (cubo.caraVerde[0][2] != "verde" || cubo.caraBlanca[0][0] != "blanco") {
          cubo.girar("roja", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("roja", "horario");
        } else if (cubo.caraRoja[0][2] != "rojo" || cubo.caraBlanca[2][0] != "blanco") {
          cubo.girar("azul", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("azul", "horario");
        }
      } else

        //Si hay blancas en la cara amarilla...
        if (cubo.caraAmarilla[0][2] == "blanco") {
          let colorAsociado3 = cubo.caraAzul[2][2];
          if (colorAsociado3 == "verde") {
            cubo.girar("amarilla", "horario"); cubo.girar("verde", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("verde", "horario");
          } else if (colorAsociado3 == "rojo") {
            cubo.girar("amarilla", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("roja", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("roja", "horario");
          } else if (colorAsociado3 == "azul") {
            cubo.girar("amarillo", "antihorario"); cubo.girar("azul", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("azul", "horario");
          } else if (colorAsociado3 == "naranja") {
            cubo.girar("naranja", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("naranja", "horario");
          }
        }
    }
  }

  comprobarCaraBlancaCompleta() {
    let toret = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (cubo.caraBlanca[i][j] != "blanco") {
          toret = false;
        }
      }
    }
    bolComprobarCaraBlancaCompleta = toret;
  }

  dosFilas() {
    if (cubo.caraAmarilla[0][1] == "rojo" && cubo.caraAzul[2][1] == "azul") {
      cubo.girar("amarilla", "horario"); cubo.girar("roja", "horario"); cubo.girar("amarilla", "antihorario"); cubo.girar("roja", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("azul", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("azul", "horario");
    } else if (cubo.caraAmarilla[1][0] == "azul" && cubo.caraRoja[2][1] == "rojo") {
      cubo.girar("amarilla", "antihorario"); cubo.girar("azul", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("azul", "horario"); cubo.girar("amarilla", "horario"); cubo.girar("roja", "horario"); cubo.girar("amarilla", "antihorario"); cubo.girar("roja", "antihorario");
    } else if (cubo.caraAmarilla[1][2] == "azul" && cubo.caraNaranja[2][1] == "naranja") {
      cubo.girar("amarilla", "horario"); cubo.girar("azul", "horario"); cubo.girar("amarilla", "antihorario"); cubo.girar("azul", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("naranja", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("naranja", "horario");
    } else if (cubo.caraAmarilla[0][1] == "naranja" && cubo.caraAzul[2][1] == "azul") {
      cubo.girar("amarilla", "antihorario"); cubo.girar("naranja", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("naranja", "horario"); cubo.girar("amarilla", "horario"); cubo.girar("azul", "horario"); cubo.girar("amarilla", "antihorario"); cubo.girar("azul", "antihorario");
    } else if (cubo.caraAmarilla[2][1] == "naranja" && cubo.caraVerde[2][1] == "verde") {
      cubo.girar("amarilla", "horario"); cubo.girar("naranja", "horario"); cubo.girar("amarilla", "antihorario"); cubo.girar("naranja", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("verde", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("verde", "horario");
    } else if (cubo.caraAmarilla[1][2] == "verde" && cubo.caraNaranja[2][1] == "naranja") {
      cubo.girar("amarilla", "antihorario"); cubo.girar("verde", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("verde", "horario"); cubo.girar("amarilla", "horario"); cubo.girar("naranja", "horario"); cubo.girar("amarilla", "antihorario"); cubo.girar("naranja", "antihorario");
    } else if (cubo.caraAmarilla[1][0] == "verde" && cubo.caraRoja[2][1] == "rojo") {
      cubo.girar("amarilla", "horario"); cubo.girar("verde", "horario"); cubo.girar("amarilla", "antihorario"); cubo.girar("verde", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("roja", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("roja", "horario");
    } else if (cubo.caraAmarilla[2][1] == "rojo" && cubo.caraVerde[2][1] == "verde") {
      cubo.girar("amarilla", "antihorario"); cubo.girar("roja", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("roja", "horario"); cubo.girar("amarilla", "horario"); cubo.girar("verde", "horario"); cubo.girar("amarilla", "antihorario"); cubo.girar("verde", "antihorario");
    } else {
      cubo.girar("amarilla", "horario");
      //Si estan colocadas mal en el medio...
      if (cubo.caraVerde[1][2] != "verde" && cubo.caraRoja[1][0] != "rojo") {
        cubo.girar("amarilla", "horario"); cubo.girar("verde", "horario"); cubo.girar("amarilla", "antihorario"); cubo.girar("verde", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("roja", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("roja", "horario");
      } else if (cubo.caraRoja[1][2] != "rojo" && cubo.caraAzul[1][0] != "azul") {
        cubo.girar("amarilla", "horario"); cubo.girar("roja", "horario"); cubo.girar("amarilla", "antihorario"); cubo.girar("roja", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("azul", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("azul", "horario");
      } else if (cubo.caraAzul[1][2] != "azul" && cubo.caraNaranja[1][0] != "naranja") {
        cubo.girar("amarilla", "horario"); cubo.girar("azul", "horario"); cubo.girar("amarilla", "antihorario"); cubo.girar("azul", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("naranja", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("naranja", "horario");
      } else if (cubo.caraNaranja[1][2] != "naranja" && cubo.caraVerde[1][0] != "verde") {
        cubo.girar("amarilla", "horario"); cubo.girar("naranja", "horario"); cubo.girar("amarilla", "antihorario"); cubo.girar("naranja", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("verde", "antihorario"); cubo.girar("amarilla", "horario"); cubo.girar("verde", "horario");
      }
    }
  }

  comprobarDosFilas() {
    let toret = true;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
        if (cubo.caraAzul[i][j] != "azul" || cubo.caraNaranja[i][j] != "naranja" || cubo.caraVerde[i][j] != "verde" || cubo.caraRoja[i][j] != "rojo") {
          toret = false;
        }
      }
    }
    bolComprobarDosFilas = toret;
  }

  resolverL() {
    if (cubo.caraAmarilla[0][1] == "amarillo" && cubo.caraAmarilla[1][0] == "amarillo" && cubo.caraAmarilla[1][2] == "amarillo" && cubo.caraAmarilla[2][1] == "amarillo") {
      //Si ya está la cruz, no hacer nada
      bolCruzAmarilla = true;
      bolComprobarLineaAmarilla = true;
    } else if (cubo.caraAmarilla[0][1] == "amarillo" && cubo.caraAmarilla[1][0] == "amarillo") {
      cubo.girar("azul", "horario"); cubo.girar("roja", "horario"); cubo.girar("amarilla", "horario"); cubo.girar("roja", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("azul", "antihorario");
      bolComprobarL = true;
    } else {
      cubo.girar("amarilla", "antihorario");
    }
  }

  resolverLineaAmarilla() {
    this.resolverL();
    if (!bolComprobarL) {
      cubo.girar("azul", "horario"); cubo.girar("roja", "horario"); cubo.girar("amarilla", "horario"); cubo.girar("roja", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("azul", "antihorario");
    }
    if (cubo.caraAmarilla[1][0] == "amarillo" && cubo.caraAmarilla[1][2] == "amarillo") {
      cubo.girar("azul", "horario"); cubo.girar("roja", "horario"); cubo.girar("amarilla", "horario"); cubo.girar("roja", "antihorario"); cubo.girar("amarilla", "antihorario"); cubo.girar("azul", "antihorario");
      bolComprobarLineaAmarilla = true;
    }
  }

  comprobarCruzAmarilla() {
    if (cubo.caraAmarilla[0][1] == "amarillo" && cubo.caraAmarilla[1][0] == "amarillo" && cubo.caraAmarilla[1][2] == "amarillo" && cubo.caraAmarilla[2][1] == "amarillo") {
      bolCruzAmarilla = true;
    }
  }

}