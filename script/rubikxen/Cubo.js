//IMPORTANTE : as funcions de girar teñen en conta que o cubo estase mirando desde a cara
//azul, arriba esta a cara blanca, abaixo a amarilla, izq a roja, e dereita a naranja.
class Cubo {

    constructor(numGenes) {
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

        //Genes, contiene los movimientos en forma de json
        //{cara:val, sentido:val}
        this.genes = [];
        this.numGenes = numGenes;
        this.crearGenesRandom();

        this.historialMovimientos = [];
        //Cuantas mas piezas bien colocadas mejor puntuacion
        this.puntuacion = 0;


    }

    crearGenesRandom() {
        for (let i = 0; i < this.numGenes; i++) {
            this.genes[i] = this.obtenerGenRandom();
        }
    }

    //Obtener un solo gen (cara, sentido) random
    obtenerGenRandom() {
        let cara = ["roja", "amarilla", "azul", "blanca", "naranja", "verde"];
        let sentido = ["horario", "antihorario"];

        return { cara: random(cara), sentido: random(sentido) };
    }

    clonarCubo() {
        let toret = new Cubo(NUMGENES);
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                toret.caraAzul[i][j] = this.caraAzul[i][j];
                toret.caraRoja[i][j] = this.caraRoja[i][j];
                toret.caraBlanca[i][j] = this.caraBlanca[i][j];
                toret.caraAmarilla[i][j] = this.caraAmarilla[i][j];
                toret.caraVerde[i][j] = this.caraVerde[i][j];
                toret.caraNaranja[i][j] = this.caraNaranja[i][j];
            }
        }
        toret.historialMovimientos = this.clonarArray(this.historialMovimientos);

        toret.puntuacion = this.puntuacion;

        return toret;
    }

    clonarCara(cara) {
        let toret = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                toret[i][j] = cara[i][j];
            }
        }
        return toret;
    }

    clonarArray(array) {
        let toret = [];
        for (let i = 0; i < array.length; i++) {
            toret[i] = array[i];
        }
        return toret;
    }

    //Consumir gen/movimiento
    actualizarCubo() {
        if (CICLO < NUMGENES) {
            this.girar(this.genes[CICLO].cara, this.genes[CICLO].sentido);
        }
    }

    getColor(color) {
        if (color == "blanco") return "#FFFFFF";
        if (color == "rojo") return "#FF0000";
        if (color == "verde") return "#00FF00";
        if (color == "azul") return "#0000FF";
        if (color == "amarillo") return "#FFFF00";
        if (color == "naranja") return "#FF7700";
        if (color == "purpura") return "#CC18D4";
    }

    randomizar() {
        for (let i = 0; i < 20; i++) {
            let genRandom = this.obtenerGenRandom();
            this.girar(genRandom.cara, genRandom.sentido);
        }
    }

    purpurearCubo() {
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                if (!(i == 1 && j == 1)) this.caraAzul[i][j] = "purpura";
                if (!(i == 1 && j == 1)) this.caraAmarilla[i][j] = "purpura";
                if (!(i == 1 && j == 1)) this.caraBlanca[i][j] = "purpura";
                if (!(i == 1 && j == 1)) this.caraNaranja[i][j] = "purpura";
                if (!(i == 1 && j == 1)) this.caraRoja[i][j] = "purpura";
                if (!(i == 1 && j == 1)) this.caraVerde[i][j] = "purpura";
            }
        }
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
        stroke(0,170);
        strokeWeight(1);
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

    }//fin pintar()

    //IMPORTANTE : as funcions de girar teñen en conta que o cubo estase mirando desde a cara
    //azul, arriba esta a cara blanca, abaixo a amarilla, izq a roja, e dereita a naranja.
    girar(cara, sentido) {
        this.historialMovimientos.push({ cara, sentido });

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

        //this.comprobarEstado();
        this.comprobarPuntuacion();
    }//Fin girar()

    comprobarPuntuacion() {
        this.puntuacion = 0;
        for (let f = 0; f < 3; f++) {
            for (let c = 0; c < 3; c++) {
                if(this.caraBlanca[f][c] == this.caraBlanca[1][1]) this.puntuacion++;
                if(this.caraAmarilla[f][c] == this.caraAmarilla[1][1]) this.puntuacion++;
                if(this.caraAzul[f][c] == this.caraAzul[1][1]) this.puntuacion++;
                if(this.caraVerde[f][c] == this.caraVerde[1][1]) this.puntuacion++;
                if(this.caraRoja[f][c] == this.caraRoja[1][1]) this.puntuacion++;
                if(this.caraNaranja[f][c] == this.caraNaranja[1][1]) this.puntuacion++;
            }
        }
    }
}//Fin clase Cubo