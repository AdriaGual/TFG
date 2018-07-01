/* 
 * Author: Pau Xiberta i Armengol (c)
 * Date: 19/06/2015 (revised: 01/04/2015)
 * Summary: Canvas interaction for location problems (JavaScript file)
 */

var isFullscreen = false;

var location_points = [];
var isIE = false;

var optionSelected = "none";
var noDraw = true;
var pointSelected = false;
var lastPointSelected = false;

var canvas, ctx, m, image, lastX, lastY, dragged;
var t = new Transform();
var scale_factor = 1.1;
var radius_factor = 1;
var zoomLevel, zoomLow, zoomUp;

var circles = [];

function setImage(image_src) {
	if (image_src == "") {
		image = null;
		location_points = [];
		
		ctx.save();
		ctx.setTransform(1,0,0,1,0,0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
	}
	else {
		// Create a new image from the image selected
		image = new Image();
		image.onload = function() {
			radius_factor = (Math.max(image.width, image.height) / 2) / 10;
			
			$.each(circles, function(index, circle) {
				var radius = Math.min(Math.max(Math.round(circle['radius'] / radius_factor), 1), 10);
				var location_point = new LocationPoint(circle['x'], circle['y'], radius, 1, 'rgba(255,0,0,0.5)', radius_factor);
				location_points.push({'id': circle['id'], 'point': location_point});
			});
		
			// When the image is loaded, remove all regions and
			// render the image
			render();
		}
		image.src = image_src;
	}
}

// Adjust canvas to image size, i.e. fit the image in the canvas
function adjust_image() {
	// Check whether it has to be adjusted by width or by height
	if (image.width / canvas.width > image.height / canvas.height) {
		// Since the canvas has to be adjusted by width, get the scale
		// factor by dividing canvas width by image width
		var factor = canvas.width / image.width;
		
		// Apply the scale factor both horizontally and vertically,
		// since we don't want to change the proportion of the image
		t.scale(factor, factor);
		
		// To center the image, get the shift after scaling, convert
		// the value to the real coordinates and translate the canvas
		// only vertically
		var coordY = (canvas.height - (image.height * factor)) / 2;
		var coordPt = t.transformInversePoint(0, coordY);
		t.translate(coordPt.x, coordPt.y);
	}
	else {
		// Since the canvas has to be adjusted by height, get the scale
		// factor by dividing canvas height by image height
		var factor = canvas.height / image.height;
		
		// Apply the scale factor both horizontally and vertically,
		// since we don't want to change the proportion of the image
		t.scale(factor, factor);
		
		// To center the image, get the shift after scaling, convert
		// the value to the real coordinates and translate the canvas
		// only horizontally
		var coordX = (canvas.width - (image.width * factor)) / 2;
		var coordPt = t.transformInversePoint(coordX, 0);
		t.translate(coordPt.x, coordPt.y);
	}
};

// Draw the image following the transformation matrix and draw the
// regions defined by the user
function redraw() {
	// If there is an image rendered
	if (image != null) {
		// Apply the tranformation matrix to the canvas context
		ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
		
		// Return to the original transformation to clear the canvas;
		// then return back to the last transformation
		ctx.save();
		ctx.setTransform(1,0,0,1,0,0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
		
		// Draw the image at point (0,0)
		ctx.drawImage(image, 0, 0);
		
		if (lastPointSelected) lastPointSelected.stroke = 'rgba(255,0,0,1)';
		
		$.each(location_points, function(index, location_point) {
			location_point.point.draw(ctx);
		});
		
		if (lastPointSelected) lastPointSelected.stroke = 'rgba(255,0,0,0.5)';
	}
};

// Render the image and restore all values related to it
function render() {
	// Create a new transformation matrix
	t = new Transform();
	m = t.m;
	
	// Adjust the canvas to fit the image
	adjust_image();
	
	// Set the initial position of the mouse to the center
	lastX = canvas.width / 2;
	lastY = canvas.height / 2;
	
	// Set the zoom level to the current scale factor, and set the
	// upper and the lower zoom boundaries according to the current
	// zoom level (10 scrolls up for the upper boundary, and 10
	// scrolls down for the lower boundary, assuming each spin of the
	// mouse wheel is equivalent to 3 "clicks", so 10 * 3 = 30)
	zoomLevel = Math.sqrt(Math.pow(m[0], 2) + Math.pow(m[1], 2));
	zoomUp = zoomLevel * Math.pow(scale_factor, 30);
	zoomLow = zoomLevel / Math.pow(scale_factor, 30);
	
	// Once the scale factor has changed, set it to all the regions
	// (if any) to draw their elements properly
	var factor = 1 / zoomLevel;
	$.each(location_points, function(index, location_point) {
		location_point.point.setFactor(factor);
	});
	
	// Draw the image fitted to the canvas
	redraw();
};

// Enter full screen mode
function fullscreen() {
	// If there is an image rendered
	if (image != null) {
		isFullscreen = true;
		
		// Move the canvas element to be the first element of the
		// document and make it occupy the entire screen
		var canvas_elem = $("#canvas").detach();
		$("body").prepend(canvas_elem);
		$("#canvas").removeClass("canvas-part");
		$("#canvas").addClass("canvas-full");
		
		// if ($('#btn-group-location').is(':visible')) {
			// var location_buttons = $('#btn-group-location').children().detach();
			// $('#btn-group-location-fullscreen').prepend(location_buttons);
			// $('#btn-group-location').hide();
			// $('#btn-group-location-fullscreen').show();
		// }

		$('#canvas_button_group').removeClass("part").addClass("full");
		
		// Show the "exit full screen" button
		// $("#btn-fullscreen").removeClass("enter").addClass("exit");
		// $("#btn-fullscreen").hide();
		// $("#btn-exit-fullscreen").show();
		
		// Launch an "enter-fullscreen" event
		var evt = document.createEvent("Event");
		evt.initEvent("enter-fullscreen", true, false);
		document.dispatchEvent(evt);
	}
};

// Exit full screen mode
function exit_fullscreen() {
	isFullscreen = false;
	
	// Move the canvas element to its original position
	var canvas_elem = $("#canvas").detach();
	$("#canvas_div").prepend(canvas_elem);
	$("#canvas").removeClass("canvas-full");
	$("#canvas").addClass("canvas-part");
	
	// if ($('#btn-group-location-fullscreen').is(':visible')) {
		// var location_buttons = $('#btn-group-location-fullscreen').children().detach();
		// $('#btn-group-location').prepend(location_buttons);
		// $('#btn-group-location').show();
		// $('#btn-group-location-fullscreen').hide();
	// }
	
	$('#canvas_button_group').removeClass("full").addClass("part");
	
	// Show the "full screen" button
	// $("#btn-fullscreen").removeClass("exit").addClass("enter");
	// $("#btn-fullscreen").show();
	// $("#btn-exit-fullscreen").hide();
	
	// Launch an "exit-fullscreen" event
	var evt = document.createEvent("Event");
	evt.initEvent("exit-fullscreen", true, false);
	document.dispatchEvent(evt);
};

// Function to be executed when user presses a key
$(document).keydown(function(e) {
	// Exit full screen mode if "ESC" key is pressed and the full
	// screen mode is activated
	if (e.keyCode == 27 && isFullscreen) exit_fullscreen();
});

// Execute when all document elements are loaded
$(document).ready(function() {
	
	if ($("#canvas").length == 0) return;
	
	// Set the canvas size and get it and its context
	$("#canvas").attr("width", $("#canvas_div").width());
	$("#canvas").attr("height", $("#canvas_div").height());
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	// Check whether the browser of the user is Internet Explorer
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		isIE = true;
	}
	
	// If the browser is Internet Explorer, remove the sliders
	if (isIE) {
		$('#radius_slider').detach();
	}
	
	$('#btn-fullscreen').click(function() {
		if ($(this).parent().hasClass('part')) fullscreen();
		else if ($(this).parent().hasClass('full')) exit_fullscreen();
	});
	
	$('.btn-location').click(function() {
		// Check which button has been clicked
		var option = $(this).attr("id").substr(4).slice(0, -7);
		
		if ($(this).hasClass('selected')) {
			// If the clicked button is the same that was
			// previously selected, deselect it
			$(this).removeClass('selected');
			optionSelected = "none";
		}
		else {
			// If the clicked button is different from the last
			// selected button, change it
			$('.btn-location').removeClass('selected');
			$(this).addClass('selected');
			optionSelected = option;
		}
	});
	
	// Function to execute when the radius slider is changed
	// ('input' tag is for IE compatibility)
	$('#radius_slider').on('input change', function() {
		// Set the value of the radius input box to the value
		// indicated by the slider
		$('#radius_value').val($(this).val());
		$('#radius_value').change();
	});
	
	// Function to execute when the radius input box is changed
	$('#radius_value').on('change', function() {
		// Get the value of the input box
		var value = $(this).val();
		
		// Keep the value between 1 and 10
		if (value >= 1 && value <= 10) value = Math.round(value);
		else if (value > 10) value = 10;
		else value = 1;
		
		// Modify the value if it is out of bounds
		$(this).val(value);
		$('#radius_slider').val(value);
		
		if (lastPointSelected) {
			// lastPointSelected.setRadius((value * (Math.max(image.width, image.height) / 2)) / 10);
			lastPointSelected.setRadius(value);
			redraw();
		}
		
		// For each region set the new radius for the points
		// $.each(regions, function(index, region) {
			// region.setRadius(value);
		// });
		
		// Draw all the elements with the new radius
		// redraw();
	});
	
	// Function to execute when the mouse button is pressed down
	// inside the canvas
	canvas.addEventListener('mousedown', function(evt) {
		// Avoid word selection when interacting with canvas
		document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
		
		// Get canvas offset and compute canvas coordinates
		var offset = $("#canvas").offset();
		lastX = evt.pageX - offset.left;
		lastY = evt.pageY - offset.top;
		
		noDraw = false;
		dragged = true;
		lastPointSelected = false;
		
		if (optionSelected == "edit" || optionSelected == "delete") {
			var pt = t.transformInversePoint(lastX, lastY);
			
			$.each(location_points, function(index, location_point) {
				if (location_point.point.contains(pt.x, pt.y)) {
					pointSelected = location_point;
					lastPointSelected = pointSelected.point;
					$('#radius_value').val(lastPointSelected.r).change();
					redraw();
					return false;
				}
			});
		}
	}, false);

	// Function to execute when the mouse is moved inside the document
	document.addEventListener('mousemove', function(evt) {
		
		if ($("#canvas").length == 0) return;
		
		// Get canvas offset
		var offset = $("#canvas").offset();
		
		// Check whether the mouse has been moved with respect to the
		// last computed mouse coordinates
		var moved = false;
		if (lastX != (evt.pageX - offset.left) || lastY != (evt.pageY - offset.top)) moved = true;
		
		// Convert old canvas coordinates to real ones
		var lastPt = t.transformInversePoint(lastX, lastY);
		
		// Compute current canvas coordinates
		lastX = evt.pageX - offset.left;
		lastY = evt.pageY - offset.top;

		// Check whether a point has been selected and whether the
		// user is editing the region; otherwise, check whether the
		// user is dragging
		if (pointSelected && optionSelected == "edit") {
			if (moved) {
				var pt = t.transformInversePoint(lastX, lastY);
				pointSelected.point.edit(pt.x, pt.y);
				
				redraw();
			}
		}
		else if (dragged) {
			// The user is dragging all the elements, including the
			// background image; elements must not be modified
			if (moved) noDraw = true;
			
			// Convert current canvas coordinates to real
			// coordinates and translate the canvas according to
			// them
			var pt = t.transformInversePoint(lastX, lastY);
			t.translate(pt.x - lastPt.x, pt.y - lastPt.y);
			
			// Draw all the elements with the new position
			redraw();
		}
	}, false);

	// Function to execute when the mouse button is released inside
	// the document
	document.addEventListener('mouseup', function(evt) {
		// Reset all variables related to mouse dragging and point
		// selection
		noDraw = true;
		dragged = false;
		pointSelected = false;
	}, false);
	
	// Function to execute when the mouse button is released inside
	// the canvas
	// Propagation type is "bubbling", so the "canvas" event is
	// executed first, and then the "document" event
	canvas.addEventListener('mouseup', function(evt) {
		if (image != null && !pointSelected && !noDraw && optionSelected == "edit") {
			var pt = t.transformInversePoint(lastX, lastY);
			var radius = parseInt($('#radius_value').val());
			// radius = (radius * (Math.max(image.width, image.height) / 2)) / 10;
			// var radius_factor = (Math.max(image.width, image.height) / 2) / 10;
			
			var location_point = new LocationPoint(pt.x, pt.y, radius, 1, 'rgba(255,0,0,0.5)', radius_factor);
			lastPointSelected = location_point;
			location_point.setFactor(1 / Math.sqrt(Math.pow(m[0], 2) + Math.pow(m[1], 2)));
			location_points.push({'id': -1, 'point': location_point});
			
			// redraw();
		}
		else if (pointSelected && !noDraw && optionSelected == "delete") {
			// Get the index of the selected point and remove it
			var index = location_points.indexOf(pointSelected);
			if (index > -1) location_points.splice(index, 1);
			
			// redraw();
		}
		
		redraw();
	}, false);
	
	// Zoom in or zoom out the canvas around the mouse position
	// depending on the value of the "clicks" parameter
	var zoom = function(clicks) {
		// If the current zoom level is in bounds, or if it is out of
		// bounds but the user wants to set it inside again, then zoom
		// in or out
		if (zoomLevel > zoomLow && zoomLevel < zoomUp ||
		  zoomLevel <= zoomLow && clicks > 0 ||
		  zoomLevel >= zoomUp && clicks < 0) {
			// Convert  canvas coordinates to real coordinates and
			// translate the canvas according to them, thus matching
			// the upper left corner of the canvas with the image
			// point under the mouse position
			var pt = t.transformInversePoint(lastX, lastY);
			t.translate(pt.x, pt.y);
			
			// Scale the canvas by the scale factor as many times as
			// the "clicks" value indicates
			// If the value is positive, the canvas will be zoomed in;
			// otherwise, it will be zoomed out
			var factor = Math.pow(scale_factor, clicks);
			t.scale(factor, factor);
			
			// Restore the canvas to its initial position; by this
			// way, the canvas will be scaled and positioned to the
			// same point it was before zooming it
			t.translate(-pt.x, -pt.y);
			
			// Once the scale factor has changed, set it to all the
			// regions to draw their elements properly
			factor = 1 / Math.sqrt(Math.pow(m[0], 2) + Math.pow(m[1], 2));
			$.each(location_points, function(index, location_point) {
				location_point.point.setFactor(factor);
			});

			// Set the zoom level to the current scale factor
			zoomLevel = 1 / factor;
			
			// Draw all the elements according to the new scale factor
			redraw();
		}
	};

	// Function to execute to simulate the behaviour of the mouse
	// scroll
	var scroll = function(evt) {
		var delta;
		
		// Get the number of times (delta) the user has scrolled (i.e.
		// the number of times the user has spinned the mouse wheel)
		// Different functions to enable browser compatibility
		if (evt.wheelDelta) delta = evt.wheelDelta/40;
		else if (evt.detail) delta = evt.detail;
		else delta = 0;
		
		// If there is at least one spin (positive or negative), zoom
		// the canvas
		if (delta) zoom(delta);
		
		// Avoid standard behaviour of the scroll event and stop its
		// propagation by returning false
		return evt.preventDefault() && false;
	};

	// Functions to execute when the mouse scroll (usually the mouse
	// wheel) is changed inside the canvas
	// Different functions to enable browser compatibility
	canvas.addEventListener('DOMMouseScroll', scroll, false);
	canvas.addEventListener('mousewheel', scroll, false);
	
	// Function to execute when the window changes its size
	window.addEventListener('resize', function() {
		// Launch an "enter-fullscreen" event
		var evt = document.createEvent("Event");
		evt.initEvent("enter-fullscreen", true, false);
		document.dispatchEvent(evt);
	}, false);

	// Function to execute when the "enter-fullscreen" event is
	// launched
	window.addEventListener('enter-fullscreen', function() {
		// Check whether the full screen mode is enabled
		if (isFullscreen) {
			// Set the canvas size to the whole window size
			$("#canvas").attr("width", window.innerWidth);
			$("#canvas").attr("height", window.innerHeight);
			
			// Reset the transformation matrix so that the image
			// returns to its initial size and position
			t.reset();
			m = t.m;
			
			// Adjust the canvas so that the image fits the canvas
			// size and is centered
			adjust_image();
			
			var factor = 1 / Math.sqrt(Math.pow(m[0], 2) + Math.pow(m[1], 2));
				
			$.each(location_points, function(index, location_point) {
				location_point.point.setFactor(factor);
			});

			// Reset the zoom level to the current scale factor
			zoomLevel = 1 / factor;
			
			// Draw all the elements according to the new scale factor
			// and position
			redraw();
		}
	}, false);

	// Function to execute when the "exit-fullscreen" event is
	// launched
	window.addEventListener('exit-fullscreen', function() {
		// Set the canvas size to the initial size of the canvas box
		$("#canvas").attr("width", $("#canvas_div").width());
		$("#canvas").attr("height", $("#canvas_div").height());
		
		// Reset the transformation matrix so that the image returns
		// to its initial size and position
		t.reset();
		m = t.m;
		
		// Adjust the canvas so that the image fits the canvas size
		// and is centered
		adjust_image();
		
		var factor = 1 / Math.sqrt(Math.pow(m[0], 2) + Math.pow(m[1], 2));
			
		$.each(location_points, function(index, location_point) {
			location_point.point.setFactor(factor);
		});
		
		// Reset the zoom level to the current scale factor
		zoomLevel = 1 / factor;
		
		// Draw all the elements according to the new scale factor and
		// position
		redraw();
	}, false);
});