/* 
 * Author: Pau Xiberta i Armengol (c)
 * Date: 30/05/2018 (revised: 11/06/2018)
 * Summary: Canvas interaction for 3D location problems (JavaScript file)
 */

var isFullscreen = false;
var isIE = false;

var scene;
var mouse = new THREE.Vector2(0, 0);
var last_mouse = new THREE.Vector2(0, 0);
var raycaster = new THREE.Raycaster();
var jloader = new THREE.JSONLoader();
var controls;
var models = {};
var initial_models = {};
var camera;
var renderer;
var unselected_material = new THREE.MeshPhongMaterial({color: "rgb(220,220,220)"});
var selected_material = new THREE.MeshPhongMaterial({color: "rgb(220,255,0)"});
var solution_material = new THREE.MeshPhongMaterial({color: "rgb(0,255,0)"});
var canvas;
var canvas_width;
var canvas_height;
var whole_box = new THREE.Box3(); // default -> min: + Infinity, max: - Infinity
var whole_box_aux = new THREE.Box3();
var new_ids_count = -1;

function setModels() {
	function setup() {
		// var models_list = [
			// {id: 14, path: "./left_femur.json", filename: "left_femur.json", name: "Left femur", file: null, solution: 0, matrix: new THREE.Matrix4(), material: unselected_material},
			// {id: 21, path: "./left_fibula.json", filename: "left_fibula.json", name: "Left fibula", file: null, solution: 0, matrix: new THREE.Matrix4(), material: unselected_material},
			// {id: 7, path: "./right_femur.json", filename: "right_femur.json", name: "Right femur", file: null, solution: 0, matrix: new THREE.Matrix4(), material: unselected_material},
			// {id: 5, path: "./vertebrae_lumbar.json", filename: "vertebrae_lumbar.json", name: "Vertebrae lumbar", file: null, solution: 0, matrix: new THREE.Matrix4(), material: unselected_material},
			// {id: 20, path: "./vertebrae_thoracic.json", filename: "vertebrae_thoracic.json", name: "Vertebrae thoracic", file: null, solution: 0, matrix: new THREE.Matrix4(), material: unselected_material}
		// ];
		
		var models_list = [];
		$.each(initial_models, function(id, model) {
			model.matrix = buildMatrix4FromJSON(model.matrix);
			model.material = buildMaterialFromJSON(model.material);
			
			models_list.push({id: id, path: model.path, filename: model.filename, name: model.name, file: model.file, solution: model.solution, matrix: model.matrix, material: model.material});
		});
		
		// $.each(models_list, function(index, model) {
			// initial_models[model.id] = {path: model.path, filename: model.filename, name: model.name, file: model.file, solution: model.solution, matrix: model.matrix, material: model.material};
		// });
		
		whole_box_aux = whole_box.clone();
		loadModelsRecursive(0, models_list);
	}
	
	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}
	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(45, canvas_width / canvas_height, 0.1, 10000);
	
	var ambientLight = new THREE.AmbientLight(0x555555);
	scene.add(ambientLight);
	
	var directionalLight1 = new THREE.DirectionalLight(0xe0e0e0);
	directionalLight1.position.set(5, 2, 5).normalize();
	scene.add(directionalLight1);
	
	var directionalLight2 = new THREE.DirectionalLight(0xe0e0e0);
	directionalLight2.position.set(-5, -2, -5).normalize();
	scene.add(directionalLight2);
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(canvas_width, canvas_height);
	renderer.setClearColor(0xfafffa, 1);
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	
	var span = document.getElementById("canvas");
	span.appendChild(renderer.domElement);
	
	canvas = $("#canvas canvas")[0];
	
	$(canvas).css('height', '');
	$(canvas).css('width', '');
	
	span.addEventListener('mousemove', onDocumentMouseMove, false);
	span.addEventListener('mousedown', onDocumentMouseDown, false);
	span.addEventListener('mouseup', onDocumentMouseUp, false);
	
	span.addEventListener('touchmove', onDocumentMouseMove, false);
	span.addEventListener('touchstart', onDocumentMouseDown, false);
	span.addEventListener('touchend', onDocumentMouseUp, false);
	
	setup();
	animate();
}

