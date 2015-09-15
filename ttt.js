/*ttt.js: the frontend for the "simple" tictactoe game
  Written by: Aaron Tagliaboschi <aaron.tagliaboschi@gmail.com>
 */

//This draws the board itself onto the canvas
drawBack = function(ctx,width,height) {
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 6;
	ctx.lineCap = 'round';
	
	ctx.beginPath();
		ctx.moveTo(6,height/3);
		ctx.lineTo(width-6,height/3);
		ctx.moveTo(6,height/3*2);
		ctx.lineTo(width-6,height/3*2);
		ctx.moveTo(width/3,6);
		ctx.lineTo(width/3,height-6);
		ctx.moveTo(width/3*2,6);
		ctx.lineTo(width/3*2,height-6);
	ctx.stroke();
};

//This draws an 'x' in a given position on the board
var drawX = function(ctx,pos,width,height,color) {
	ctx.strokeStyle = color;
	ctx.lineWidth = 6;
	ctx.lineCap = 'round';
	
	//This transforms the position into 2D
	x = pos%3;
	y = (pos-x)/3;
	ctx.beginPath();
		ctx.moveTo((width/3)*x + 20, (height/3)*y + 20);
		ctx.lineTo((width/3)*(x+1) - 20, (height/3)*(y+1) - 20);
		ctx.moveTo((width/3)*x + 20, (height/3)*(y+1) - 20);
		ctx.lineTo((width/3)*(x+1) - 20, (height/3)*y + 20);
	ctx.stroke();
};

//This draws an 'o' in a given position
var drawO = function(ctx,pos,width,height,color) {
	ctx.strokeStyle = color;
	ctx.lineWidth = 6;
	ctx.lineCap = 'round';
	
	x = pos%3;
	y = (pos-x)/3;
	ctx.beginPath();
		ctx.arc((width/6)*(2*x+1), (height/6)*(2*y+1), (width/6) - 15, 0, 7);
	ctx.stroke();
};

//This combines all of the other 'draw's together and draws the 'x's and 'o's 
//according to the 'board' array
var drawBoard = function(ctx,width,height,board) {
	var gray = "#CCCCCC";
	var black = "#000000";
	
	drawBack(ctx,width,height);
	
	for (var i = 0; i < 9; i++) {
		switch(board[i]) {
			case 1:
				drawX(ctx,i,width,height,black);
				break;
			case -1:
				drawO(ctx,i,width,height,black);
		}
	}
};

//This turns an array into a string for the http requests
var boardString = function(board) {
	var bString = "";
	for(var i=0; i<9; i++) {
		switch(board[i]) {
			case 1:
				bString+="x";
				break;
			case 0:
				bString+="b";
				break;
			case -1:
				bString+="o";
				break;
		}
	}
	
	return bString;
};

//this is the actual board on the page
var canvas = document.getElementById("board");
var ctx = canvas.getContext('2d');

//global variables
var board = [0,0,0,0,0,0,0,0,0];
//done is set to ture when an end condition has been reached
var done = false;

//This event is triggered when the canvas is clicked (and )
canvas.addEventListener('click', function(event) { 
	//This is the math to get the position of the click
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;
	var pos = ((x- (x%100))/100) + ((y- (y%100))/100) * 3;
	
	//all of this stuff only happens if the area is blank and the game isn't finished
	if(board[pos] === 0 && !done) {
		board[pos] = -1;
		
		//The part of the http request that is reused.
		var ttt = "http://aarontag.com/tictactoe/ttt.py/";
		
		//All of this stuff is just boilerplate to make an http request from js
		//This one if to check the win state
		var xmlWin = new XMLHttpRequest();
		xmlWin.onreadystatechange = function() { 
			if (xmlWin.readyState == 4 && xmlWin.status == 200) {
				//If the returned text is not a number
				if(isNaN(Number(xmlWin.responseText))) {
					if(xmlWin.responseText === "t") {
						alert("It was a tie!");
					} else {
						alert(xmlWin.responseText + " won!");
					}
					done = true;
				}
			}
		};
		
		//This one if for moving
		var xmlMove = new XMLHttpRequest();
		xmlMove.onreadystatechange = function() { 
			if (xmlMove.readyState == 4 && xmlMove.status == 200 && !done) {
				board[Number(xmlMove.responseText)] = 1;
				//Only check after the move is made, because concurrency
				xmlWin.open("GET", ttt + "win/" + boardString(board), true);
				xmlWin.send(null);
			}
		};					
		
		//Check if someone won, then ask the computer for a move.
		xmlWin.open("GET", ttt + "win/" + boardString(board), true);
		xmlWin.send(null);
		xmlMove.open("GET", ttt + "move/" + boardString(board), true);
		xmlMove.send(null);
	}

}, false);

//This resets the game if the "Computer Start" button is clicked.
//Note, given a blank board, the ai will always choose the first space, so no
//request is needed.
document.getElementById("xstart").addEventListener('click', function(event) {
	board = [1,0,0,0,0,0,0,0,0];
	done = false;
}, false);

//reset the game if the "Player Start" button is clicked. 
document.getElementById("ostart").addEventListener('click', function(event) {
	board = [0,0,0,0,0,0,0,0,0];
	done = false;
}, false);

//This function is run every 25ms to keep the baord updated.
var update = function() {
	//Make a white square to blank out the canvas.
	ctx.fillStyle="white";
    ctx.beginPath();
    ctx.rect(0, 0, 300, 300);
    ctx.closePath();
    ctx.fill();
    
    //Draw the board
	drawBoard(ctx,300,300,board);
};

//Finally, make the 'update' function run every 25ms
setInterval(update, 25);