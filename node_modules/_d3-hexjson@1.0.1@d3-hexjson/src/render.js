import {min, max} from "d3-array";

// Main render method
export function renderHexJSON (hexjson, width, height) {
	// Get the layout
	var layout = hexjson.layout;

	// Get the hex objects as an array
	var hexes = [];
	var hexRadius = 0;

	Object.keys(hexjson.hexes).forEach(function (key) {
		hexjson.hexes[key].key = key;
		hexes.push(hexjson.hexes[key]);
	});

	// Calculate the number of rows and columns
	var qmax = max(hexes, function (d) { return +d.q }),
		qmin = min(hexes, function (d) { return +d.q }),
		rmax = max(hexes, function (d) { return +d.r }),
		rmin = min(hexes, function (d) { return +d.r });

	var qnum = qmax - qmin + 1,
		rnum = rmax - rmin + 1;

	// Calculate maximum radius the hexagons can have to fit the svg
	if (layout === "odd-r" || layout === "even-r") {
		hexRadius = min([(width) / ((qnum + 0.5) * Math.sqrt(3)),
			height / ((rnum + 1 / 3) * 1.5)]);
	} else {
		hexRadius = min([(height) / ((rnum + 0.5) * Math.sqrt(3)),
			width / ((qnum + 1 / 3) * 1.5)]);
	}

	// Calculate the hexagon width
	var hexWidth = hexRadius * Math.sqrt(3);

	// Get the vertices and points for this layout
	var vertices = getVertices(layout, hexWidth, hexRadius);
	var points = getPoints(vertices);

	// Calculate the values needed to render each hex and add to hexes
	hexes.forEach(function (hex) {
		// Calculate the absolute co-ordinates of each hex
		hex.qc = hex.q - qmin;
		hex.rc = rmax - hex.r;

		// Calculate the x and y position of each hex for this svg
		hex.x = getX(hex, layout, hexWidth, hexRadius);
		hex.y = getY(hex, layout, hexWidth, hexRadius);

		// Add the vertex positions and points relative to x and y
		hex.vertices = vertices;
		hex.points = points;
	});

	return hexes;
}

// Get the x position for a hex
function getX (hex, layout, hexWidth, hexRadius) {
	var x = 0,
		xOffset = 0;

	switch (layout) {
		case "odd-r":
			xOffset = (hex.rc % 2 === 1) ? hexWidth : (hexWidth / 2);
			x = (hex.qc * hexWidth) + xOffset;
			break;

		case "even-r":
			xOffset = (hex.rc % 2 === 0) ? hexWidth : (hexWidth / 2);
			x = (hex.qc * hexWidth) + xOffset;
			break;

		case "odd-q":
		case "even-q":
			x = (hex.qc * hexRadius * 1.5) + hexRadius;
			break;
	}

	return x;
}

// Get the y position for a hex
function getY (hex, layout, hexWidth, hexRadius) {
	var y = 0,
		yOffset = 0;

	switch (layout) {
		case "odd-r":
		case "even-r":
			y = (hex.rc * hexRadius * 1.5) + hexRadius;
			break;

		case "odd-q":
			yOffset = (hex.qc % 2 === 1) ? hexWidth : (hexWidth / 2);
			y = (hex.rc * hexWidth) + yOffset;
			break;

		case "even-q":
			yOffset = (hex.qc % 2 === 0) ? hexWidth : (hexWidth / 2);
			y = (hex.rc * hexWidth) + yOffset;
			break;
	}

	return y;
}

// Get the positions of the vertices for the hex:
// - Row layouts are ordered from the topmost vertex clockwise
// - Column layouts are ordered from the leftmost vertex clockwise
function getVertices (layout, hexWidth, hexRadius) {
	var vertices = [];

	switch (layout) {
		case "odd-r":
		case "even-r":

			vertices.push({x: 0, y: (0 - hexRadius)});
			vertices.push({x: (0 + hexWidth * 0.5), y: (0 - 0.5 * hexRadius)});
			vertices.push({x: (0 + hexWidth * 0.5), y: (0 + 0.5 * hexRadius)});
			vertices.push({x: 0, y: (0 + hexRadius)});
			vertices.push({x: (0 - hexWidth * 0.5), y: (0 + 0.5 * hexRadius)});
			vertices.push({x: (0 - hexWidth * 0.5), y: (0 - 0.5 * hexRadius)});
			break;

		case "odd-q":
		case "even-q":

			vertices.push({x: (0 - hexRadius), y: 0});
			vertices.push({x: (0 - 0.5 * hexRadius), y: (0 - hexWidth * 0.5)});
			vertices.push({x: (0 + 0.5 * hexRadius), y: (0 - hexWidth * 0.5)});
			vertices.push({x: (0 + hexRadius), y: 0});
			vertices.push({x: (0 + 0.5 * hexRadius), y: (0 + hexWidth * 0.5)});
			vertices.push({x: (0 - 0.5 * hexRadius), y: (0 + hexWidth * 0.5)});
			break;
	}

	return vertices;
}

// Get the points attribute for a polygon with these vertices
function getPoints (vertices) {
	var points = "";
	vertices.forEach(function (v) { points += v.x + "," + v.y + " " });
	return points.substring(0, points.length - 1);
}

// Creates a hexjson grid with the layout and dimensions of the given hexjson
export function getGridForHexJSON (hexjson) {
	// Create a new HexJSON object for the grid
	var grid = {};
	grid.layout = hexjson.layout;
	grid.hexes = {};

	// Get the hex objects from the hexjson as an array
	var hexes = [];

	Object.keys(hexjson.hexes).forEach(function (key) {
		hexes.push(hexjson.hexes[key]);
	});

	// Calculate the number of rows and columns in the grid
	var qmax = max(hexes, function (d) { return +d.q }),
		qmin = min(hexes, function (d) { return +d.q }),
		rmax = max(hexes, function (d) { return +d.r }),
		rmin = min(hexes, function (d) { return +d.r });

	// Create the hexjson grid
	var i, j, fkey;
	for (i = qmin; i <= qmax; i++) {
		for (j = rmin; j <= rmax; j++) {
			fkey = "Q" + i + "R" + j;
			grid.hexes[fkey] = {q: i, r: j};
		}
	}

	return grid;
}
