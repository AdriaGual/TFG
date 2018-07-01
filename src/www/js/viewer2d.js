// Execute when all document elements are loaded
$(document).ready(function() {
	var image_file = null;
	
	$('#problem_image_input').change(function(e) {
		if (e.target.files.length > 0) {
			image_file = document.getElementById('problem_image_input').files[0];
			setImage(URL.createObjectURL(e.target.files[0]));
		}
	});
	
	$(document).on('change', '.btn-file :file', function() {
		var input = $(this);
		var numFiles = input.get(0).files ? input.get(0).files.length : 1;
		var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [numFiles, label]);
	});
	
	$('#btn-delete-image').click(function() {
		var input = $('.btn-file :file').parents('.input-group').find(':text');
		
		setImage("");
		image_file = null;
		if (input.length) input.val('');
		$('#problem_image_input').replaceWith($('#problem_image_input').clone(true));
		$('#problem_image_url').val('');
	});
	
});