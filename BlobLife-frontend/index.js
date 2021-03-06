function startBlob(){
const body = document.querySelector('body')
let formDiv = document.getElementById('formDiv')
formDiv.remove()
const gameWindow = document.createElement('div')
gameWindow.setAttribute('class', 'game-window')
// body.innerHTML = ''
const canvas = document.createElement('canvas');
canvas.height = 800;
canvas.width = 800;
gameWindow.appendChild(canvas)
body.appendChild(gameWindow)
const gravity = 1;
const jumpHeight = -15;
let jumped = false;
let grabbed = false;
const playerMove = 5;
let playerColor = '#1aa6b7';
let spin = 20;
let spincrementer = -1;
const spincolor = ['','darkgreen','green']
let gameOver = false;

console.log(typeof canvas.height)
const twod = canvas.getContext('2d');

function Platform(x, y, length, height){
    this.x = x;
    this.y = y;
    this.length = length;
    this.height = height;

    this.draw = function(){
        twod.fillStyle = '#637373';
        twod.fillRect(this.x, this.y, this.length, this.height);
    }
}

function BlobMan(x, y){
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.onGround = true;
    this.wallGrab = 0;
    this.size = 20;

    this.draw = function() {
        twod.fillStyle = playerColor;
        twod.fillRect(this.x, this.y, this.size, this.size);
        twod.fillStyle = 'white';
        twod.fillRect(this.x + 5, this.y + 3, 2, 5);
        twod.fillRect(this.x + 13, this.y + 3, 2, 5);
        twod.beginPath();
        twod.strokeStyle = 'white';
        twod.moveTo(this.x + 3, this.y + 13);
        twod.lineTo(this.x + 17, this.y + 13);
        twod.stroke();
    }
    this.update = function() {
        console.log(`y:${this.y}, x:${this.x}, dy:${this.dy}, dx:${this.dx}, onGround:${this.onGround}, wallGrab: ${this.wallGrab}, grabbed: ${grabbed}`)
        let possibleLandings = platforms.slice().sort((a, b) => a.y - b.y);
        possibleLandings = possibleLandings.filter(plat => plat.y >= this.y + this.size + this.dy);
        possibleLandings = possibleLandings.filter(plat => plat.x <= this.x + this.size && plat.x + plat.length >= this.x)
        let platformOn = platforms.filter(plat => plat.y === this.y + this.size)
        let possibleBonks = [];
        let possibleWalls = [];
        if (this.dy < 0){
            possibleBonks = platforms.slice().sort((a, b) => b.y - a.y);
            possibleBonks = possibleBonks.filter(plat => plat.y + plat.height > this.y + this.dy && this.y > plat.y + plat.height);
            possibleBonks = possibleBonks.filter(plat => plat.x <= this.x + this.size && plat.x + plat.length >= this.x)
        }
        if (this.dy < 0 && possibleBonks.length > 0 && this.y + this.dy + this.dy <= possibleBonks[0].y + possibleBonks[0].height) {
            this.y = possibleBonks[0].y + possibleBonks[0].height;
            this.dy = 0;
        } else if (this.y + this.size + this.dy < possibleLandings[0].y){
            this.dy += gravity;
            platformOn = [];
            this.onGround = false;
        }
        this.y += this.dy;
        if (this.dx > 0){
            possibleWalls = platforms.slice().sort((a, b) => a.x - b.x);
            possibleWalls = possibleWalls.filter(plat => plat.y + plat.height > this.y && this.y + this.size > plat.y);
            possibleWalls = possibleWalls.filter(plat => plat.x <= this.x + this.size + this.dx && this.x < plat.x + plat.length );
            if (possibleWalls.length > 0){
                this.dx = 0;
                this.x = possibleWalls[0].x - this.size;
                if(!this.onGround && this.wallGrab === 0 && !grabbed){
                    this.wallGrab = -30;
                    grabbed = true;
                    this.dy = 0;
                }
            }
        } else if (this.dx < 0){
            possibleWalls = platforms.slice().sort((a, b) => b.x - a.x);
            possibleWalls = possibleWalls.filter(plat => plat.y + plat.height > this.y && this.y + this.size > plat.y);
            possibleWalls = possibleWalls.filter(plat => plat.x + plat.length >= this.x + this.dx && this.x > plat.x );
            if (possibleWalls.length > 0){
                this.dx = 0;
                this.x = possibleWalls[0].x + possibleWalls[0].length;
                if(!this.onGround && this.wallGrab === 0 && !grabbed){
                    this.wallGrab = -30;
                    grabbed = true;
                    this.dy = 0;
                }
            }
        }
        this.x += this.dx;
        if (this.wallGrab < 0 && (this.x === canvas.width - this.size || this.x === 0 || (possibleWalls.length > 0 && possibleWalls[0].x - this.size === this.x))){
            this.dy -= 0.9;
            this.wallGrab++;
        }
        if (this.y + this.size + this.dy + this.dy + gravity > possibleLandings[0].y) {
            platformOn[0] = possibleLandings[0];
        }
        if (platformOn.length > 0){
            if (this.dy >= 30){
                gameOver = true;
            }
            this.onGround = true;
            this.y = platformOn[0].y - this.size;
            this.dy = 0;
            grabbed = false;
        }
        if (this.x < 0){
            this.x = 0;
            this.dx = 0;
            if(!this.onGround && this.wallGrab === 0 && !grabbed){
                this.wallGrab = -30;
                grabbed = true;
                this.dy = 0;
            }
        } else if (this.x > canvas.width - this.size){
            this.x = canvas.width - this.size;
            this.dx = 0;
            if(!this.onGround && this.wallGrab === 0 && !grabbed){
                this.wallGrab = -30;
                grabbed = true;
                this.dy = 0;
            }
        }
        this.draw();
    }
}

const platforms = [];
platforms.push(new Platform(0, 800, 800, 10));
platforms.push(new Platform(150, 150, 150, 650));
platforms.push(new Platform(75, 710, 75, 10));
platforms.push(new Platform(0, 600, 75, 10));
platforms.push(new Platform(75, 500, 75, 10));
platforms.push(new Platform(75, 390, 75, 10));
platforms.push(new Platform(0, 280, 75, 10));


let Player;

window.addEventListener('keydown', (e) => {
    const key = e.key;
    e.preventDefault();
    if (key === "ArrowLeft"){
        Player.dx = -playerMove;
    } else if (key === "ArrowRight"){
        Player.dx = playerMove;
    } else if(key === "ArrowUp"){
        if (Player.onGround && !jumped){
            Player.dy = jumpHeight;
            jumped = true;
        } else if(Player.wallGrab < 0 && !jumped){
            Player.dy = jumpHeight;
            Player.wallGrab = 0;
        }
    }
})
window.addEventListener('keyup', (e) => {
    const key = e.key;
    if (key === "ArrowLeft"){
        Player.dx = 0;
    } else if (key === "ArrowRight"){
        Player.dx = 0;
    } else if (key === "ArrowUp"){
        jumped = false;
    }
})

function init(){
    playerColor = '#1aa6b7';
    Player = new BlobMan(0, canvas.height - 20);
    gameOver = false;
    animate();
}

function animate() {
    if (!gameOver){
        requestAnimationFrame(animate);
    } else {
        playerColor = 'red';
        Player.draw();
        setTimeout(init, 2000);
    }
    twod.clearRect(0,0,canvas.width,canvas.height);
    platforms.forEach(plat => plat.draw());
    Player.update();
    spin += spincrementer;
    if (spin === 0 || spin === 20){
        spincrementer = -spincrementer;
    }
    twod.fillStyle = spincolor.slice(spincrementer)[0];
    twod.fillRect((20 - spin * .5 ), 10, spin, 20);
}

init();