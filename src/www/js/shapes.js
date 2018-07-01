/* 
 * Author: Pau Xiberta i Armengol (c)
 * Date: 06/03/2015 (revised: 05/05/2016)
 * Summary: ROI and other shapes definition (JavaScript file)
 */

// Function to create a new region
// Parameters:
// - t: thickness of the path
// - fill: colour of the path when the region is selected
// - fill_unselected: colour of the path when the region is
//   not selected
// - point_radius: radius of every point of the region
// - point_fill: colour of every point of the region when it
//   is selected
// - point_fill_unselected: colour of every point of the
//   region when it is not selected
// - curved_path: indicates whether the path is defined by
//   Bezier curves (value to true) or polylines (value to
//   false)
function Region(t, fill, fill_unselected, point_radius, point_fill, point_fill_unselected, curved_path) {
	// Initialize all the arrays:
	// - points: points of the user defined path
	// - middle_points: ghost points in the middle of two
	//   real points that can be converted to real points
	// - control_points: invisible points to control the
	//   curvature of a path defined by Bezier curves
	this.points = [];
	this.middle_points = [];
	this.control_points = [];
	
	// Initialize the region settings taking the values from
	// the parameters or from the default values
	this.t = t || 1;
	this.fill = fill || 'rgba(0,255,0,1)';
	this.fill_unselected = fill_unselected || 'rgba(0,255,0,0.5)';
	this.point_radius = point_radius || 5;
	this.point_fill = point_fill || 'rgba(0,0,0,1)';
	this.point_fill_unselected = point_fill_unselected || 'rgba(0,0,0,0.5)';
	this.curved_path = curved_path || false;
	this.closed = false;
	this.selected = false;
	this.factor = 1;
	this.selected_point = null;
}

// Get all the pixels from a line segment defined by two
// points using the Bresenham's algorithm
function line(p0, p1) {
	// Get the coordinates
	var x0 = Math.round(p0.x);
	var y0 = Math.round(p0.y);
	var x1 = Math.round(p1.x);
	var y1 = Math.round(p1.y);
	
	var pixels = [];
	
	// Get the differences, the directions and the initial
	// error
	var dx = Math.abs(x1 - x0);
	var dy = Math.abs(y1 - y0);
	var sx = (x0 < x1) ? 1 : -1;
	var sy = (y0 < y1) ? 1 : -1;
	var err = dx - dy;
	
	while (true) {
		// Add the current coordinates as a pixel of the
		// line segment
		pixels.push(x0);
		pixels.push(y0);
		
		// If the differences between coordinates are small
		// enough, then the last point is reached and the
		// loop can be ended
		if (Math.abs(x0 - x1) < 0.0001 && Math.abs(y0 - y1) < 0.0001) break;
		
		// Compute the double of the error
		var e2 = 2 * err;
		
		// Decide if the "x" coordinate has to advance
		if (e2 > -dy) {
			err -= dy;
			x0 += sx;
		}
		
		// Decide if the "y" coordinate has to advance
		if (e2 < dx) {
			err += dx;
			y0 += sy;
		}
	}
	
	return pixels;
}

// Get the coordinate ("x" or "y") of the Bezier curve given
// its two points and its two control points, and the step
// "t" (time) of the curve, which has to lie in the range
// [0,1]
function bezier_coord(t, p0, p1, c1, c2) {
	// Compute t^2 and t^3
	var t2 = t * t;
	var t3 = t2 * t;
	
	// Compute and return the coordinate of the Bezier curve
	// from the parametric function of Bezier curves
	return p0 + (-p0 * 3 + t * (3 * p0 - p0 * t)) * t
		+ (3 * c1 + t * (-6 * c1 + c1 * 3 * t)) * t
		+ (c2 * 3 - c2 * 3 * t) * t2
		+ p1 * t3;
}