function loadModelsRecursive(index, models_list) {
	if (index < models_list.length) {
		var id = models_list[index].id;
		var path = "http://localhost/vertebrae_sacral.json";
		var filename = models_list[index].filename;
		var name = models_list[index].name;
		var file = models_list[index].file;
		var solution = models_list[index].solution;
		var matrix = models_list[index].matrix;
		var material = models_list[index].material;
		
		jloader.load(path, function (geometry) {
			var mesh = new THREE.Mesh(geometry, material);
			mesh.ID = id;
			models[id] = {path: path, filename: filename, name: name, file: file, solution: solution, matrix: matrix, material: material, mesh: mesh};
			mesh.applyMatrix(matrix);
			scene.add(mesh);
			
			var box = new THREE.Box3().setFromObject(mesh);
			if (box.min.x < whole_box.min.x) whole_box.min.x = box.min.x;
			if (box.max.x > whole_box.max.x) whole_box.max.x = box.max.x;
			if (box.min.y < whole_box.min.y) whole_box.min.y = box.min.y;
			if (box.max.y > whole_box.max.y) whole_box.max.y = box.max.y;
			if (box.min.z < whole_box.min.z) whole_box.min.z = box.min.z;
			if (box.max.z > whole_box.max.z) whole_box.max.z = box.max.z;
			
			$('#displayed_models_select').append('<option value="' + id + '">' + name + '</option>');
			
			if (solution == 1) {
				mesh.material = solution_material;
				
				if ($('#list_models_solution_select option[value="' + id + '"]').val() === undefined) {
					$('#list_models_solution_select').append('<option value="' + id + '">' + name + '</option>');
				}
			}
			
			loadModelsRecursive(index + 1, models_list);
		});
	}
	else {
		if (!whole_box.equals(whole_box_aux)) {
			var centre = new THREE.Vector3();
			var size = new THREE.Vector3();
			
			whole_box.getCenter(centre);
			whole_box.getSize(size);
			
			camera.position.set(centre.x, centre.y, centre.z + size.z);
			controls.target.set(centre.x, centre.y, centre.z);
			controls.update();
		}
		
		sortDisplayedModelsSelect();
	}
}

function loadFileModels(models_list) {
	for (var i = 0; i < models_list.length; i++) {
		var id = new_ids_count--; // Decrement after assignment
		models_list[i].id = id;
		models_list[i].solution = 0;
		models_list[i].matrix = new THREE.Matrix4();
		models_list[i].material = unselected_material;
	}
	
	whole_box_aux.copy(whole_box);
	loadModelsRecursive(0, models_list);
}

// Sort options from models "select"
function sortDisplayedModelsSelect() {
	// Get options and build array with their "text" (t) and "value" (v)
	var options = $('#displayed_models_select option');
	var array = options.map(function(_, o) { return {t: $(o).text(), v: o.value} }).get();
	
	// Sort array ignoring case
	array.sort(function(o1, o2) {
		var t1 = o1.t.toLowerCase(), t2 = o2.t.toLowerCase();
		return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
	});
	
	// Change options from "select" directly
	options.each(function(i, o) {
		o.value = array[i].v;
		$(o).text(array[i].t);
	});
}

function removeModel(id) {
	$('#displayed_models_select option[value="' + id + '"]').remove();
	$('#list_models_solution_select option[value="' + id + '"]').remove();
	scene.remove(models[id].mesh);
	delete models[id];
	
	whole_box_aux.copy(whole_box);
	whole_box = new THREE.Box3();
	$.each(models, function(index, model) {
		var box = new THREE.Box3().setFromObject(model.mesh);
		if (box.min.x < whole_box.min.x) whole_box.min.x = box.min.x;
		if (box.max.x > whole_box.max.x) whole_box.max.x = box.max.x;
		if (box.min.y < whole_box.min.y) whole_box.min.y = box.min.y;
		if (box.max.y > whole_box.max.y) whole_box.max.y = box.max.y;
		if (box.min.z < whole_box.min.z) whole_box.min.z = box.min.z;
		if (box.max.z > whole_box.max.z) whole_box.max.z = box.max.z;
	});
	
	if (!whole_box.equals(whole_box_aux)) {
		var centre = new THREE.Vector3();
		
		whole_box.getCenter(centre);
		
		controls.target.set(centre.x, centre.y, centre.z);
		controls.update();
	}
}

function buildMatrix4FromJSON(object) {
	var elements = 'elements' in object ? object.elements : null;
	
	var matrix = new THREE.Matrix4();
	
	if (elements != null) matrix.fromArray(elements);
	
	return matrix;
}

function buildMaterialFromJSON(object) {
	var color = 'color' in object ? '#' + object.color.toString(16) : '#DCDCDC';
	var transparent = 'transparent' in object ? object.transparent : false;
	var opacity = 'opacity' in object ? object.opacity : 1.0;
	
	var material = new THREE.MeshPhongMaterial({color: color, transparent: transparent, opacity: opacity});
	
	return material;
}

function onDocumentMouseMove(event) {
	var offset = $(canvas).offset();
	
	if (event.type == "mousemove") {
		mouse.x = ((event.pageX - offset.left) / canvas.width) * 2 - 1;
		mouse.y = - ((event.pageY - offset.top) / canvas.height) * 2 + 1;
	}
	else {
		mouse.x = ((event.touches[0].pageX - offset.left) / canvas.width) * 2 - 1;
		mouse.y = - ((event.touches[0].pageY - offset.top) / canvas.height) * 2 + 1;
	}
}

