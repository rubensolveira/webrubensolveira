// Conjunto Julia
// Pinta el cuadrado del numero complejo anterior y la suma de un numero complejo CONSTANTE.
// Se coge un punto, se hace su cuadrado y se suma la K Constante,
// se itera, si converge se pinta de blanco, si no, de negro.
// c = a + bi (c = numero complejo). PuntoX = a, puntoY = b.
// K = numero complejo constante.
// Se evaluan todos los puntos del plano.
// Donde c, es decir, a y b, son todos los puntos posibles del plano.
// Iterate z = z^2 + k, i.e.
// z(c0) = c^2 + K
// z(c1) = c0^2 + K
// z(c2) = c1^2 + K
// z(c3) = c2^2 + K
// etc.
// *** c*c = (a+bi) * (a+bi) = a^2 - b^2 + 2abi



//Contiene valores desde 0 a numero_pixel(height ó width).
//Se mapea -1,1 -> 0, width ó height.
let _height;
let _width;

//A cuanto mayor valor mas espacio entre puntos entonces mejor rendimiento.
let incrementoPixel = 0.006;

function setup(){
  createCanvas(800,800,P2D);
}

function draw(){
  background(0);
  
  pintarPlanoCartesiano();
  
  fill(200,150,125);
  textSize(26);

  text("k = " + str(obtenerPuntoXDadoPixelRaton()).substring(0,4) + " + " + str(obtenerPuntoYDadoPixelRaton()).substring(0,4) + "i", 110, 110);
  
  fill(255);
  ellipse(mouseX, mouseY, 18, 18)
  //Estos bucles generan todos los valores del plano y lo introducen en la función.
      for(let m = -1.0; m < 1; m += incrementoPixel){
        for(let n = -1.0; n < 1; n += incrementoPixel){
          //Puedo meter la K constante así, o hacerla mediante el raton.
          //conjuntoJulia( n, m, 0.3141592, 0.6141592);
          conjuntoJulia( n, m, obtenerPuntoXDadoPixelRaton(), obtenerPuntoYDadoPixelRaton() );
        }
      }
}


function pintarPlanoCartesiano(){
  line(0, height/2, width, height/2);  //Linea x
  line(width/2, 0, width/2, height);   //Linea y
  
  _height = -1;
  _width = -1;
  
  //Pintar valor de los ejes cada 0.10
  for(let i = -1; i <= 1; i += 0.10){
    _height = map(i, -1.0, 1.0, 0, height);
    _width = map(i, -1.0, 1.0, 0, width);
    ellipse(_width, height/2, 4,4);
    ellipse(width/2, _height,4,4);
    text(str(i).substring(0,4), obtenerPixelXDadoUnPunto(0), obtenerPixelYDadoUnPunto(i));
    //Si el valor es negativo, hacer un recorte, quitar una decima, por que el signo negativo cuenta,
    //y no se ve bien los numeros.
    if(i < 0){
      textSize(10);
      text(str(i).substring(0,4), obtenerPixelXDadoUnPunto(i), obtenerPixelYDadoUnPunto(i/10));
    }else{
      text(str(i).substring(0,3), obtenerPixelXDadoUnPunto(i), obtenerPixelYDadoUnPunto(i/10));
    }
  }
}


//Estas  funciones obtienen el valor -1,1 dependiendo de donde se situe el raton.
function obtenerPuntoXDadoPixelRaton(){
  return map(mouseX, 0, width, -1, 1);
}
function obtenerPuntoYDadoPixelRaton(){
  return map(mouseY, 0, height, 1, -1);
}

function obtenerPuntoXDadoUnPixel(pixel){
  return map(pixel, 0, width, -1, 1);
}
function obtenerPuntoYDadoUnPixel(pixel){
  return map(pixel, 0, height, 1, -1);
}

//Estas 2 funciones devuelven el pixel dependiendo del rango que se meta, -1,1.
function obtenerPixelXDadoUnPunto(punto){
  return map(punto, -1.0, 1.0, 0, width);
}
function obtenerPixelYDadoUnPunto(punto){
  return map(punto, 1.0, -1.0, 0, height);
}


// Conjunto Julia
// Pinta el cuadrado del numero complejo anterior y la suma de un numero complejo CONSTANTE.
// Se coge un punto, se hace su cuadrado y se suma la K Constante,
// se itera, si converge se pinta de blanco, si no, de negro.
// c = a + bi (c = numero complejo). PuntoX = a, puntoY = b.
// K = numero complejo constante.
// Se evaluan todos los puntos del plano.
// Donde c, es decir, a y b, son todos los puntos posibles del plano.
// Iterar z = z^2 + k, i.e.
// z(c0) = c^2 + K
// z(c1) = c0^2 + K
// z(c2) = c1^2 + K
// z(c3) = c2^2 + K
// etc.
// *** c*c = (a+bi) * (a+bi) = a^2 - b^2 + 2abi
function conjuntoJulia(puntoX, puntoY, constanteReal, constanteImaginaria){
  let numeroX = puntoX;//Real
  let numeroY = puntoY;//Imaginario
  let contador1 = 0;//Para parar si se llega al infinito. Y para colores RGB
  let contador2 = 0;
  let contador3 = 0;
  
  for(let i = 0; i < 100; i++){
    let tempX = ((numeroX * numeroX) + (numeroY * numeroY) * -1) + constanteReal; //Real
    let tempY = ((numeroX * numeroY) * 2) + constanteImaginaria; //Imaginario
    
    //Considero que el infinito es el numero 20000.
    //Si alguno de los de los valores alcanzan el infinito al hacer las operaciones, se sale del bucle.
    //Con esto se consigue que los números que antes lleguen al infinito se queden más oscuros
    //y los que convergen (no alcanzan el infinito) se pinten más blancos.
    if( numeroX > 20000 || numeroX < -20000 || numeroY > 20000 || numeroY < -20000 ){
      break;
    } else{
      contador1 += 2.5;
      if( numeroX > -0.5 && numeroX < 0.5){
        contador1 += 9;
      }else if(numeroX > -1 && numeroX < 1){

        contador2 += 9;
      }else{
        contador3 += 9;
      }
    }

    numeroX = tempX;
    numeroY = tempY;
  }
  
    //Pintar un solo pixel al acabar
    //stroke(contador1);
    stroke(contador1, contador2, contador3);
    point( obtenerPixelXDadoUnPunto(puntoX), obtenerPixelYDadoUnPunto(puntoY) );
}