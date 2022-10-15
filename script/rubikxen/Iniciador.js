class Iniciador {
  constructor(cubo) {
    this.cubo = cubo;
    this.coloresValidos = false;
  }

  getColor(color) {
    if (color == "blanco") return "#FFFFFF";
    if (color == "rojo") return "#FF0000";
    if (color == "verde") return "#00FF00";
    if (color == "azul") return "#0000FF";
    if (color == "amarillo") return "#FFFF00";
    if (color == "naranja") return "#FF7700";
    if (color == "purpura") return "#7D2181";
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

    stroke(50);

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
    botonGuardar = createButton('Guardar y empezar a generar!');
    botonGuardar.mousePressed(this.guardarClicado);
  }

  guardarClicado() {
    botonGuardarClicado = true;
  }

  comprobarColoresValidos() {
    this.coloresValidos = true;

    for (let i = 0; i < 3; i++) {
      for (let m = 0; m < 3; m++) {
        if (cubo.caraAzul[i][m] == "purpura") this.coloresValidos = false;
        if (cubo.caraNaranja[i][m] == "purpura") this.coloresValidos = false;
        if (cubo.caraRoja[i][m] == "purpura") this.coloresValidos = false;
        if (cubo.caraVerde[i][m] == "purpura") this.coloresValidos = false;
        if (cubo.caraBlanca[i][m] == "purpura") this.coloresValidos = false;
        if (cubo.caraAmarilla[i][m] == "purpura") this.coloresValidos = false;
      }
    }

    if (this.coloresValidos) {
      botonGuardar.hide();
      botonRandom.hide();
    }
  }

  botonRandomizar() {
    botonRandom = createButton('Randomizar');
    botonRandom.mousePressed(this.randomizarCubo);
  }

  randomizarCubo() {
    cubo.cuboResuelto();
    this.coloresValidos = true;
    botonRandomizarClicado = true;
    cubo.randomizar();
  }

}//fin clase Iniciador