function onDocumentMouseDown(event) {
	var offset = $(canvas).offset();
	
	if (event.type == "mousedown") {
		last_mouse.x = ((event.pageX - offset.left) / canvas.width) * 2 - 1;
		last_mouse.y = - ((event.pageY - offset.top) / canvas.height) * 2 + 1;
	}
	else {
		last_mouse.x = ((event.touches[0].pageX - offset.left) / canvas.width) * 2 - 1;
		last_mouse.y = - ((event.touches[0].pageY - offset.top) / canvas.height) * 2 + 1;
	}
}

function onDocumentMouseUp(event) {
	var offset = $(canvas).offset();
	
	if (event.type == "mouseup") {
		mouse.x = ((event.pageX - offset.left) / canvas.width) * 2 - 1;
		mouse.y = - ((event.pageY - offset.top) / canvas.height) * 2 + 1;
	}
	else {
		mouse.x = ((event.changedTouches[event.changedTouches.length - 1].pageX - offset.left) / canvas.width) * 2 - 1;
		mouse.y = - ((event.changedTouches[event.changedTouches.length - 1].pageY - offset.top) / canvas.height) * 2 + 1;
	}
	
	if (Math.sqrt((mouse.x - last_mouse.x) * (mouse.x - last_mouse.x) + (mouse.y - last_mouse.y) * (mouse.y - last_mouse.y)) < 0.005) {
		raycaster.setFromCamera(mouse, camera);
		var objects = $.map(models, function(value, key) { return value.mesh });
		var hits = raycaster.intersectObjects(objects, true);
		
		for (var key in models) {
			if ($('#list_models_solution_select option[value="' + key + '"]').val() === undefined) {
				models[key].mesh.material = models[key].material;
			}
			else {
				models[key].mesh.material = solution_material;
			}
		}
		
		if (hits.length > 0) {
			var selected = hits[0].object;
			selected.material = selected_material;
			$('#displayed_models_select').val(selected.ID);
		}
	}
}

// Execute when all document elements are loaded
$(document).ready(function() {
	// Set the canvas size
	canvas_width = $('#canvas_div').width();
	canvas_height = $('#canvas_div').height();
	
	// Check whether the browser of the user is Internet Explorer
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		isIE = true;
	}
	
	setModels();
	
	$('#btn-fullscreen').click(function() {
		if ($(this).parent().hasClass('part')) fullscreen();
		else if ($(this).parent().hasClass('full')) exit_fullscreen();
	});
	
	$('#displayed_models_select').change(function() {
		var id = $('#displayed_models_select option:selected').val();
		
		for (var key in models) {
			if ($('#list_models_solution_select option[value="' + key + '"]').val() === undefined) {
				models[key].mesh.material = models[key].material;
			}
			else {
				models[key].mesh.material = solution_material;
			}
		}
		
		models[id].mesh.material = selected_material;
	});
	
	$('#btn-add-model-solution').click(function() {
		var id = $('#displayed_models_select option:selected').val();
		
		models[id].mesh.material = solution_material;
		models[id].solution = 1;
		
		if ($('#list_models_solution_select option[value="' + id + '"]').val() === undefined) {
			$('#list_models_solution_select').append('<option value="' + id + '">' + models[id].name + '</option>');
		}
	});
	
	$('#btn-remove-selected-model').click(function() {
		if ($('#list_models_solution_select option:selected').length) {
			var id = $('#list_models_solution_select option:selected').val();
			models[id].mesh.material = models[id].material;
			models[id].solution = 0;
			
			$('#list_models_solution_select option[value="' + id + '"]').remove();
		}
	});
	
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
			$(canvas).attr("width", window.innerWidth);
			$(canvas).attr("height", window.innerHeight);
			
			// Change aspect ratio from camera and update matrix
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			
			// Change renderer size
			renderer.setSize(window.innerWidth, window.innerHeight);
		}
	}, false);

	// Function to execute when the "exit-fullscreen" event is
	// launched
	window.addEventListener('exit-fullscreen', function() {
		// Set the canvas size to the initial size of the canvas box
		$(canvas).attr("width", $("#canvas_div").width());
		$(canvas).attr("height", $("#canvas_div").height());
		
		// Change aspect ratio from camera and update matrix
		camera.aspect = $("#canvas_div").width() / $("#canvas_div").height();
		camera.updateProjectionMatrix();
		
		// Change renderer size
		renderer.setSize($("#canvas_div").width(), $("#canvas_div").height());
	}, false);
});

// Enter full screen mode
function fullscreen() {
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






/*
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
*/