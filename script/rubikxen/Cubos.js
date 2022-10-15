class Cubos {

    /**
     * numCubos - numero de cubos ejecutandose en la generacion
     * cuboModelo - el cubo que se crea por parte del usuario al inicio
     * numGenes - el número de genes (giros) que tiene el cubo en cada generacion
     */
    constructor(numCubos, cuboModelo, numGenes) {
        this.arrayCubos = [];
        this.numCubos = NUMCUBOS;
        this.numCubosPintables = 0;
        this.mejorCuboCiclo;
        this.mejorCuboGeneracion;

        for (let i = 0; i < this.numCubos; i++) {
            this.arrayCubos[i] = cuboModelo.clonarCubo();
        }

        this.idMejorCubo = 0;
        this.totalGenes = numGenes;
        this.generacion = 0;
        this.ciclo = 0;
    }

    pintarCubos(iniciox, inicioy, longitudx, longitudy, longitudCadaCubo) {
        let cubosPorFila = floor(longitudx / longitudCadaCubo);
        let cubosPorColumna = floor(longitudy / longitudCadaCubo) - 1;
        let totalCubosPintables = floor(cubosPorFila * cubosPorColumna);
        let indiceCubo = 0;
        this.numCubosPintables = totalCubosPintables;


        let incrementox = iniciox;
        let incrementoy = inicioy;
        for (let f = 0; f < cubosPorColumna; f++) {
            for (let c = 0; c < cubosPorFila; c++) {
                //Pintar solo los cubos que caben en la pantalla
                //Si el usuario solo pone 10 cubos, puede que haya mas cubos pintables de los que hay realmente
                //asi que comprobar que existe
                if (this.arrayCubos[indiceCubo] != undefined) {
                    this.arrayCubos[indiceCubo].pintarCubo(incrementox, incrementoy, longitudCadaCubo);
                    fill(0);
                    text("ID " + indiceCubo, incrementox, incrementoy + 10);
                    incrementox += longitudCadaCubo;
                    indiceCubo++;
                }
            }
            incrementox = iniciox;
            incrementoy += longitudCadaCubo;
        }
    }

    pintarEstadisticas(iniciox, inicioy, longitudx, longitudy) {
        fill(0);
        stroke(0, 0);
        text("<- Este es el mejor cubo hasta el momento ", longitudy + 10, inicioy + 15);
        text("Se coge el cubo hecho en la pantalla de inicio como modelo", longitudy + 10, inicioy + 30);
        text("Se clona " + this.numCubos + " veces y a cada clon se le aplican " + this.totalGenes + " movimientos totalmente random", longitudy + 10, inicioy + 45);
        text("En cada ciclo se comprueba qué cubo tiene la mejor puntuación", longitudy + 10, inicioy + 60);
        text("Al comienzo de una nueva generación se escoge el mejor cubo hasta el momento, se clona, y se le aplican movimientos random", longitudy + 10, inicioy + 75);
        text("Y vuelta a empezar", longitudy + 10, inicioy + 90);
        text("Generación: " + this.generacion, longitudy + 10, inicioy + 105);
        text("Ciclo: " + (this.ciclo + 1) + " de " + this.totalGenes, longitudy + 10, inicioy + 120);
        text("Piezas bien colocadas (puntuación): " + this.mejorCuboGeneracion.puntuacion + " de 54", longitudy + 10, inicioy + 135);
        text("Número de cubos totales: " + this.numCubos + " (solo se pintan " + this.numCubosPintables + ")", longitudy + 10, 150);
        text("Número de movimientos del mejor cubo: " + this.mejorCuboGeneracion.historialMovimientos.length + ". Puedes verlos clicando el boton de abajo de todo", longitudy + 10, 163);

        this.mejorCuboGeneracion.pintarCubo(iniciox + 1, inicioy + 1, longitudy - 2);
        fill(0, 0);
        text("ID " + this.idMejorCubo, 10, 15);
        stroke(0, 255, 0);
        strokeWeight(3);
        rect(iniciox - 1, inicioy - 1, longitudx, longitudy);
    }

    //Se obtiene el mejor cubo de la población
    obtenerMejorCubo() {
        let puntuacionMaximo = 0;

        for (let i = 0; i < this.arrayCubos.length; i++) {
            if (this.arrayCubos[i].puntuacion >= puntuacionMaximo) {
                puntuacionMaximo = this.arrayCubos[i].puntuacion;
                this.mejorCuboCiclo = this.arrayCubos[i].clonarCubo();

                //Para la primera generación
                if (this.mejorCuboGeneracion == undefined) {
                    this.mejorCuboGeneracion = this.mejorCuboCiclo.clonarCubo();
                }

                //obtener el id del mejor cubo, el mayor de la poblacion y el mayor con respecto al de la anterior generacion
                if (this.mejorCuboCiclo.puntuacion > this.mejorCuboGeneracion.puntuacion) {
                    this.idMejorCubo = i;
                }
            }
        }
    }

    //Se obtiene el mejor cubo que hubiese alcanzado el mejor puntuacion en algún
    //ciclo de la generación. Se obtiene el cubo justo cuando cambia al mejor puntuacion.
    obtenerMejorCuboEnAlgunPuntoGeneracion() {
        //Obtener el mejor cubo en todos los ciclos de la generación
        this.obtenerMejorCubo();

        //Pero solo quedarse con el cubo justo en el momento de que su puntuacion mejora y solo una vez
        //ya que en cada generación puede haber varios cubos que su puntuación mejora, pero solo quedarse con uno
        if (this.mejorCuboCiclo.puntuacion > this.mejorCuboGeneracion.puntuacion) {
            this.mejorCuboGeneracion = this.mejorCuboCiclo.clonarCubo();
        }
        return this.mejorCuboGeneracion;
    }

    actualizarCubos() {
        for (let i = 0; i < this.arrayCubos.length; i++) {
            this.arrayCubos[i].actualizarCubo();
        }
        this.ciclo++;

        if (this.ciclo == this.totalGenes) {
            this.ciclo = 0;
            this.generacion++;
            this.nuevaGeneracion();
        }
    }

    //Los nuevos cubos tendrá la forma del mejor cubo de la generación pero con genes nuevos random
    nuevaGeneracion() {
        this.arrayCubos = [];
        for (let i = 0; i < this.numCubos; i++) {
            this.arrayCubos[i] = this.mejorCuboGeneracion.clonarCubo();
            this.arrayCubos[i].crearGenesRandom();
        }
    }
}