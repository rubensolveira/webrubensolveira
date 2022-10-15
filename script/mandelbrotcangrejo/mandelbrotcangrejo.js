let valorMinX = -500;
let valorMaxX = 500;
let valorMinY = -500;
let valorMaxY = 500;


//La uso para controlas el render y saber cuando acaba.
//Cuando llega al maximo del pixel width, se deja de computar y se guarda la imagen.
let n = 0;

let imagen;
let guardarImagen = false;

let zoom;

function setup(){
  createCanvas(900,900);
  background(0);
  zoom = 10; // 10, 20, 40, ... 
}

function draw(){

  if (mouseIsPressed){
    background(0);

    let tempValorMinX = valorMinX;
    let tempValorMaxX = valorMaxX;
    let tempValorMinY = valorMinY;
    let tempValorMaxY = valorMaxY;
    
    tempValorMinX = obtenerPuntoXDadoUnPixel(mouseX - width/zoom);
    tempValorMaxX = obtenerPuntoXDadoUnPixel(mouseX + width/zoom);
    tempValorMinY = obtenerPuntoYDadoUnPixel(mouseY + height/zoom);
    tempValorMaxY = obtenerPuntoYDadoUnPixel(mouseY - height/zoom);
    
    valorMinX = tempValorMinX;
    valorMaxX = tempValorMaxX;
    valorMinY = tempValorMinY;
    valorMaxY = tempValorMaxY;
    
    n = 0;
    guardarImagen = false;
  }
  
  pintarPlanoCartesiano();

  //Cuando n llegue a 2.0, se para de computar y se guarda la imagen.
  if (n < width){
    
    //Esto lo hago para que pinte 80 lineas de pixel y no tener que esperar tanto.
    let repite = 0;
    while (repite < 80){
      
      for(let m = 0; m < width; m ++){
        //'n' y 'm' generan todos los puntos del plano con los que la 
        // siguiente función los evalua y los pinta uno a uno.
        mandelbrotCangrejo( obtenerPuntoXDadoUnPixel(n), obtenerPuntoYDadoUnPixel(m) );
      }
      n++;
      repite++;
    }
  
  }else{
    if(guardarImagen == false){
      //save("mandelbrot.jpg");
	  imagen = get();
      guardarImagen = true;
    }
    //img = loadImage("mandelbrot.jpg");
    background(imagen);
    
    fill(255,100);
    rect( mouseX - width/zoom, mouseY - height/zoom, width/(zoom/2), height/(zoom/2) );
    fill(255,0,0);
    text( "w1= " + obtenerPuntoXDadoUnPixel(mouseX - width/zoom), mouseX - width/zoom, mouseY);
    text( "w2= " + obtenerPuntoXDadoUnPixel(mouseX + width/zoom), mouseX + width/zoom, mouseY);
    text( "v1= " + obtenerPuntoYDadoUnPixel(mouseY - height/zoom), mouseX, mouseY - height/zoom);
    text( "v2= " + obtenerPuntoYDadoUnPixel(mouseY + height/zoom), mouseX, mouseY + height/zoom);
  }

}


function pintarPlanoCartesiano(){
  line(0, height/2, width, height/2);  //Linea x
  line(width/2, 0, width/2, height);   //Linea y
  
  //Pintar valor de los ejes, 40 valores.
  let corte = width / 20;
  for(let i = 0; i <= width; i += corte){
    fill(200,100,255);
    ellipse(obtenerPixelXDadoUnPunto(obtenerPuntoXDadoUnPixel(i)),
            obtenerPixelYDadoUnPunto(obtenerPuntoYDadoUnPixel(height/2)),
            4, 4); // EjeX
    fill(200,100,255);
    ellipse(obtenerPixelXDadoUnPunto(obtenerPuntoXDadoUnPixel(width/2)),
            obtenerPixelYDadoUnPunto(obtenerPuntoYDadoUnPixel(i)),
            4, 4);  //EjeY
    fill(200,100,255);
    text( obtenerPuntoXDadoUnPixel(i),
          obtenerPixelXDadoUnPunto(obtenerPuntoXDadoUnPixel(i)),
          obtenerPixelYDadoUnPunto(obtenerPuntoYDadoUnPixel(height/2)) ); // Texto ejeX
    fill(200,100,255);
    text( obtenerPuntoYDadoUnPixel(i),
          obtenerPixelXDadoUnPunto(obtenerPuntoXDadoUnPixel(width/2)),
          obtenerPixelYDadoUnPunto(obtenerPuntoYDadoUnPixel(i)) ); // Texto ejeY
  }
}


//Estas  funciones obtienen el valor dependiendo de donde se situe el raton.
function obtenerPuntoXDadoPixelRaton(){
  return map(mouseX, 0, width, valorMinX, valorMaxX);
}
function obtenerPuntoYDadoPixelRaton(){
  return map(mouseY, 0, height, valorMaxY, valorMinY);
}

function obtenerPuntoXDadoUnPixel(pixel){
  return map(pixel, 0, width, valorMinX, valorMaxX);
}
function obtenerPuntoYDadoUnPixel(pixel){
  return map(pixel, 0, height, valorMaxY, valorMinY);
}

//Estas 2 funciones devuelven el pixel
function obtenerPixelXDadoUnPunto(punto){
  return map(punto, valorMinX, valorMaxX, 0, width);
}
function obtenerPixelYDadoUnPunto(punto){
  return map(punto, valorMaxY, valorMinY, 0, height);
}


function pintarPunto(puntox, puntoy){
  puntox = obtenerPixelXDadoUnPunto(puntox);
  puntoy = obtenerPixelYDadoUnPunto(puntoy);
  ellipse(puntox, puntoy, 5, 5);
}


function mandelbrotCangrejo(ca, cb){
  let totalA = 1;//Real
  let totalB = -1;//Imaginario
  let contador = 0;//Para parar si se llega al infinito. Tambien para el color.
  
  for(let i = 0; i < 100; i++){

    let aa = totalA * totalA - totalB * totalB;
    let bb = 2 * totalA * totalB;

    let sinhaa = (Math.cos(bb) * ((Math.exp(aa) - Math.exp(-aa)) / 2));
    let sinhbb = (Math.sin(bb) * ((Math.exp(aa) + Math.exp(-aa)) / 2));

    let unoentreca = ca / (ca*ca + cb*cb);
    let unoentrecb = cb / (ca*ca + cb*cb);
     
    totalA = sinhaa + unoentreca;
    totalB = sinhbb + unoentrecb;
    
    //Considero que el infinito es el numero 20000.
    //Si alguno de los de los valores alcanzan el infinito al hacer las operaciones, se sale del bucle.
    //Con esto se consigue que los números que antes lleguen al infinito se queden más oscuros
    //y los que convergen (no alcanzan el infinito) se pinten más blancos.
    if( (totalA > -3000000 && totalA < 3000000) || (totalB > -3000000 && totalB < 3000000) ){
      contador += 2.5;
    } else{
      break;
    }
    
  }
  
    //Pintar un solo pixel al acabar, es el pixel original con el que se empezó a
    //hacer los calculos, para ver si diverge o converge.
    stroke(contador);
    point( obtenerPixelXDadoUnPunto(ca), obtenerPixelYDadoUnPunto(cb) );
}