// Get all the pixels from a Bezier curve defined by two
// points and two control points
function bezier(p0, p1, c1, c2) {
	var pixels = [];

	// Compute the approximate length of the Bezier curve;
	// actually, the length computed is equal to the
	// length of the semicircle with the same end points as
	// the Bezier curve
	var approx_length = (distance(p0, p1) * Math.PI) / 2;

	// Set the number of pixels to match the computed
	// approximate length (rounded)
	var num_pixels = Math.round(approx_length);

	// Get all the pixels
	for (var i = 0; i <= num_pixels; i++) {
		// Compute the "time" value (the position of the
		// pixel in the range [0,1])
		var t = i / num_pixels;
		
		// Compute the coordinates of the pixel
		var x = bezier_coord(t, p0.x, p1.x, c1.x, c2.x);
		var y = bezier_coord(t, p0.y, p1.y, c1.y, c2.y);
		
		// Add the pixel to the array of pixels
		pixels.push(x);
		pixels.push(y);
	}
	
	return pixels;
}

// Compute the distance between two points
function distance(p0, p1) {
	return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
}

// Compute the control points for the middle point of a
// pair of Bezier curves defined by three points, i.e.,
// compute the second control point for the first Bezier
// curve (defined by points p0 and p1), and the first
// control point for the second Bezier curve (defined by
// points p1 and p2)
function getControlPoints(p0, p1, p2) {
	// Set the "tension" parameter to 0.5, the standard
	// value (the possible range is [0,1])
	var t = 0.5;
	
	// Compute the coordinate differences between first
	// and third point
	var v = [p2.x - p0.x, p2.y - p0.y];
	
	// Compute the distances between first and second
	// point, and between second and third point; then
	// sum both distances
	var d01 = distance(p0, p1);
	var d12 = distance(p1, p2);
	var d012 = d01 + d12;
	
	// Compute the control points using a formula
	return [{"x": p1.x - v[0] * t * d01 / d012, "y": p1.y - v[1] * t * d01 / d012},
			{"x": p1.x + v[0] * t * d12 / d012, "y": p1.y + v[1] * t * d12 / d012}];
}

// Compute the pixels of the region path
Region.prototype.getPixels = function() {
	var pixels = [];
	
	// Get the points of the region
	var points = this.points;
	
	// Check whether the path is curved or not
	if (this.curved_path) {
		// Get the control points of the Bezier curves
		var cps = this.control_points;
		
		var p0, p1, cp1, cp2, pix;
		
		// Get the points and the control points of the
		// first Bezier curve
		p0 = points[0];
		p1 = points[1];
		cp1 = cps[cps.length - 1];
		cp2 = cps[0];
		
		// Compute the pixels for this curve, remove the
		// last (it will be the same as the first pixel
		// of the next curve), and add them to the array
		// of pixels
		pix = bezier(p0, p1, cp1, cp2);
		pix.splice(-2, 2);
		pixels = pixels.concat(pix);
		
		// For each middle curve, compute its pixels
		for (var i = 1; i < points.length - 1; i++) {
			// Get the points and the control points of the
			// Bezier curve
			p0 = points[i];
			p1 = points[i+1];
			cp1 = cps[2 * i - 1];
			cp2 = cps[2 * i];
			
			// Compute and add the pixels as before
			pix = bezier(p0, p1, cp1, cp2);
			pix.splice(-2, 2);
			pixels = pixels.concat(pix);
		}
		
		// Get the points and the control points of the
		// last Bezier curve
		p0 = points[points.length - 1];
		p1 = points[0];
		cp1 = cps[2 * i - 1];
		cp2 = cps[2 * i];
		
		// Compute and add the pixels as before
		pix = bezier(p0, p1, cp1, cp2);
		pix.splice(-2, 2);
		pixels = pixels.concat(pix);
	}
	else {
		var p0, p1, pix;
		
		// For each line segment (except the last), compute
		// its pixels
		for (var i = 0; i < points.length - 1; i++) {
			// Get the end points of the line segment
			p0 = points[i];
			p1 = points[i+1];
			
			// Compute the pixels for this line segment,
			// remove the last (it will be the same as the
			// first pixel of the next line segment), and
			// add them to the array of pixels
			pix = line(p0, p1);
			pix.splice(-2, 2);
			pixels = pixels.concat(pix);
		}
		
		// Get the end points of the last line segment
		p0 = points[points.length - 1];
		p1 = points[0];
		
		// Compute and add the pixels as before
		pix = line(p0, p1);
		pix.splice(-2, 2);
		pixels = pixels.concat(pix);
	}
	
	return pixels;
}

