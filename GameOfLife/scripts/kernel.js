/* the app.js handles the data and logic part of the game*/

//some global variable
var timeout = 200;
var miniMapScale = 10;
var width = 75;
var height = 45;
var marginleft = 42;
var margintop = 27;
var realWidth = 160;
var realHeight = 100;
var map = new Array(realWidth);
var previousLiveCells = [];
var currentLiveCells = [];
var changedCells = [];
var walls = [];
var gameStop = true;
var liveCellsDensity = 0.4;
var widthArray = [35, 50, 75, 100, 150];
var miniMapScaleArray = [21.4, 15, 10, 7.5, 5];
var currentScale = 2;
var liveState = 3;
var keepState = 2;

//kill all live cells
function clearData() {
	var i, j;
	for (i = 0; i < realWidth; i++) {
		for (j = 0; j < realHeight; j++) {
			if (map[i][j] === 1) {
				map[i][j] = 0;
			}
		}
	}
	previousLiveCells.splice(0, previousLiveCells.length);	
}

//initial the live cells randomly according to the value of liveCellsDensity
function generateLiveCell() {
	var cellNum = parseInt((realWidth - 10) * (realHeight - 10) * liveCellsDensity) - walls.length;
	var count = 0; 
	var x, y;
	var margin = 5;
	while (count < cellNum) {
		x = parseInt((realWidth - 10) * Math.random()) + margin;
		y = parseInt((realHeight - 10) * Math.random()) + margin;
		if (map[x][y] === 0) {
			previousLiveCells[previousLiveCells.length] = [x,y];
			map[x][y] = 1;
			count++;
		}
	}
}


//update data in Map and living cells lists
function updateMap() {
	var length = previousLiveCells.length;
	for (var i = 0; i < length; i++) {
		var x = previousLiveCells[i][0];
		var y = previousLiveCells[i][1];
		updateCell(x, y);
	}
	var clength = changedCells.length;
	for (var i = 0; i < clength; i++) {
		map[changedCells[i][0]][changedCells[i][1]] = 1 - map[changedCells[i][0]][changedCells[i][1]];
	}
	changedCells = [];
	previousLiveCells = currentLiveCells.slice();
	currentLiveCells.splice(0, currentLiveCells.length);
}

//judge if the coordinate (x,y) is a legal position
function judgeCell(x, y) {
	if (x < 0 || y < 0|| x >= realWidth || y >= realHeight) {
		return -2;
	}
	else {
		return map[x][y];
	}
}

//counting living cells around cell (x,y) and decide 
//whether it's dead or alive in next round
function updateCell(x, y) {
	var sum = 0;
	var state =  map[x][y];
	var surroundState;
	//console.log(surround);
	for (var i = -2; i < 3; i++) {
		//console.log(i);
		if(i === 0) {
			continue;
		}
		surroundState = judgeCell(x+i, y);
		if (map[x][y] === 1) {
			if (surroundState === 0) {
				updateCell(x+i, y);
			}
		}
		if (surroundState === 1) {
			sum++;
		}
		surroundState = judgeCell(x, y+i);
		if (map[x][y] === 1) {
			if (surroundState === 0) {
				updateCell(x, y+i);
			}
		}
		if(surroundState === 1) {
			sum++;
		}
	}
	switch(sum) {
	case liveState:
		if (state === 0) {
			if (multiDimArraySearch(x,y,currentLiveCells) == -1) {
				currentLiveCells[currentLiveCells.length] = [x, y];
				changedCells[changedCells.length] = [x, y];
			}
		}else if(state === 1) {
			currentLiveCells[currentLiveCells.length] = [x, y];
		}
		break;
	case keepState:
		if (state == 1) {
			currentLiveCells[currentLiveCells.length] = [x, y];
		}
		break;
	default:
		if (state == 1) {
			changedCells[changedCells.length] = [x, y];
		}
		break;
	}
}


//search an item in a two dimension array
function multiDimArraySearch(x, y, a) {
	var length = a.length;
	for (var i = 0; i<length; i++) {
		if (a[i][0] == x && a[i][1] == y)
			return i;
	}
	return -1;
}


//initialization operation
function initArray() {
	var i, j;
	for (i = 0; i < realWidth; i++) {
		map[i] = new Array(realHeight);
		for (j = 0; j < realHeight; j++) {
			map[i][j] = 0;
		}
	}
}