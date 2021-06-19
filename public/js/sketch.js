xres = 720; //panjang resolusi window
yres = 400; //tinggi resolusi window
sqsize = 40; //panjang square
xpad = 140; //padding horizontal untuk setiap kotak
ypad = 50; //padding vertikal untuk setiap kotak
var arrTape; //variabel untuk menyimpan input
var step = 0; //step pada komputasi
var tapes = []; //untuk menyimpan semua tape
var tapeCount; //banyak dari tape

/* load hasil komputasi dalam bentuk json */
function preload() {
    arrTape = loadJSON("./temp.json");
}

/* 
setup display dan variabel-variabel
-membuat canvas
-menentukan framerate dari screen
-melakukan looping pada seluruh tape hasil komputasi, kemudian di-assign ke dalam array baru
*/
function setup() {
    var mycanvas = createCanvas(xres, yres);
    frameRate(6);

    tapeCount = arrTape.input.length;
    for (let i = 0; i < tapeCount; i++) {
        temp = new tape(i + 1, arrTape.input[i]);
        tapes.push(temp);
    }
    print(tapes)
    mycanvas.parent('canvas');
}

/* 
fungsi yang selalu dipanggil hingga dihentikan
-background berwarna putih(255)
-menampilkan bentuk kotak untuk tape beserta valuenya
-memperbarui tape berdasarkan langkah ke-(i) hingga komputasi terakhir
looping akan berhenti jika komputasi yang dibaca habis
*/
function draw() {
    background(255);
    for (let i = 0; i < tapeCount; i++) {
        tapes[i].show();
    }

    print(step);
    if (step < Object.keys(arrTape.step).length) {
        step = updateTape(step);
    } else {
        noLoop()
    }

}

/* 
fungsi untuk memperbarui isi tape pada langkah ke-(step)
-melakukan looping pada setiap tape(jika multitape), dan memperbarui masing-masing tape 
    dengan memanggil fungsi update() pada masing-masing object
-parameter yang dimasukkan pada update() adalah simbol yang menggantikan simbol pada tapehead, 
    dan pergerakan tapehead yang mengikuti  
*/
function updateTape(step) {
    this.step = step;
    for (let i = 0; i < tapeCount; i++) {
        tapes[i].update(arrTape.step[this.step].new_symbol[i], arrTape.step[this.step].move[i]);
    }

    this.step++;
    print('\n');
    return this.step;

}


/* 
class yang untuk object tape
*/
class tape {

    /* 
    constructor kelas tape, berupa isian dari masing-masing tape, nomor dari tape(dari paling atas), 
        posisi Tape Head(mengikuti posisi pada array), posisi Tape Head yang ditampilkan di layar(fixed dari 0-11),
        offset mewakili pergeseran tape dari posisi semula pada screen, dan yloc adalah posisi tape pada layar  
    */
    constructor(tapeNum, arr) {
        if (arr != null) {
            this.currentArr = arr;
        } else {
            this.currentArr = ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"];
        }

        this.tapeNum = tapeNum;
        this.yloc = this.tapeNum * ypad * 2;
        this.headTape = 1;
        this.headScreen = 1;
        this.screenOffset = 0;
    }
    
    /* 
    memperbarui nilai di dalam tape pada tape head tertentu, dankemudian memperbarui posisi tapehead
        terdapat 4 kondisi
        -jika tapehead bergerak ke kanan dan tidak pada posisi paling kanan yang ditampilkan di layar
        -jika tapehead bergerak ke kiri dan tidak pada posisi paling kiri yang ditampilkan di layar
        -jika tapehead bergerak ke kanan dan  pada posisi paling kanan yang ditampilkan di layar,
            kemudian menggeser tampilan tape ke kiri, dan menambahkan elemen baru pada array jika tapehead juga berada
            di posisi terkanan dari array
        -jika tapehead bergerak ke kiri dan  pada posisi paling kiri yang ditampilkan di layar,
            kemudian menggeser tampilan tape ke kanan, dan menambahkan elemen baru pada array jika tapehead juga berada
            di posisi terkiri dari array
    */
    update(newSym, move) {
        //print(this.headTape, this.headScreen);
        this.currentArr[this.headTape] = newSym;
        print(this.headTape, this.headScreen);
        if (move == ">" && this.headScreen < 9) {
            this.headTape++;
            this.headScreen++;
        } else if (move == "<" && this.headScreen > 1) {
            this.headTape--;
            this.headScreen--;
        } else if (move == ">" && this.headScreen == 9) {
            if (this.headTape == this.currentArr.length - 1) {
                this.currentArr.push("_");
            }
            this.screenOffset++;
            this.headTape++;
        } else if (move == "<" && this.headScreen == 1) {
            if (this.headTape == 1) {
                this.currentArr.unshift("_");
            } else {
                this.headTape--;
                this.screenOffset--;
            }
        }

    }

    /* 
    menampilkan tape pada screen berupa bentuk kotak, text pada setiap isian tape, 
        dan segitiga yang menandakan posisi tapehead
    */
    show() {
        //tape symbols
        for (let i = 0; i < 11; i++) {
            strokeJoin(ROUND);
            strokeWeight(3);
            stroke(0);
            fill(260);
            square(i * sqsize + xpad, this.yloc, sqsize);
        }
        strokeWeight(1);
        textAlign(CENTER);
        textSize(24);
        fill(0);
        for (let i = 0; i < 11; i++) {
            text(this.currentArr[i + this.screenOffset], i * sqsize + xpad + 20, this.yloc + sqsize - 10);
        }

        //tape head
        fill(250);
        strokeWeight(3);
        triangle(this.headScreen * sqsize + xpad, this.yloc - 30, this.headScreen * sqsize + xpad + 20, this.yloc - 5, this.headScreen * sqsize + xpad + 40, this.yloc - 30);
    }
}