// Draw the region with all its elements to a specific
// canvas context
Region.prototype.draw = function(ctx) {
	// Get the points of the region and count them
	var points = this.points;
	var num_points = points.length;
	
	// Reset the middle points and the control points
	this.middle_points = [];
	this.control_points = [];
	
	// Start drawing the path of the region
	// Check whether the region has more than one point
	if (num_points > 1) {
		// Get the first point and begin a path starting at
		// it
		var point = points[0];
		ctx.beginPath();
		ctx.moveTo(point.x, point.y);
		
		// Check whether the path is curved or not
		if (this.curved_path) {
			// Check whether the region has only two points
			if (num_points == 2) {
				// Continue the path by drawing a line to
				// the second point
				ctx.lineTo(points[1].x, points[1].y);

				// Compute the middle point of the line and
				// add it to the array of middle points
				var x = (points[0].x + points[1].x) / 2;
				var y = (points[0].y + points[1].y) / 2;
				this.middle_points.push(new Point(x, y, this.point_radius, this.point_fill_unselected, true, this));
			}
			else {
				// Compute the control points of the Bezier
				// curves except the last ones (actually,
				// the last and the first one)
				for (var i = 0; i < num_points - 2; i++) {
					this.control_points = this.control_points.concat(getControlPoints(points[i], points[i+1], points[i+2]));
				}
				
				// Check whether the path is closed or not
				if (this.closed) {
					// If the path is closed, the control
					// points related to the first and the
					// last point are computed as normal
					this.control_points = this.control_points.concat(getControlPoints(points[num_points - 2], points[num_points - 1], points[0]));
					this.control_points = this.control_points.concat(getControlPoints(points[num_points - 1], points[0], points[1]));
					
					var cp = this.control_points;
					
					// Move the path cursor to the second
					// point to start the path drawing at
					// there (it is simply a matter of loop
					// optimization, since this way the
					// control points can be traversed
					// properly)
					ctx.moveTo(points[1].x, points[1].y);
					
					// If the region is selected, compute
					// the middle point of the Bezier curve
					// defined by the first and the second
					// point, and add it to the array of
					// middle points; it will be the first
					// middle point
					if (this.selected) {
						var x = bezier_coord(0.5, points[0].x, points[1].x, cp[cp.length - 1].x, cp[0].x);
						var y = bezier_coord(0.5, points[0].y, points[1].y, cp[cp.length - 1].y, cp[0].y);
						this.middle_points.push(new Point(x, y, this.point_radius, this.point_fill_unselected, true, this));
					}
					
					// Compute all the middle Bezier curves
					for (var i = 2; i < num_points - 1; i++) {
						// Compute the indices for both
						// control points, and compute a
						// Bezier curve from the previous
						// point to the current point
						var index_cp2 = 2 * (i-1);
						var index_cp1 = index_cp2 - 1;
						ctx.bezierCurveTo(cp[index_cp1].x, cp[index_cp1].y, cp[index_cp2].x, cp[index_cp2].y, points[i].x, points[i].y);
						
						// If the region is selected,
						// compute the middle point of the
						// Bezier curve just created and
						// add it to the array of middle
						// points
						if (this.selected) {
							x = bezier_coord(0.5, points[i-1].x, points[i].x, cp[index_cp1].x, cp[index_cp2].x);
							y = bezier_coord(0.5, points[i-1].y, points[i].y, cp[index_cp1].y, cp[index_cp2].y);
							this.middle_points.push(new Point(x, y, this.point_radius, this.point_fill_unselected, true, this));
						}
					}
					
					// Compute the index of the first
					// control point among the last ones
					// required to compute the last Bezier
					// curves
					var first_cp = num_points * 2 - 5;
					
					// If the region is selected, compute
					// the middle points of the last two
					// Bezier curves and add them to the
					// array of middle points (the middle
					// point for the last Bezier curve to
					// compute, i.e. the first Bezier curve
					// of the path, is already added, since
					// it has been done before the loop)
					if (this.selected) {
						x = bezier_coord(0.5, points[num_points - 2].x, points[num_points - 1].x, cp[first_cp].x, cp[first_cp + 1].x);
						y = bezier_coord(0.5, points[num_points - 2].y, points[num_points - 1].y, cp[first_cp].y, cp[first_cp + 1].y);
						this.middle_points.push(new Point(x, y, this.point_radius, this.point_fill_unselected, true, this));
						
						x = bezier_coord(0.5, points[num_points - 1].x, points[0].x, cp[first_cp + 2].x, cp[first_cp + 3].x);
						y = bezier_coord(0.5, points[num_points - 1].y, points[0].y, cp[first_cp + 2].y, cp[first_cp + 3].y);
						this.middle_points.push(new Point(x, y, this.point_radius, this.point_fill_unselected, true, this));
					}
					
					// Compute the last three Bezier curves,
					// including the curve from the first to
					// the second point of the path
					ctx.bezierCurveTo(cp[first_cp].x, cp[first_cp].y, cp[first_cp + 1].x, cp[first_cp + 1].y, points[num_points - 1].x, points[num_points - 1].y);
					ctx.bezierCurveTo(cp[first_cp + 2].x, cp[first_cp + 2].y, cp[first_cp + 3].x, cp[first_cp + 3].y, points[0].x, points[0].y);
					ctx.bezierCurveTo(cp[first_cp + 4].x, cp[first_cp + 4].y, cp[0].x, cp[0].y, points[1].x, points[1].y);
				}
				else {
					var cp = this.control_points;
					
					// If the path is not closed, the first
					// control point of the first Bezier
					// curve is equivalent to its first
					// point, and the same occurs for the
					// last control point of the last Bezier
					// curve, which is equivalent to its
					// second point
					// The first Bezier curve, therefore, is
					// computed taking the first point as
					// the first control point
					ctx.bezierCurveTo(points[0].x, points[0].y, cp[0].x, cp[0].y, points[1].x, points[1].y);
					
					// If the region is selected, compute
					// the middle point of the Bezier curve
					// defined by the first and the second
					// point, and add it to the array of
					// middle points; it will be the first
					// middle point
					if (this.selected) {
						var x = bezier_coord(0.5, points[0].x, points[1].x, points[0].x, cp[0].x);
						var y = bezier_coord(0.5, points[0].y, points[1].y, points[0].y, cp[0].y);
						this.middle_points.push(new Point(x, y, this.point_radius, this.point_fill_unselected, true, this));
					}
					
					// Compute all the middle Bezier curves
					for (var i = 2; i < num_points - 1; i++) {
						// Compute the indices for both
						// control points, and compute a
						// Bezier curve from the previous
						// point to the current point
						var index_cp2 = 2 * (i-1);
						var index_cp1 = index_cp2 - 1;
						ctx.bezierCurveTo(cp[index_cp1].x, cp[index_cp1].y, cp[index_cp2].x, cp[index_cp2].y, points[i].x, points[i].y);
						
						// If the region is selected,
						// compute the middle point of the
						// Bezier curve just created and
						// add it to the array of middle
						// points
						if (this.selected) {
							x = bezier_coord(0.5, points[i-1].x, points[i].x, cp[index_cp1].x, cp[index_cp2].x);
							y = bezier_coord(0.5, points[i-1].y, points[i].y, cp[index_cp1].y, cp[index_cp2].y);
							this.middle_points.push(new Point(x, y, this.point_radius, this.point_fill_unselected, true, this));
						}
					}
					
					// Compute the index of the first
					// control point of the last Bezier
					// curve
					var first_cp = num_points * 2 - 5;
					
					// If the region is selected, compute
					// the middle point of the last Bezier
					// curve and add it to the array of
					// middle points
					if (this.selected) {
						x = bezier_coord(0.5, points[num_points - 2].x, points[num_points - 1].x, cp[first_cp].x, points[num_points - 1].x);
						y = bezier_coord(0.5, points[num_points - 2].y, points[num_points - 1].y, cp[first_cp].y, points[num_points - 1].y);
						this.middle_points.push(new Point(x, y, this.point_radius, this.point_fill_unselected, true, this));
					}
					
					// As the first, the last Bezier curve
					// is computed taking the last point as
					// the last control point
					ctx.bezierCurveTo(cp[cp.length - 1].x, cp[cp.length - 1].y, points[num_points - 1].x, points[num_points - 1].y, points[num_points - 1].x, points[num_points - 1].y);
				}
			}
		}
		else {
			// For each point, compute a line from the
			// previous point to the current point
			for (var i = 1; i < num_points; i++) {
				// Get the current point and compute the
				// line
				point = points[i];
				ctx.lineTo(point.x, point.y);
				
				// If the region is selected, compute the
				// middle point of the line segment just
				// created and add it to the array of
				// middle points
				if (this.selected) {
					var x = (points[i-1].x + point.x) / 2;
					var y = (points[i-1].y + point.y) / 2;
					this.middle_points.push(new Point(x, y, this.point_radius, this.point_fill_unselected, true, this));
				}
			}
			
			// Check whether the path is closed
			if (this.closed) {
				// If the path is closed, compute the line
				// from the last to the first point
				ctx.closePath();
				
				// If the region is selected, compute the
				// middle point of the line segment defined
				// by the last and the first point, and add
				// it to the array of middle points
				if (this.selected) {
					var x = (points[num_points - 1].x + points[0].x) / 2;
					var y = (points[num_points - 1].y + points[0].y) / 2;
					this.middle_points.push(new Point(x, y, this.point_radius, this.point_fill_unselected, true, this));
				}
			}
		}
		
		// Set the colour of the path depending on whether
		// the region is selected
		if (this.selected) ctx.strokeStyle = this.fill;
		else ctx.strokeStyle = this.fill_unselected;
		
		// Set the path thickness depending on the assigned value and
		// the scale factor
		ctx.lineWidth = this.t * this.factor;
		
		// Draw the path
		ctx.stroke();
	}

	// If there is at least one point and the region is selected,
	// change the colour of the first point to let the user know which
	// point is the first
	if (num_points > 0 && this.selected) {
		points[0].fill = '#FF0000';
	}
	
	// Draw each point defined by the user
	$.each(points, function(index, point) {
		point.draw(ctx);
	});
	
	// If the region is selected, draw also the middle points
	if (this.selected) {
		$.each(this.middle_points, function(index, point) {
			point.draw(ctx);
		});
	}
}

