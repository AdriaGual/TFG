/* 
 * Author: Pau Xiberta i Armengol (c)
 * Date: 01/06/2015 (revised: 29/02/2016)
 * Summary: User interaction - Topic management (JavaScript file)
 */

// Execute when all document elements are loaded
$(document).ready(function() {
	var image_file = null;
	var answers = [];
	var categories = [];
	var user_types = [];
	var topics = [];
	

	$('.answer_item').each(function(index, item) {
		var id = $(item).data('id');
		var text = $(item).find("input[type=text]").val();
		var feedback = $(item).find(".editor").summernote('code');
		var solution = $(item).find("span.input-group-addon > input[type=checkbox]").is(":checked");
		answers[id] = {"text": text, "feedback": feedback, "solution": solution};
		
		if (solution) $(item).find("span.input-group-addon > input[type=checkbox]").trigger("change");
	});
	
	$('body').on('change', 'span.input-group-addon > input[type=checkbox]', function() {
		if ($(this).is(':checked')) {
			$(this).closest('.answer_item').find('.note-editor').hide();
			$(this).closest('.answer_item').find('.editor').show();
		}
		else {
			$(this).closest('.answer_item').find('.note-editor').show();
			$(this).closest('.answer_item').find('.editor').hide();
		}
	});
	
	
	$('#btn-new-item').click(function() {
		$('#items_box').append('\
			<div class="answer_item input-group" data-id="-1">\
				<span class="input-group-addon">\
					<input type="checkbox">\
				</span>\
				<div class="answer_text_div">\
					<input type="text" class="form-control" placeholder="' + '" data-id="-1" value="">\
					<div class="form-control editor"></div>\
				</div>\
				<span class="input-group-btn">\
					<Button type="button" class="btn-delete-item" data-id="-1">' + 'Delete answer</Button>\
				</span>\
			</div>\
		');
      
	});
	
	$('.note-editable').focus(function() {
			$(this).closest('.note-editor').addClass('focused');
		}).blur(function() {
			$(this).closest('.note-editor').removeClass('focused');
		});
		
		
		$('.answer_item input[type=text]').keyup(function(e) { newAnswerOnEnterKeyUp(e, $(this)); });
		
	$("body").on("click", ".btn-delete-item", function() {
		$(this).parent().parent().remove();
	});
	
	// $("body").on("click", ".solution-indicator", function() {
		// if ($(this).hasClass('solution')) $(this).removeClass('solution');
		// else $(this).addClass('solution');
	// });
	
	
	$('#btn-delete').click(function() {
		var deleteOk;
		
		if (deleteOk) {
			var problem_id = $('#problem_id').val();
			
			var json_data = {
				action: 'delete_problem_test',
				problem_id: problem_id
			};
		
			$.ajax({
				url: 'actions/admin_action.php',
				data: json_data,
				type: 'post',
				dataType: 'json',
				success: function(result) {
					if (result.status == 1) {
						$("#info_span").html(result.message);
						$("#info_div").removeClass("error_info").addClass("success_info");
						$("#info_div").fadeIn(500).delay(5000).fadeOut(500);
						
						$("#btn-cancel").click();
					}
					else {
						$("#info_span").html(result.message);
						$("#info_div").removeClass("success_info").addClass("error_info");
						$("#info_div").fadeIn(500).delay(5000).fadeOut(500);
					}
				},
				error: function(result) {
					console.log(result);
					
					// Show an error message to the user and make it
					// disappear
					
					$("#info_div").removeClass("success_info").addClass("error_info");
					$("#info_div").fadeIn(500).delay(5000).fadeOut(500);
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
	
	
	$(document).ready(function() {
		$('.btn-file :file').on('fileselect', function(event, numFiles, label) {
			var input = $(this).parents('.input-group').find(':text');
			var log = numFiles > 1 ? numFiles + ' files selected' : label;
			
			if (input.length && log != "") input.val(log);
		});
	});
});