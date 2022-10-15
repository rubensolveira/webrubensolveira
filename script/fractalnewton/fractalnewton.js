let valorMinX = -3;
let valorMaxX = 3;
let valorMinY = -3;
let valorMaxY = 3;

//La uso para controlas el render y saber cuando acaba.
//Cuando llega al maximo del pixel width, se deja de computar y se guarda la imagen.
let n = 0;

let imagen;
let guardarImagen = false;

let zoom;

function setup(){
  createCanvas(800,800);
  background(0);
  zoom = 10;
}

function draw(){
  
  //Si se hace click, zoom.
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
  //fractalMetodoNewton( obtenerPuntoXDadoPixelRaton(), obtenerPuntoYDadoPixelRaton() );
  
  if (n < width){
    
    //Esto lo hago para que pinte 80 lineas de pixel y no tener que esperar tanto.
    let repite = 0;
    while (repite < 80){
      for(let m = 0; m < width; m ++){
        //'n' y 'm' generan todos los puntos del plano con los que la 
        // siguiente función los evalua y los pinta uno a uno.
        fractalMetodoNewton( obtenerPuntoXDadoUnPixel(n), obtenerPuntoYDadoUnPixel(m) );
      }
      n++;
      repite++;
    }
    
  } else {
    if(guardarImagen == false){
      //save("fractalNewton.jpg");
	  imagen = get();
      guardarImagen = true;
    }
    //img = loadImage("fractalNewton.jpg");
    background(imagen);
    fractalMetodoNewtonRaton( obtenerPuntoXDadoPixelRaton(), obtenerPuntoYDadoPixelRaton() );
    fill(255,100);
    rect( mouseX - width/zoom, mouseY - height/zoom, width/(zoom/2), height/(zoom/2) );
    fill(255,0,0);
    textSize(9);
    text( "w1= " + str(obtenerPuntoXDadoUnPixel(mouseX - width/zoom)).substring(0,5), mouseX - width/zoom, mouseY);
    text( "w2= " + str(obtenerPuntoXDadoUnPixel(mouseX + width/zoom)).substring(0,5), mouseX + width/zoom, mouseY);
    text( "v1= " + str(obtenerPuntoYDadoUnPixel(mouseY - height/zoom)).substring(0,5), mouseX, mouseY - height/zoom);
    text( "v2= " + str(obtenerPuntoYDadoUnPixel(mouseY + height/zoom)).substring(0,5), mouseX, mouseY + height/zoom);
   }
}


