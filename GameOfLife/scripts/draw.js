 /* the draw.js handles the UI of the game*/

//Listener to start/stop
function control() {
	if (gameStop === true) {
		gameStop = false;
		if (previousLiveCells.length === 0) {
			initCells();
		}
		gameCycle();
		$('#control').html('Stop');
	} else {
		gameStop = true;
		$('#control').html('Start');
	}
}

//kill all cells and redraw the map
function clearCells() {
	clearData();
	drawCells();	
}

//initial the live cells randomly according to the value of liveCellsDensity
function initCells() {
	generateLiveCell();
	drawCells();
}

/*
	Game's Main Cycle
	including:update data in Map and living cells lists 
	draw living cells in next round
*/
function gameCycle() {
	updateMap();
	drawCells();
	//console.log(previousLiveCells.length);
	if (gameStop === false)
		setTimeout(gameCycle, timeout);
}

//draw background and lines in the beginning
function drawInitMap() {
	var miniMap = $("#minimap")[0];
	var cells = $('#cells')[0];
	var wall = $('#walls')[0];
	wall.width = cells.width = miniMap.width = width * miniMapScale + 1;
	wall.height = cells.height = miniMap.height = height * miniMapScale + 1;
	var cxt = miniMap.getContext("2d");
	cxt.strokeStyle = "rgba(200,200,200,1)";
	for (var x=0; x<=width; x++) {
		cxt.moveTo(x * miniMapScale,0);
		cxt.lineTo(x * miniMapScale, height * miniMapScale);
		cxt.stroke();
	}
	for (var y=0;y<=height;y++) {
		cxt.moveTo(0, y * miniMapScale);
		cxt.lineTo(width * miniMapScale, y * miniMapScale);
		cxt.stroke();
	}
}

//every round we will redraw all the live cells
function drawCells() {
	var cells = $('#cells')[0];
	cells.width = width * miniMapScale + 1;
	cells.height = height * miniMapScale + 1;
	var cxt = cells.getContext("2d");
	cxt.fillStyle = "rgb(255,0,0)";
	var length = previousLiveCells.length;
	for (var i = 0; i < length; i++) {
		if (previousLiveCells[i][0] >= marginleft && previousLiveCells[i][1] >= margintop){
			cxt.fillRect(
				(previousLiveCells[i][0]-marginleft) * miniMapScale+1,
				(previousLiveCells[i][1]-margintop) * miniMapScale+1,
				miniMapScale-2,miniMapScale-2
			);
		}
	}
	if (length == 0) {
		cxt.clearRect(0,0, width*miniMapScale, height*miniMapScale);
	}
}

//draw the wall after every click on map
function drawWalls() {
	//console.log(walls);
	var wall = $('#walls')[0];
	wall.width = width * miniMapScale + 1;
	wall.height = height * miniMapScale + 1;
	var cxt = wall.getContext("2d");
	cxt.fillStyle = "rgb(0,0,255)";
	var length = walls.length;
	for (var i = 0; i < length; i++) {
		cxt.fillRect(
			(walls[i][0]-marginleft) * miniMapScale+1,
			(walls[i][1]-margintop) * miniMapScale+1,
			miniMapScale-2,miniMapScale-2
		);
	}
}

//listener on the mouse click event and changing the status of grid
function buildWalls() {
	var e = arguments[0]||window.event;
    var x = parseInt((e.pageX - $('#layout3').offset().left)/miniMapScale)+marginleft;
	var y = parseInt((e.pageY - $('#layout3').offset().top)/miniMapScale)+margintop;
	//alert(x+" "+y);
	if (map[x][y] == 0) {
		walls[walls.length] = [x, y];
	}else {
		var index = multiDimArraySearch(x,y, walls);
        if (index > -1) {
        	walls.splice(index, 1);
        }
	}
	map[x][y] = - 1 - map[x][y];
	drawWalls();
}

//setting on elements's position so that it can fit 
// screens with different resolution
function adjustScreen() {
	var left = 	(document.body.clientWidth - width * miniMapScale - 1) / 2;
	var top = "15%";
	for (var i=1; i<=3; i++) {
		var layout = $("#layout"+i);
		layout.css("left", left+"px");
		layout.css("top", top);
	}
	var titleLeft = (document.body.clientWidth - 380 - 1) / 2;
	$('#title').css('left', titleLeft);
	$('#title').css('top', "3%");
	//var tops = window.screen.height * 1;
}

window.onresize = adjustScreen;

//listener on the speed dial and setting the time interval
function speedListener() {
	var speed = $('#speed');
	timeout = 1000 - parseInt(speed.val());
}

//listener on the density dial and setting the live cell density
function densityListener() {
	var density = $('#density');
	liveCellsDensity = density.val() / 100.0;
}

//listener on the mouse click event on the magnify icon and magnify the map
function magnify() {
	if (currentScale>0) {
		currentScale--;
		width = widthArray[currentScale];
		miniMapScale = miniMapScaleArray[currentScale];
		height = width / 5 * 3;
		marginleft = parseInt((realWidth - width) / 2);
		margintop = parseInt((realHeight - height) / 2);
		drawInitMap();
		adjustScreen();
		drawWalls();
	}
}

//listener on the mouse click event on the diminish icon and diminish the map
function diminish() {
	if (currentScale<4) {
		currentScale++;
		width = widthArray[currentScale];
		miniMapScale = miniMapScaleArray[currentScale];
		height = width / 5 * 3;
		marginleft = parseInt((realWidth - width) / 2);
		margintop = parseInt((realHeight - height) / 2);
		drawInitMap();
		adjustScreen();
		drawWalls();
	}
}

//initialization operation
function init() {
	initArray();
	
	drawInitMap();
	adjustScreen();

	var speed = $('#speed');
	timeout = 1000 - parseInt(speed.val());
	speed.on('change', speedListener);
	speed.on('input', speedListener);
	
	var density = $('#density');
	liveCellsDensity = density.val() / 100.0;
	density.on('change', densityListener);
	density.on('input', densityListener);
}