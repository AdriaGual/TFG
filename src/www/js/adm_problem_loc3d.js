/* 
 * Author: Pau Xiberta i Armengol (c)
 * Date: 01/06/2018 (revised: 11/06/2018)
 * Summary: 3D location problems management (JavaScript file)
 */

// Execute when all document elements are loaded
$(document).ready(function() {
//	var image_file = null;
	//var initial_models = [];
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
	
	function isSameMaterial(mat1, mat2) {
		if (!mat1.color.equals(mat2.color)) return false;
		else if (mat1.opacity != mat2.opacity) return false;
		else return true;
	}
	
	function buildEditors() {
		
		$('.note-editable').focus(function() {
			$(this).closest('.note-editor').addClass('focused');
		}).blur(function() {
			$(this).closest('.note-editor').removeClass('focused');
		});
	}
	
	buildEditors();
	
//	if ($('#problem_image_url').val() != "") {
//		//setImage($('#problem_image_url').val());
//	}

	//initial_models = models.clone();
	
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

	$('#model_input').change(function(e) {
		/*if (e.target.files.length > 0) {
			image_file = document.getElementById('model_input').files[0];
			setImage(URL.createObjectURL(e.target.files[0]));
		}*/
		
		var current_models = $.map(models, function(value, key) { return value.filename });
		var file_models = [];
		var added_models = [];
		
		// for (var i = 0; i < e.target.files.length; i++) {
			// if (models_files[e.target.files[i].name] === undefined) {
				// models_files[e.target.files[i].name] = document.getElementById('model_input').files[i];
				// new_models.push({name: e.target.files[i].name, path: URL.createObjectURL(e.target.files[i])});
			// }
			// else {
				
			// }
		// }
		
		for (var i = 0; i < e.target.files.length; i++) {
			var filename = e.target.files[i].name;
			var name = filename.substr(0, filename.lastIndexOf('.')) || filename;
			if ($.inArray(filename, current_models) == -1) {
				file_models.push({filename: filename, name: name, file: e.target.files[i], path: URL.createObjectURL(e.target.files[i])});
			}
			else {
				added_models.push(filename);
			}
		}
		
		if (file_models.length > 0) loadFileModels(file_models);
		
		if (added_models.length > 1) showMessage(0, lang['ADM_PROBLEM_LOCATION_3D_MODELS_ALREADY_ADDED_ERROR'].replace("%s", added_models[0]));
		else if (added_models.length > 0) showMessage(0, lang['ADM_PROBLEM_LOCATION_3D_MODEL_ALREADY_ADDED_ERROR'].replace("%s", added_models[0]));
	});
	
	$(document).on('change', '.btn-file :file', function() {
		var input = $(this);
		var numFiles = input.get(0).files ? input.get(0).files.length : 1;
		var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [numFiles, label]);
	});
	
	$('.btn-file :file').on('fileselect', function(event, numFiles, label) {
		var input = $(this).parents('.input-group').find(':text');
		var log = numFiles > 1 ? numFiles + ' files selected' : label;
		
		if (input.length && log != "") input.val(log);
	});
	
	$('#btn-delete-model').click(function() {
		var id = $('#displayed_models_select option:selected').val();
		
		removeModel(id);
		
		// var input = $('.btn-file :file').parents('.input-group').find(':text');
		
		// setImage("");
		// image_file = null;
		// if (input.length) input.val('');
		// $('#problem_image_input').replaceWith($('#problem_image_input').clone(true));
		// $('#problem_image_url').val('');
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
			showMessage(0, lang['ADM_PROBLEM_LOCATION_3D_EMPTY_NAME_ERROR']);
			
			implicit_saving = "";
			
			return;
		}
		
		var new_models = [];
		var modified_models = {};
		var removed_models = [];
		var added_categories = [];
		var removed_categories = [];
		var added_user_types = [];
		var removed_user_types = [];
		var added_topics = [];
		var removed_topics = [];
		
		var current_models_ids = [];
		var current_categories_ids = [];
		var current_user_types_ids = [];
		var current_topics_ids = [];
		
		$.each(models, function(index, model) {
			var id = parseInt(index);
			var path = model.path;
			var filename = model.filename;
			var name = model.name;
			var solution = model.solution;
			var matrix = model.matrix;
			var material = model.material;
			
			if (id < 0) new_models.push(Object.assign({}, model));
			else {
				current_models_ids.push(id);
				
				if (id in initial_models) {
					if (initial_models[id].name != name || initial_models[id].solution != solution || !initial_models[id].matrix.equals(matrix) || !isSameMaterial(initial_models[id].material, material)) {
						modified_models[id] = Object.assign({}, model);
					}
				}
			}
		});
		
		for (var key in initial_models) {
			var id = parseInt(key);
			if ($.inArray(id, current_models_ids) < 0) {
				removed_models.push(id);
			}
		}
		
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
			showMessage(0, lang['ADM_PROBLEM_LOCATION_3D_ASSOCIATED_TOPICS_ERROR']);
			
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
			
//			if (image != null) formData.append('image', image, image.name);
//			else formData.append('image', '');
			
//			if (solved_image != null) formData.append('solved_image', solved_image, solved_image.name);
//			else formData.append('solved_image', '');

			for (var i = 0; i < new_models.length; i++) {
				formData.append('models[]', new_models[i].file, new_models[i].filename);
				new_models[i].mesh = null;
			}
			
			formData.append('action', 'create_problem_loc3d');
			formData.append('overwrite', overwrite);
			formData.append('language_id', language_id);
			formData.append('name', problem_name);
			formData.append('description', problem_description);
			formData.append('question', problem_question);
			formData.append('solution', problem_solution);
			formData.append('help', problem_help);
			formData.append('difficulty_level', difficulty_level);
			formData.append('new_models', JSON.stringify(new_models));
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
						// $("#info_span").html(result.message);
						// $("#info_div").removeClass("error_info").addClass("success_info");
						// $("#info_div").fadeIn(500).delay(5000).fadeOut(500);
						
						showMessage(1, result.message);
						
						$("#btn-cancel").click();
					}
					else {
						if (result.tag == "exists_single" || result.tag == "exists_multiple") {
							//var overwrite_ok = confirm(lang['ADM_PROBLEM_LOCATION_3D_USE_EXISTING_MODEL']);
							var overwrite_ok = confirm(result.message);
							
							if (overwrite_ok) {
								var event = jQuery.Event("click");
								event.overwrite = 1;
								
								$('#btn-save').trigger(event);
							}
						}
						else {
							// $("#info_span").html(result.message);
							// $("#info_div").removeClass("success_info").addClass("error_info");
							// $("#info_div").fadeIn(500).delay(5000).fadeOut(500);
							
							showMessage(0, result.message);
						}
					}
				},
				error: function(result) {
					console.log(result);
					
					// Show an error message to the user and make it
					// disappear
					// $("#info_span").html(lang['ADM_PROBLEM_TEST_CREATE_ERROR']);
					// $("#info_div").removeClass("success_info").addClass("error_info");
					// $("#info_div").fadeIn(500).delay(5000).fadeOut(500);
					
					showMessage(0, lang['ADM_PROBLEM_LOCATION_3D_CREATE_ERROR']);
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
			
//			if (image != null) formData.append('image', image, image.name);
//			else if (current_image != "") formData.append('image', current_image);
//			else formData.append('image', '');
			
//			if (solved_image != null) formData.append('solved_image', solved_image, solved_image.name);
//			else if (current_solved_image != "") formData.append('solved_image', current_solved_image);
//			else formData.append('solved_image', '');

			for (var i = 0; i < new_models.length; i++) {
				formData.append('models[]', new_models[i].file, new_models[i].filename);
				new_models[i].mesh = null;
			}
			
			for (var i = 0; i < modified_models.length; i++) {
				modified_models[i].mesh = null;
			}
			
			formData.append('action', 'update_problem_loc3d');
			formData.append('problem_id', problem_id);
			formData.append('overwrite', overwrite);
			formData.append('language_id', language_id);
			formData.append('name', problem_name);
			formData.append('description', problem_description);
			formData.append('question', problem_question);
			formData.append('solution', problem_solution);
			formData.append('help', problem_help);
			formData.append('difficulty_level', difficulty_level);
			formData.append('new_models', JSON.stringify(new_models));
			formData.append('modified_models', JSON.stringify(modified_models));
			formData.append('removed_models', JSON.stringify(removed_models));
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
						// $("#info_span").html(result.message);
						// $("#info_div").removeClass("error_info").addClass("success_info");
						// $("#info_div").fadeIn(500).delay(5000).fadeOut(500);
						
						showMessage(1, result.message);
						
						$("#btn-cancel").click();
					}
					else {
						if (result.tag == "exists_single" || result.tag == "exists_multiple") {
							//var overwrite_ok = confirm(lang['ADM_PROBLEM_LOCATION_3D_USE_EXISTING_MODEL']);
							var overwrite_ok = confirm(result.message);
							
							if (overwrite_ok) {
								var event = jQuery.Event("click");
								event.overwrite = 1;
								
								$('#btn-save').trigger(event);
							}
						}
						else {
							// $("#info_span").html(result.message);
							// $("#info_div").removeClass("success_info").addClass("error_info");
							// $("#info_div").fadeIn(500).delay(5000).fadeOut(500);
							
							showMessage(0, result.message);
						}
					}
				},
				error: function(result) {
					console.log(result);
					
					// Show an error message to the user and make it
					// disappear
					// $("#info_span").html(lang['ADM_PROBLEM_TEST_UPDATE_ERROR']);
					// $("#info_div").removeClass("success_info").addClass("error_info");
					// $("#info_div").fadeIn(500).delay(5000).fadeOut(500);
					
					showMessage(0, lang['ADM_PROBLEM_LOCATION_3D_UPDATE_ERROR']);
				}
			});
		}
	});
	
	$('#btn-delete').click(function() {
		var deleteOk = confirm(lang['ADM_PROBLEM_LOCATION_3D_DELETE_INFO']);
		
		if (deleteOk) {
			var problem_id = $('#problem_id').val();
			
			var json_data = {
				action: 'delete_problem_loc3d',
				problem_id: problem_id
			};
		
			$.ajax({
				url: 'actions/admin_action.php',
				data: json_data,
				type: 'post',
				dataType: 'json',
				success: function(result) {
					if (result.status == 1) {
						// $("#info_span").html(result.message);
						// $("#info_div").removeClass("error_info").addClass("success_info");
						// $("#info_div").fadeIn(500).delay(5000).fadeOut(500);
						
						showMessage(1, result.message);
						
						$("#btn-cancel").click();
					}
					else {
						// $("#info_span").html(result.message);
						// $("#info_div").removeClass("success_info").addClass("error_info");
						// $("#info_div").fadeIn(500).delay(5000).fadeOut(500);
						
						showMessage(0, result.message);
					}
				},
				error: function(result) {
					console.log(result);
					
					// Show an error message to the user and make it
					// disappear
					// $("#info_span").html(lang['ADM_PROBLEM_TEST_DELETE_ERROR']);
					// $("#info_div").removeClass("success_info").addClass("error_info");
					// $("#info_div").fadeIn(500).delay(5000).fadeOut(500);
					
					showMessage(0, lang['ADM_PROBLEM_LOCATION_3D_DELETE_ERROR']);
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