// Add a point to the region
Region.prototype.addPoint = function(point) {
	// Set the point radius and its filling colour
	point.r = this.point_radius;
	point.fill = this.point_fill;
	
	// Add the point to the array of points
	this.points.push(point);
	
	// If the region is closed, open it
	if (this.closed) this.open();
}

// Select a point, if any, of the region
Region.prototype.select_point = function(x, y) {
	this.selected_point = null;
	var self = this;
	
	// If the point built from the parameters is the same
	// or is near a point of the region, consider the user
	// has selected this point
	$.each(this.points, function(index, point) {
		if (point.contains(x, y)) {
			self.selected_point = point;
		}
	});
	
	// If the region is selected but no point has been
	// selected, then check whether the user is selecting
	// a middle point
	if (this.selected_point == null && this.selected) {
		// For each middle point, check whether the user
		// is selecting it
		$.each(this.middle_points, function(index, point) {
			if (point.contains(x, y)) {
				// If the user is selecting a middle point,
				// create a new point with the same
				// coodinates and add it to region's array
				// of points
				var converted_point = new Point(point.x, point.y, self.point_radius, self.point_fill, false, self);
				self.points.splice(index + 1, 0, converted_point);
				
				// Now, the selected point will be the
				// point just created
				self.selected_point = converted_point;
				
				// Exit the loop
				return false;
			}
		});
	}

	// Return true if a point has been selected, or false
	// otherwise
	return this.selected_point != null;
}