//f(z) = z ^ 5 - 1 
//más desarrollado:
//f(a+bi) = (a+bi)^5 - 1
//Se utiliza el método de newton pero con función compleja
//(a+bi)n+1 = (a+bi)n - (f(a+bi)n / f'(a+bi)n)
//Como argumento de esta función se pasarán todos los puntos del plano.
function fractalMetodoNewton(a0,b0){
  let contador = 0; //Para controlar el color
  let contadorIteraciones = 0;
  let an = a0; // es la parte real del numero complejo
  let bn = b0; // es la parte imaginaria del numero complejo
  
  for(let iteracion = 0; iteracion < 30; iteracion++){
    //f(a+bi) = (a+bi)^10 - 1
    //(a+bi)^10 => (a^10 - 45*a^8 *b^2 + 210*a^6 *b^4 - 210*a^4 *b^6 + 45*a^2 * b^8 - b^10)  +  i*(10*a^9 *b + 10*a*b^9 - 120*a^3 *b^7 - 120*a^7 *b^3 + 252*a^5 *b^5)
    //let fa = (pow(an,10) - 45*pow(an,8)*bn*bn + 210*pow(an,6)*pow(bn,4) - 210*pow(an,4)*pow(bn,6) + 45*an*an*pow(bn,8) - pow(bn,10) ) -1; //Es la parte real del resultado de la funcion compleja
    //let fb = 10*pow(an,9)*bn + 10*an*pow(bn,9) - 120*pow(an,3)*pow(bn,7) - 120*pow(an,7)*pow(bn,3) + 252*pow(an,5)*pow(bn,5); //Es la parte imaginaria del resultado de la función compleja.
    
    //fd(a+bi) = 10*(a+bi)^9. Es la función derivada.
    //(a+bi)^9 => (a^9 - 36*a^7 *b^2 + 126*a^5 *b^4 - 84*a^3 *b^6 + 9*a*b^8)  +  i(b^9 + 126*a^4 *b^5 - 36*a^2 *b^7 - 84*a^6 *b^3 + 9*a^8 *b)
    //let fda = 10 * ( pow(an,9) - 36*pow(an,7)*pow(bn,2) + 126*pow(an,5)*pow(bn,4) -84*pow(an,3)*pow(bn,6) + 9*an*pow(bn,8) ); //Parte real de la derivada de funcion compleja
    //let fdb = 10 * ( pow(bn,9) + 126*pow(an,4)*pow(bn,5) - 36*pow(an,2)*pow(bn,7) - 84*pow(an,6)*pow(bn,3) + 9*pow(an,8)*bn ); //Parte imaginaria de la derivada de funcion compleja

    let fa = (pow(an,5) - 10*pow(an,3)*bn*bn + 5*an*pow(bn,4)) -1; //Es la parte real del resultado de la funcion compleja
    let fb = pow(bn,5) - 10*pow(an,2)*pow(bn,3) + 5*pow(an,4)*bn; //Es la parte imaginaria del resultado de la función compleja.
    
    let fda = 5 * ( pow(an,4) - 6*an*an*bn*bn + pow(bn,4) ); //Parte real de la derivada de funcion compleja
    let fdb = 5 * ( 4*pow(an,3)*bn - 4*an*pow(bn,3) ); //Parte imaginaria de la derivada de funcion compleja

    //Aqui hai que APLICAR PROPIEDAD DE DIVISION de dos numeros complejos    
    let diva = (fa * fda + fb * fdb) / (fda * fda + fdb * fdb); //Division de la funcion entre la funcion derivada, que da la parte real
    let divb = (fb * fda - fa * fdb) / (fda * fda + fdb * fdb); //Division de la funcion entre la funcion derivada, que da la parte imaginaria
    
    let an1 = an - diva; //restar la parte real con el resultado real de la division
    let bn1 = bn - divb; //restar la parte imaginaria con el resultado imaginario de la division.
    
    //El calculo del metodo de newton para   f(a+bi)= (a+bi)^5 - 1   con todos los pasos y tal sería este:
    //                           fa=(( an * an * an) - ( 3 * an * bn * bn) -1)   fb=(( 3 * an * an * bn) - ( bn * bn * bn)) 
    //(an1 + bn1) = (an + bn) -  ------------------------------------------------------------------------------------------
    //                           fda=( 3 * ( an * an - bn * bn))   fdb=( 3 * ( 2 * an * bn)) 
          
    
    let modulon = sqrt(an*an + bn*bn); //Modulo del punto anterior
    let modulon1 = sqrt(an1*an1 + bn1*bn1); //Modulo del punto actual
    
    //Si el resto entre los modulos de los 2 puntos es muy pequeño significa
    // que el punto converge, y se rompe el bucle.
    //Si el resto no es muy pequeño, pues no converge, y se pinta más blanco.
    if( abs(modulon - modulon1) > 0.0000001 ){
      contador += 8;
      contadorIteraciones++;
    }else{
      break;
    }
    
    an = an1;
    bn = bn1;
  }
  
  stroke(contador);
  point( obtenerPixelXDadoUnPunto(a0), obtenerPixelYDadoUnPunto(b0) );
}


