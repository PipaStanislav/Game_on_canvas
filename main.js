var Game = function(){

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }   

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function xPos (){
        var x = getRandomInt(0, 620);
        return x;
    }

    function yPos (){
        var y = 0;
        return y;
    }

    function squareSize (){
        var sqSize = getRandomInt(20, 40);
        return sqSize;
    }

    function squaresNumber (){
        var sqNumber = getRandomInt(10, 50);
        return sqNumber;
    }

    function squareSpeed (){
        var sp = getRandomArbitrary(0, 0.5);
        var speed = sp;
        return speed;
    }

    function squareColor (){
        var r = getRandomInt(0, 255);
        var g = getRandomInt(0, 255);
        var b = getRandomInt(0, 255);
        var a = 1;
        return 'rgba'+ '(' + r + ',' + g + ',' + b + ',' + 1 + ')';
    }

    var SquareMove = function (xPos, yPos, squareSpeed ){
        var y = yPos;
        var x = xPos;
        var speed  = squareSpeed;
        this.posX = function () {
            return x;
        }
        this.posY = function () {
            return y;
        }
        this.down = function () {
            y += speed;
        }
    }

    var Square = function(xPos, yPos, squareSize, squareColor, squareSpeed){
        this.size = squareSize;
        this.color = squareColor;
        this.speed = squareSpeed;
        this.moved = new SquareMove(xPos, yPos, squareSpeed); 
    }

    Square.prototype.down = function(){
        this.moved.down();
    }

    var canvas = document.getElementById('canvas');
    var start = document.getElementById('start');
    var stop = document.getElementById('stop');
    var score = document.getElementById('score');


    var Animate = (function(cnvs, sqSize, sqNumber,) {
        var canvas = cnvs;
        var squareSize = sqSize;
        var squaresNumber = sqNumber;

        var ctx = canvas.getContext('2d'); 

        var squares = [];
        var count = 0;
        var running = false;

        function creatSquares (n){
            for (var i = 0; i < n; i++){
                squares.push(new Square(xPos(), yPos(), squareSize, squareColor(), squareSpeed()));
            }
        }

        function fallSquares() {
            squares.forEach(function(sq) {
                sq.down();
            })
        }

        function sortSquares(){
            var cHaigth = canvas.clientHeight;
            squares = squares.filter(function(sq) {
                return sq.moved.posY() <= cHaigth; 
            });
        }

        function clearCtx(){
            ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
        }

        function addSquares(){
            clearCtx();
            squares.forEach(function(sq){
                ctx.fillStyle  = sq.color;
                ctx.fillRect( sq.moved.posX() ,sq.moved.posY() ,sq.size,sq.size );
            });

            sortSquares();
            fallSquares();        
            creatSquares(squaresNumber - squares.length);        

            if(running){
                requestAnimationFrame(addSquares);
            }else{
                clearCtx();
            }
        }

        function cursorPosition(cursor) {  
            return { x: cursor.clientX, y : cursor.clientY }
        }

        function addCount() {
            score.innerText = count;
        }

        function clickSquare(position) {
            squares.forEach( function(sq,i){
                var elementSize = canvas.getBoundingClientRect();
                var sqPos = { x : sq.moved.posX() + elementSize.left, y : sq.moved.posY() + elementSize.top };
                if( sqPos.x <= position.x &&
                    sqPos.x + squareSize >= position.x &&
                    sqPos.y <= position.y &&
                    sqPos.y + squareSize >= position.y  ){
                        squares.splice(i, 1);
                        count += 1;
                        addCount();
                }
            })
        }

        var buttons = {
            run: function() {
                if(!running){
                    running = true;
                    creatSquares(squaresNumber);
                    addSquares();
                }
            },
            stop: function(){
                if(running){
                    running = false;
                }
                squares.length = 0;//clear array
                count = 0;
                addCount();
            },
            watch: function(mouseevent) {
                if(running){
                    clickSquare(  cursorPosition(mouseevent) );
                }
            }, 
        }


        Restart = function(){}
        Restart.prototype = buttons;
        return Restart;
    })(canvas, squareSize(), squaresNumber());


    var a = new Animate();

    canvas.addEventListener("mousedown", a.watch, false);
    start.addEventListener("click", a.run, false);
    stop.addEventListener("click", a.stop, false);
};

document.body.onload = Game;

var Restart;