// Edit the selected point of the region changing its
// coordinates
Region.prototype.edit = function(x, y) {
	if (this.selected_point) {
		this.selected_point.x = x;
		this.selected_point.y = y;
	}
}

// Remove the selected point of the region
Region.prototype.removeSelectedPoint = function() {
	// Get the index of the selected point and remove it
	var index = this.points.indexOf(this.selected_point);
	if (index > -1) this.points.splice(index, 1);
}

// Close the region's path if the first point has been
// selected and there are enough points; return true if
// the region has been closed, or false otherwise
Region.prototype.closeIfFirstPointSelected = function() {
	// Check whether the region has more than two points
	if (this.points.length > 2) {
		// If the selected point is the same as the first
		// point and the region is not closed, close it
		if (this.selected_point == this.points[0] && !this.closed) {
			this.close();
			return true;
		}
	}
	
	return false;
}

// Select the region
Region.prototype.select = function() {
	// Set this region as selected
	this.selected = true;
	var self = this;
	
	// For each point of the region, fill it with its
	// full filling colour
	$.each(this.points, function(index, point) {
		point.fill = self.point_fill;
	});
}

// Unselect the region
Region.prototype.unselect = function() {
	// Set this region as unselected
	this.selected = false;
	var self = this;
	
	// For each point of the region, fill it with its
	// half filling colour
	$.each(this.points, function(index, point) {
		point.fill = self.point_fill_unselected;
	});
}