//f(z) = z ^ 5 - 1 
//Este pinta las lineas dependiendo de donde se situe el raton.
function fractalMetodoNewtonRaton(a0, b0){
  let contadorIteraciones = 0;
  let an = a0;
  let bn = b0;
  
  for(let iteracion = 0; iteracion < 30; iteracion++){
    let fa = (pow(an,5) - 10*pow(an,3)*bn*bn + 5*an*pow(bn,4)) -1; //Es la parte real del resultado de la funcion compleja
    let fb = pow(bn,5) - 10*pow(an,2)*pow(bn,3) + 5*pow(an,4)*bn; //Es la parte imaginaria del resultado de la función compleja.
    
    let fda = 5 * ( pow(an,4) - 6*an*an*bn*bn + pow(bn,4)); //Parte real de la derivada de funcion compleja
    let fdb = 5 * ( 4*pow(an,3)*bn - 4*an*pow(bn,3)); //Parte imaginaria de la derivada de funcion compleja

    let diva = (fa * fda + fb * fdb) / (fda * fda + fdb * fdb);
    let divb = (fb * fda - fa * fdb) / (fda * fda + fdb * fdb);
    
    let an1 = an - diva;
    let bn1 = bn - divb;
    
    let modulon = sqrt(an*an + bn*bn);
    let modulon1 = sqrt(an1*an1 + bn1*bn1);
    
    //Si el resto entre los modulos de los 2 puntos es muy pequeño significa
    // que el punto converge, y se rompe el bucle.
    //Si el resto no es muy pequeño, pues no converge, y se pinta más blanco.
    if( abs(modulon - modulon1) > 0.0000001 ){
      contadorIteraciones++;
      stroke(255,0,0);
      line( obtenerPixelXDadoUnPunto(an), obtenerPixelYDadoUnPunto(bn),
            obtenerPixelXDadoUnPunto(an1), obtenerPixelYDadoUnPunto(bn1) );
      if(iteracion == 49){ //Que el ultimo circulo sea mas gordo.
         ellipse(obtenerPixelXDadoUnPunto(an), obtenerPixelYDadoUnPunto(bn), 11, 11);
      }else{
        ellipse(obtenerPixelXDadoUnPunto(an), obtenerPixelYDadoUnPunto(bn), 6, 6);
      }
    }else{
      ellipse(obtenerPixelXDadoUnPunto(an), obtenerPixelYDadoUnPunto(bn), 11, 11);
      break;
    }

    an = an1;
    bn = bn1;
  }
  textSize(16);
  text("TOTAL ITERACIONES donde el modulo entre dos puntos es tan pequeño \n"
        + "que se tiene la certeza de que el punto inicial converge: " + contadorIteraciones, 20, 20);
  text("El nivel de blanco indica el numero de iteraciones que se tuvieron que realizar \n"
        + " para comprobar que el punto inicial converge." , 20, height-30);
}


function pintarPlanoCartesiano(){
  stroke(0);
  line(0, height/2, width, height/2);  //Linea x
  line(width/2, 0, width/2, height);   //Linea y
  
  //Pintar valor de los ejes, 40 valores.
  let corte = width / 20;
  for(let i = 0; i <= width; i += corte){
    fill(255,100,100);
    ellipse(obtenerPixelXDadoUnPunto(obtenerPuntoXDadoUnPixel(i)),
            obtenerPixelYDadoUnPunto(obtenerPuntoYDadoUnPixel(height/2)),
            4, 4); // EjeX
    fill(255,100,100);
    ellipse(obtenerPixelXDadoUnPunto(obtenerPuntoXDadoUnPixel(width/2)),
            obtenerPixelYDadoUnPunto(obtenerPuntoYDadoUnPixel(i)),
            4, 4);  //EjeY
            
    textSize(11);        
    fill(0,255,0);
    text( str(obtenerPuntoXDadoUnPixel(i)).substring(0,5),
          obtenerPixelXDadoUnPunto(obtenerPuntoXDadoUnPixel(i)),
          obtenerPixelYDadoUnPunto(obtenerPuntoYDadoUnPixel(height/2)) ); // Valores ejeX
    fill(0,255,0);
    text( str(obtenerPuntoYDadoUnPixel(i)).substring(0,5),
          obtenerPixelXDadoUnPunto(obtenerPuntoXDadoUnPixel(width/2)),
          obtenerPixelYDadoUnPunto(obtenerPuntoYDadoUnPixel(i)) ); // Valores ejeY
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
