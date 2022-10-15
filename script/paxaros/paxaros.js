let bandada;
let meta;
let mutationRate;
let sliderMutationRate;
let totalPaxaros;
let sliderTotalPaxaros;

function setup(){
  createCanvas(800,800);
  bandada = new Bandada(1000);//HABER HAI 1000 paxaros, pero so se mostran os que aparecen no slider
  meta = createVector(800,400);
  mutationRate = 0.2;
  sliderMutationRate = createSlider(0, 100, 20);
  sliderMutationRate.position(130,45);
  sliderMutationRate.style('width', '150px');
  totalPaxaros = 100;
  sliderTotalPaxaros = createSlider(2,1000,200);
  sliderTotalPaxaros.position(130,65);
  sliderTotalPaxaros.style('width', '200px');
  
}

function draw(){
  background(240);
  bandada.mostrar();
  bandada.actualizar();
  
  if(bandada.cuantosMortos() >= bandada.paxaros.length){
    bandada.generacion++;
    bandada.numeroMortos = 0;
    bandada.novaGeneracion();
  }
  
  
  mutationRate = sliderMutationRate.value()/100;
  totalPaxaros = sliderTotalPaxaros.value();
  fill(255,0,0);
  ellipse(meta.x, meta.y, 20, 20);
  fill(0);
  text("Generacion: " + bandada.generacion, 20, 40);
  text("MutationRate: " + mutationRate, 20, 60);
  text("Total paxaros: " + totalPaxaros,20, 80);
  text("Esto básase en algoritmos xenéticos. Os 'paxaros' (xD) teñen como xenes unhos vectores, que indica a posicion seguinte a que deven avanzar.", 20, 100);
  text("O mellor paxaro, o verde, é o que mais se acerca a meta, o punto vermello. Este vai a ser o pai da seguinte xeración.",20,120);
  text("A seguinte xeración terá os mesmos vectores que o pai, pero mutados aleatoriamente, mediante o factor MutationRate. ale, adios.", 20, 140);
}

//---------------------------------------------------------------------------------------------------------------------------
class Paxaro{

  
  //Constructor ------------------------------------------
  constructor(arrayVectores){
    this.posicion = createVector(50, height/2);
    this.numVectores = 300;
    this.vectores = [];
    if(arrayVectores == 'Undefined'){
      this.vectores = new Array(this.numVectores);
      for(let i = 0; i < this.numVectores; i++){
        this.vectores[i] = this.vectorRandom();
      }
    }else{
      this.vectores = arrayVectores;
    }
    this.indice = 0;
    this.morto = false;
    this.mellorPaxaro = false;
  }
  
  
  //------------------------------------------------------
  //Devolve un vector random con magnitude 10.
  //Primeiro crease un vector random, normalizase e multiplicase por 10.
  vectorRandom(){
    let toret = createVector( random(-20,20), random(-20,20));
    //Normalizar o vector random anterior.
    let magnitud = sqrt(toret.x * toret.x + toret.y * toret.y);

    toret.x = toret.x / magnitud;
    toret.y = toret.y / magnitud;
    
    //Escalalo por 10.
    toret.x = toret.x * 10;
    toret.y = toret.y * 10;

    return toret;
  }
  
  actualizar(){
    if(this.indice < this.numVectores){
      this.posicion.add(this.vectores[this.indice]);
      this.indice++;
    }else{
      this.morto = true;
    }
  }
  
  mostrar(){
    if(this.mellorPaxaro == true){
      fill(0,255,0);
    }else{
      fill(150,100);
    }
    ellipse(this.posicion.x, this.posicion.y, 20, 20);
  }
  
  mutar(){
   //Vanse a mutar (conseguir aleatoriamente) o ¿20%? dos novos genes.
    for(let i = 0; i < this.vectores.length; i++){
      let rand = random(1);
      if(rand <= mutationRate){
        this.vectores[i] = this.vectorRandom();
      }
    }
  }
  
  //------------------------------------------------------
  pintarVectores(num){
    let actual = createVector(50,num);
    for(let i = 0; i < this.vectores.length; i++){
      if(this.mellorPaxaro==true){
        line(actual.x, actual.y, actual.x+this.vectores[i].x, actual.y+this.vectores[i].y);
        actual.add(this.vectores[i].x, this.vectores[i].y);
      }
    }
  }
  
  clonar(){
    let toret;
    toret = new Paxaro();
    toret.vectores = this.clonarVectores();
    return toret;
  }
  
  clonarVectores(){
    let toret = new Array(this.vectores.length);
    for(let i = 0; i < this.vectores.length; i++){
      toret[i] = createVector(this.vectores[i].x, this.vectores[i].y);
    }
    return toret;
  }
  
}

//---------------------------------------------------------------------------------------------------------------------------
class Bandada{
  
  //Constructor
  constructor(num){
    this.numeroMortos = 0;
    this.generacion = 0;
    this.paxaros = new Array(num);
    this.numPaxaros = num;
    for(let i = 0; i < num; i++){
      this.paxaros[i] = new Paxaro('Undefined');
    }
  }
  
  
  actualizar(){
    for(let i = 0; i < totalPaxaros; i++){
      this.paxaros[i].actualizar();
      this.paxaros[i].pintarVectores(height/2);  
  }
    this.mellorPaxaro();
  }
  
  mostrar(){
    for(let i = 0; i < totalPaxaros; i++){
      this.paxaros[i].mostrar();
    }
  }
  
  mellorPaxaro(){
    let minimo = 100000;
    let indiceMellorPaxaro = 0;
    
    for(let i = 0; i < this.numPaxaros; i++){
      this.paxaros[i].mellorPaxaro = false;
      if(minimo > dist(this.paxaros[i].posicion.x, this.paxaros[i].posicion.y, meta.x, meta.y)){
        minimo = dist(this.paxaros[i].posicion.x, this.paxaros[i].posicion.y, meta.x, meta.y);
        indiceMellorPaxaro = i;
      }
    }
    this.paxaros[indiceMellorPaxaro].mellorPaxaro = true;
    line(this.paxaros[indiceMellorPaxaro].posicion.x, this.paxaros[indiceMellorPaxaro].posicion.y, meta.x, meta.y);
  }
  
  novaGeneracion(){
    //Obteñer o mellor paxaro da xeracion actual(o que mais se acerque ao punto)
    let minimo = 100000;
    let pai = null;
    for(let i = 0; i < this.paxaros.length; i++){
      if(minimo > dist(this.paxaros[i].posicion.x, this.paxaros[i].posicion.y, meta.x, meta.y)){
        pai = this.paxaros[i].clonar();
        minimo = dist(this.paxaros[i].posicion.x, this.paxaros[i].posicion.y, meta.x, meta.y);
      }
    }

    //Os novos paxaros van a ter os mesmos vectores co pai, pero mutados un pouco.
    let novos = new Array(this.paxaros.length);
    
    for(let i = 0; i < this.paxaros.length; i++){
      let novosVectores = pai.clonarVectores();
      novos[i] = new Paxaro(novosVectores);
      novos[i].mutar();
    }
    
    this.paxaros = novos;
    
  }
  
  cuantosMortos(){
    for(let i = 0; i < this.paxaros.length; i++){
      if(this.paxaros[i].morto == true){
        this.numeroMortos++;
      }
    }
    return this.numeroMortos;
  }
  
}
//----------------------------------------------------------------------------------------------------