// Check whether the region is selected or not
Region.prototype.isSelected = function() {
	// Return true if the region is selected, false
	// otherwise
	return this.selected;
}

// Set the radius for every point of the region
Region.prototype.setRadius = function(radius) {
	// Check whether the radius is different from the
	// current one
	if (this.point_radius != radius) {
		// Set the region's point radius for future points
		this.point_radius = radius;
		
		// For each point of the region, set its radius
		$.each(this.points, function(index, point) {
			point.r = radius;
		});
		
		// For each middle point of the region, set its
		// radius
		$.each(this.middle_points, function(index, point) {
			point.r = radius;
		});
	}
}

// Set the thickness of the region's path
Region.prototype.setThickness = function(thickness) {
	this.t = thickness;
}

// Set the colours for every point of the region
Region.prototype.setPointsColour = function(colour, colour_unselected) {
	// Set the region's point colours
	this.point_fill = colour;
	this.point_fill_unselected = colour_unselected;
	var self = this;
	
	// For each point of the region, set its current
	// colour
	$.each(this.points, function(index, point) {
		// If the region is selected, the points are
		// filled with its full filling colour; otherwise,
		// they are filled with its half filling colour
		if (self.selected) point.fill = self.point_fill;
		else point.fill = self.point_fill_unselected;
	});
	
	// For each middle point of the region, set its
	// current colour to its half filling colour
	$.each(this.middle_points, function(index, point) {
		point.fill = self.point_fill_unselected;
	});
}

// Set the colours of the region's path
Region.prototype.setPathColour = function(colour, colour_unselected) {
	this.fill = colour;
	this.fill_unselected = colour_unselected;
}

// Close the region's path
Region.prototype.close = function() {
	this.closed = true;
}

// Open the region's path
Region.prototype.open = function() {
	this.closed = false;
}

// Set the scale factor of the region
Region.prototype.setFactor = function(factor) {
	this.factor = factor;
}

// Set the path type of the region ("curved" is a boolean
// which indicates whether the path is curved or not)
Region.prototype.setCurvedPathType = function(curved) {
	this.curved_path = curved;
}

// Chech whether the region's path is curved or not
Region.prototype.isCurved = function() {
	return this.curved_path;
}

// Check whether the region is empty or not (consider the
// region empty when it has no points)
Region.prototype.isEmpty = function() {
	return this.points.length == 0;
}

// Check whether the region can be considered a polygon
// (or a closed curved region)
Region.prototype.isPolygon = function() {
	// If there are more than two points, and the region
	// is closed, then the region can be considered as a
	// polygon (or a closed curved region)
	return this.points.length > 2 && this.closed;
}

// Function to create a new point
// Parameters:
// - x: "x" coordinate of the point
// - y: "y" coordinate of the point
// - r: radius of the point
// - fill: filling colour of the point
// - middle: boolean which indicates whether the point is
//   a middle point or not
// - region: the region where the point belongs
function Point(x, y, r, fill, middle, region) {
	// Initialize the point settings taking the values from
	// the parameters or from the default values
	this.x = x || 0;
	this.y = y || 0;
	this.r = r || 10;
	this.fill = fill || '#FF0000';
	this.middle = middle || false;
	this.region = region || null;
}

