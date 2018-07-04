/* 
 * Author: Pau Xiberta i Armengol (c)
 * Date: 26/06/2018 (revised: 26/06/2018)
 * Summary: MPR problems management (JavaScript file)
 */

// Execute when all document elements are loaded
$(document).ready(function() {
//	var image_file = null;
//	var original_circles = [];
	var categories = [];
	var user_types = [];
	var topics = [];
	
	function showMessage(type, message) {
		$("#info_span").html(message);
		
		switch(type) {
			case 0: // error
				$("#info_div").removeClass("success_info").addClass("error_info");
				break;
			case 1: // success
				$("#info_div").removeClass("error_info").addClass("success_info");
				break;
		}
		
		$("#info_div").fadeIn(500).delay(5000).fadeOut(500);
	}
	
	function buildEditors() {
		
		
		$('.note-editable').focus(function() {
			$(this).closest('.note-editor').addClass('focused');
		}).blur(function() {
			$(this).closest('.note-editor').removeClass('focused');
		});
	}
	
	buildEditors();
	
	$('#problem_categories_select option').each(function(index, option) {
		var id = $(option).val();
		var name = $(option).text();
		categories[id] = name;
	});
	
	$('#problem_user_types_select option').each(function(index, option) {
		var id = $(option).val();
		var name = $(option).text();
		user_types[id] = name;
	});
	
	$('#problem_topics_select option').each(function(index, option) {
		var id = $(option).val();
		var name = $(option).text();
		topics[id] = name;
	});

	if ($('#from').val() == "content" && $('#modification_type').val() == "create") {
		var option = $('#available_topics_select option[value="' + $('#topic_id').val() + '"]').clone();
		$('#problem_topics_select').append(option);
	}
	
	$("#btn-back").click(function() {
		$('#btn-cancel').click();
	});
	
	$("#btn-help").click(function() {
		$('#help_div').show();
	});
	
	$("#btn-close-help").click(function() {
		$('#help_div').hide();
	});

	// $('#problem_image_input').change(function(e) {
		// if (e.target.files.length > 0) {
			// image_file = document.getElementById('problem_image_input').files[0];
			// setImage(URL.createObjectURL(e.target.files[0]));
		// }
	// });
	
	// $(document).on('change', '.btn-file :file', function() {
		// var input = $(this);
		// var numFiles = input.get(0).files ? input.get(0).files.length : 1;
		// var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		// input.trigger('fileselect', [numFiles, label]);
	// });
	
	$('#btn-choose-set').click(function() {
		$('#library_div').show();
	});
	
	$('#btn-close-library').click(function() {
		$('#library_div').hide();
	});
	
	$('#library_content').click(function(event) {
		if (!$(event.target).closest('.library_item').length) {
			$('.library_item').removeClass('selected');
			$('#btn-open-library-item').prop('disabled', true);
		}
	});
	
	$(document).on('click', '.library_item', function() {
		$('.library_item').removeClass('selected');
		$(this).addClass('selected');
		$('#btn-open-library-item').prop('disabled', false);
	});
	
	$('#btn-open-library-item').click(function() {
		if ($('.library_item.selected').length) {
			$('#library_div').hide();
			
			mpr_set_id = $('.library_item.selected').first().data('id');
			
			mpr_path = mpr_library_sets[mpr_set_id].path;
			slices = mpr_library_sets[mpr_set_id].slices;
			voxel_size = mpr_library_sets[mpr_set_id].voxel_size;
			
			// Take the middle slice of each plane
			current_slices = {axial: Math.round(slices.axial / 2) - 1, sagittal: Math.round(slices.sagittal / 2) - 1, coronal: Math.round(slices.coronal / 2) - 1};
			
			// Compute the width of each plane
			var widths = {x: slices.sagittal * voxel_size.x, y: slices.coronal * voxel_size.y, z: slices.axial * voxel_size.z};
			
			// Compute the intersection point based on current slices
			solution_centre = {x: current_slices.sagittal * voxel_size.x, y: widths.y - (current_slices.coronal * voxel_size.y), z: widths.z - (current_slices.axial * voxel_size.z)};
			
			// Compute default sphere radius (10% of minimum plane width)
			initial_radius = Math.min(widths.x, widths.y, widths.z) * 0.1;
			
			loadPlaneTextures();
			
			$('#set-input-text').val(mpr_library_sets[mpr_set_id].name);
			
			// $('#axial-number').prop('disabled', false);
			// $('#sagittal-number').prop('disabled', false);
			// $('#coronal-number').prop('disabled', false);
			// $('#radius-number').prop('disabled', false);
			
			// $('#axial-number').val(current_slices.axial);
			// $('#axial-number').prop('max', slices.axial);
			// $('#sagittal-number').val(current_slices.sagittal);
			// $('#sagittal-number').prop('max', slices.sagittal);
			// $('#coronal-number').val(current_slices.coronal);
			// $('#coronal-number').prop('max', slices.coronal);
			
			// $('#centre_input_group input').val("(" + solution_centre.x.toFixed(2) + ", " + solution_centre.y.toFixed(2) + ", " + solution_centre.z.toFixed(2) + ")");
			
			// $('#radius-number').val(initial_radius);
		}
	});
	
	$('#btn-add-category').click(function() {
		var option = $('#available_categories_select option:selected').clone();
		
		if (!$('#problem_categories_select option[value="' + $(option).val() + '"]').length) {
			$('#problem_categories_select').append(option);
		}
	});
	
	$('#btn-delete-category').click(function() {
		$('#problem_categories_select option:selected').remove();
	});
	
	$('#btn-add-user-type').click(function() {
		var option = $('#available_user_types_select option:selected').clone();
		
		if (!$('#problem_user_types_select option[value="' + $(option).val() + '"]').length) {
			$('#problem_user_types_select').append(option);
		}
	});
	
	$('#btn-delete-user-type').click(function() {
		$('#problem_user_types_select option:selected').remove();
	});
	
	$('#btn-add-topic').click(function() {
		var option = $('#available_topics_select option:selected').clone();
		
		if (!$('#problem_topics_select option[value="' + $(option).val() + '"]').length) {
			$('#problem_topics_select').append(option);
		}
	});
	
	$('#btn-delete-topic').click(function() {
		$('#problem_topics_select option:selected').remove();
	});
	
	$('#btn-save').click(function(event) {
		var modification_type = $('#modification_type').val();
		var language_id = $('#language_select option:selected').val();
//		var image = document.getElementById('problem_image_input').files[0];
//		var solved_image = image;
		var problem_name = $('#problem_name').val();
		var problem_description = $('#problem_description').val();
		// var problem_question = $('#problem_question').val();
		// var problem_solution = $('#problem_solution').val();
		// var problem_help = $('#problem_help').val();
		var problem_question = $('#problem_question').summernote('code');
		var problem_solution = $('#problem_solution').summernote('code');
		var problem_help = $('#problem_help').summernote('code');
		var difficulty_level = $('#problem_difficulty_level option:selected').val();
		
		var overwrite = 0;
		if (event.overwrite) overwrite = 1;
		
		if (problem_name == "") {
			showMessage(0, lang['ADM_PROBLEM_MPR_EMPTY_NAME_ERROR']);
			
			implicit_saving = "";
			
			return;
		}
		
		var radius = $('#radius-number').val();
		
		var added_categories = [];
		var removed_categories = [];
		var added_user_types = [];
		var removed_user_types = [];
		var added_topics = [];
		var removed_topics = [];
		
		var current_categories_ids = [];
		var current_user_types_ids = [];
		var current_topics_ids = [];
		
		$('#problem_categories_select option').each(function(index, option) {
			var id = parseInt($(option).val());
			var name = $(option).text();
			
			current_categories_ids.push(id);
			
			if (!(id in categories)) {
				added_categories.push(id);
			}
		});
		
		for (var key in categories) {
			var id = parseInt(key);
			if ($.inArray(id, current_categories_ids) < 0) {
				removed_categories.push(id);
			}
		}
		
		$('#problem_user_types_select option').each(function(index, option) {
			var id = parseInt($(option).val());
			var name = $(option).text();
			
			current_user_types_ids.push(id);
			
			if (!(id in user_types)) {
				added_user_types.push(id);
			}
		});
		
		for (var key in user_types) {
			var id = parseInt(key);
			if ($.inArray(id, current_user_types_ids) < 0) {
				removed_user_types.push(id);
			}
		}
		
		$('#problem_topics_select option').each(function(index, option) {
			var id = parseInt($(option).val());
			var name = $(option).text();
			
			current_topics_ids.push(id);
			
			if (!(id in topics)) {
				added_topics.push(id);
			}
		});
		
		for (var key in topics) {
			var id = parseInt(key);
			if ($.inArray(id, current_topics_ids) < 0) {
				removed_topics.push(id);
			}
		}
		
		if ($('#problem_topics_select option').length == 0) {
			showMessage(0, lang['ADM_PROBLEM_MPR_ASSOCIATED_TOPICS_ERROR']);
			
			implicit_saving = "";
			
			return;
		}
		
		if (modification_type == "create") {
			// var json_data = {
				// action: 'create_problem_test',
				// image: "",
				// solved_image: "",
				// language_id: language_id,
				// name: problem_name,
				// description: problem_description,
				// question: problem_question,
				// solution: problem_solution,
				// help: problem_help,
				// difficulty_level: difficulty_level,
				// new_answers: new_answers,
				// added_categories: added_categories,
				// added_user_types: added_user_types,
				// added_topics: added_topics
			// };
			
			var formData = new FormData();
			
			// if (image != null) formData.append('image', image, image.name);
			// else formData.append('image', '');
			
			// if (solved_image != null) formData.append('solved_image', solved_image, solved_image.name);
			// else formData.append('solved_image', '');
			
			formData.append('action', 'create_problem_mpr');
			formData.append('overwrite', overwrite);
			formData.append('language_id', language_id);
			formData.append('name', problem_name);
			formData.append('description', problem_description);
			formData.append('question', problem_question);
			formData.append('solution', problem_solution);
			formData.append('help', problem_help);
			formData.append('difficulty_level', difficulty_level);
			formData.append('set_id', mpr_set_id);
			formData.append('centre', JSON.stringify(solution_centre));
			formData.append('radius', radius);
			formData.append('added_categories', JSON.stringify(added_categories));
			formData.append('added_user_types', JSON.stringify(added_user_types));
			formData.append('added_topics', JSON.stringify(added_topics));
			
			$.ajax({
				url: 'actions/admin_action.php',
				// data: json_data,
				data: formData,
				type: 'post',
				dataType: 'json',
				cache: false,
				contentType: false,
				processData: false,
				success: function(result) {
					if (result.status == 1) {
						showMessage(1, result.message);
						
						$("#btn-cancel").click();
					}
					else {
						// if (result.tag == "exists") {
							// var overwrite_ok = confirm(lang['ADM_PROBLEM_LOCATION_OVERWRITE_IMAGE']);
							
							// if (overwrite_ok) {
								// var event = jQuery.Event("click");
								// event.overwrite = 1;
								
								// $('#btn-save').trigger(event);
							// }
						// }
						// else {
							showMessage(0, result.message);
						// }
					}
				},
				error: function(result) {
					console.log(result);
					
					// Show an error message to the user and make it
					// disappear
					showMessage(0, lang['ADM_PROBLEM_MPR_CREATE_ERROR']);
				}
			});
		}
		else if (modification_type == "update") {
			var problem_id = $('#problem_id').val();
//			var current_image = $('#problem_image_url').val();
//			var current_solved_image = current_image;
			
			// var json_data = {
				// action: 'update_problem_test',
				// problem_id: problem_id,
				// image: "",
				// solved_image: "",
				// language_id: language_id,
				// name: problem_name,
				// description: problem_description,
				// question: problem_question,
				// solution: problem_solution,
				// help: problem_help,
				// difficulty_level: difficulty_level,
				// new_answers: new_answers,
				// modified_answers: modified_answers,
				// removed_answers: removed_answers,
				// added_categories: added_categories,
				// removed_categories: removed_categories,
				// added_user_types: added_user_types,
				// removed_user_types: removed_user_types,
				// added_topics: added_topics,
				// removed_topics: removed_topics
			// };
			
			var formData = new FormData();
			
			// if (image != null) formData.append('image', image, image.name);
			// else if (current_image != "") formData.append('image', current_image);
			// else formData.append('image', '');
			
			// if (solved_image != null) formData.append('solved_image', solved_image, solved_image.name);
			// else if (current_solved_image != "") formData.append('solved_image', current_solved_image);
			// else formData.append('solved_image', '');
			
			formData.append('action', 'update_problem_mpr');
			formData.append('problem_id', problem_id);
			formData.append('overwrite', overwrite);
			formData.append('language_id', language_id);
			formData.append('name', problem_name);
			formData.append('description', problem_description);
			formData.append('question', problem_question);
			formData.append('solution', problem_solution);
			formData.append('help', problem_help);
			formData.append('difficulty_level', difficulty_level);
			formData.append('set_id', mpr_set_id);
			formData.append('centre', JSON.stringify(solution_centre));
			formData.append('radius', radius);
			formData.append('added_categories', JSON.stringify(added_categories));
			formData.append('removed_categories', JSON.stringify(removed_categories));
			formData.append('added_user_types', JSON.stringify(added_user_types));
			formData.append('removed_user_types', JSON.stringify(removed_user_types));
			formData.append('added_topics', JSON.stringify(added_topics));
			formData.append('removed_topics', JSON.stringify(removed_topics));
			
			$.ajax({
				url: 'actions/admin_action.php',
				// data: json_data,
				data: formData,
				type: 'post',
				dataType: 'json',
				cache: false,
				contentType: false,
				processData: false,
				success: function(result) {
					if (result.status == 1) {
						showMessage(1, result.message);
						
						$("#btn-cancel").click();
					}
					else {
						// if (result.tag == "exists") {
							// var overwrite_ok = confirm(lang['ADM_PROBLEM_LOCATION_OVERWRITE_IMAGE']);
							
							// if (overwrite_ok) {
								// var event = jQuery.Event("click");
								// event.overwrite = 1;
								
								// $('#btn-save').trigger(event);
							// }
						// }
						// else {
							showMessage(0, result.message);
						// }
					}
				},
				error: function(result) {
					console.log(result);
					
					// Show an error message to the user and make it
					// disappear
					showMessage(0, lang['ADM_PROBLEM_MPR_UPDATE_ERROR']);
				}
			});
		}
	});
	
	$('#btn-delete').click(function() {
		var deleteOk = confirm(lang['ADM_PROBLEM_MPR_DELETE_INFO']);
		
		if (deleteOk) {
			var problem_id = $('#problem_id').val();
			
			var json_data = {
				action: 'delete_problem_mpr',
				problem_id: problem_id
			};
		
			$.ajax({
				url: 'actions/admin_action.php',
				data: json_data,
				type: 'post',
				dataType: 'json',
				success: function(result) {
					if (result.status == 1) {
						showMessage(1, result.message);
						
						$("#btn-cancel").click();
					}
					else {
						showMessage(0, result.message);
					}
				},
				error: function(result) {
					console.log(result);
					
					// Show an error message to the user and make it
					// disappear
					showMessage(0, lang['ADM_PROBLEM_MPR_DELETE_ERROR']);
				}
			});
		}
	});
	
	$('#btn-cancel').click(function() {
		var path = $('#navigation_path').text();
		
		if ($('#modification_type').val() == "update") {
			var path_list = path.split(' > ');
			path_list.pop();
			path = path_list.join(' > ');
		}
		
		if ($('#from').val() == "problems") {
			var form = document.createElement("form");
			form.setAttribute('method', 'post');
			form.setAttribute('action', 'adm_problems.php');
			
			var input_course_id = document.createElement("input");
			input_course_id.setAttribute('type', 'hidden');
			input_course_id.setAttribute('name', 'course_id');
			input_course_id.setAttribute('value', $('#course_id').val());
			
			var input_path = document.createElement("input");
			input_path.setAttribute('type', 'hidden');
			input_path.setAttribute('name', 'path');
			input_path.setAttribute('value', path);
			
			form.appendChild(input_course_id);
			form.appendChild(input_path);
			$(form).appendTo("body").submit();
		}
		else if ($('#from').val() == "content") {
			var form = document.createElement("form");
			form.setAttribute('method', 'post');
			form.setAttribute('action', 'adm_topic.php');
			
			var input_course_id = document.createElement("input");
			input_course_id.setAttribute('type', 'hidden');
			input_course_id.setAttribute('name', 'course_id');
			input_course_id.setAttribute('value', $('#course_id').val());
			
			var input_topic_id = document.createElement("input");
			input_topic_id.setAttribute('type', 'hidden');
			input_topic_id.setAttribute('name', 'topic_id');
			input_topic_id.setAttribute('value', $('#topic_id').val());
			
			var input_parent_id = document.createElement("input");
			input_parent_id.setAttribute('type', 'hidden');
			input_parent_id.setAttribute('name', 'parent_id');
			input_parent_id.setAttribute('value', $('#parent_id').val());
			
			var input_type = document.createElement("input");
			input_type.setAttribute('type', 'hidden');
			input_type.setAttribute('name', 'type');
			input_type.setAttribute('value', 'update');
			
			var input_path = document.createElement("input");
			input_path.setAttribute('type', 'hidden');
			input_path.setAttribute('name', 'path');
			input_path.setAttribute('value', path);
			
			form.appendChild(input_course_id);
			form.appendChild(input_topic_id);
			form.appendChild(input_parent_id);
			form.appendChild(input_type);
			form.appendChild(input_path);
			$(form).appendTo("body").submit();
		}
	});
	
	// $(document).ready(function() {
		// $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
			// var input = $(this).parents('.input-group').find(':text');
			// var log = numFiles > 1 ? numFiles + ' files selected' : label;
			
			// if (input.length && log != "") input.val(log);
		// });
	// });
});