// Draw the point to a specific canvas context
Point.prototype.draw = function(ctx) {
	// Move the cursor to the point coordinates
	ctx.moveTo(this.x, this.y);
	
	// Begin a path drawing a full circle with the same
	// radius (properly scaled) and center as the point
	// object
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r * this.region.factor, 0, Math.PI * 2, false);
	
	// Set the filling colour and draw the circle
	ctx.fillStyle = this.fill;
	ctx.fill();
	
	// Set the contour thickness to 1 (properly scaled)
	ctx.lineWidth = 1 * this.region.factor;
	
	// Set the contour colour to white, and its
	// transparency to 0.5 or 1, depending on whether it
	// is a middle point or not
	if (this.middle) ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	else ctx.strokeStyle = 'rgba(255,255,255,1)';
	
	// Draw the contour of the circle
	ctx.stroke();
}

// Check whether the circle drawn around the point
// contains the point formed by the coordinates of the
// parameters
Point.prototype.contains = function(x, y) {
	return Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) < Math.pow(this.r * this.region.factor, 2);
}

// Function to create a new location point
// Parameters:
// - x: "x" coordinate of the point
// - y: "y" coordinate of the point
// - r: radius of the point
// - t: thickness (width) of the contour
// - stroke: colour of the contour
// - radius_factor: specific scale factor for the radius
function LocationPoint(x, y, r, t, stroke, radius_factor) {
	// Initialize the point settings taking the values from
	// the parameters or from the default values
	this.x = x || 0;
	this.y = y || 0;
	this.r = r || 10;
	this.t = t || 1;
	this.stroke = stroke || 'rgba(255,0,0,1)';
	this.radius_factor = radius_factor || 1;
	
	// Set two more parameters:
	// - factor: scale factor of the whole point
	// - scaled: boolean indicating if the point (mainly the radius)
	//   has to be scaled or not
	this.factor = 1;
	this.scaled = false;
}

// Draw the location point to a specific canvas context
LocationPoint.prototype.draw = function(ctx) {
	// Move the cursor to the point coordinates
	ctx.moveTo(this.x, this.y);
	
	// Begin a path drawing a full circle with the same
	// radius (properly scaled) and center as the point
	// object
	ctx.beginPath();
	
	// If the scale flag is enabled, scale the radius by
	// the factor; don't scale it otherwise
	if (this.scaled) {
		ctx.arc(this.x, this.y, this.r * this.radius_factor * this.factor, 0, Math.PI * 2, false);
	}
	else {
		ctx.arc(this.x, this.y, this.r * this.radius_factor, 0, Math.PI * 2, false);
	}
	
	// Set the contour thickness to 1 (properly scaled)
	ctx.lineWidth = this.t * this.factor;
	
	// Draw the contour of the circle
	ctx.strokeStyle = this.stroke;
	ctx.stroke();
	
	// Do the same to draw a point in the centre of the
	// circle (point = little filled circle); the radius
	// is the same as the line width, and the filling
	// colour is the same as the contour colour
	ctx.moveTo(this.x, this.y);
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.t * this.factor, 0, Math.PI * 2, false);
	ctx.fillStyle = this.stroke;
	ctx.fill();
}

// Check whether the circle drawn around the point
// contains the point formed by the coordinates of the
// parameters
LocationPoint.prototype.contains = function(x, y) {
	// If the scale flag is enabled, take into account the
	// scale factor when performing the calculation; don't
	// take it into account otherwise
	if (this.scaled) {
		return Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) < Math.pow(this.r * this.radius_factor * this.factor, 2);
	}
	else {
		return Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) < Math.pow(this.r * this.radius_factor, 2);
	}
}

// Set the scale factor of the location point
LocationPoint.prototype.setFactor = function(factor) {
	this.factor = factor;
}

// Set the radius of the location point
LocationPoint.prototype.setRadius = function(radius) {
	this.r = radius;
}

// Set the scale flag of the location point
LocationPoint.prototype.setScaled = function(scaled) {
	this.scaled = scaled;
}

// Edit the location point changing its coordinates
LocationPoint.prototype.edit = function(x, y) {
	this.x = x;
	this.y = y;
}