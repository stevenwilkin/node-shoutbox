var Client = (function(){

	var since = null;

	function success(text){
		console.log('success: ' + text);
		$('#comment').val('');
	}

	function error(text){
		console.log('error: ' + text);
	}

	function addComment(){
		var comment = escape($.trim($('#comment').val()));
		if(!comment.length){
			error('Please enter a comment');
			return false;
		}
		$.ajax({
			url: '/comments/add/' + comment,
			success: function(){
				success('Your comment was submitted');
			},
			error: function(){
				error('Your comment couldn\'t be submitted, please try again');
			},
		});
		return false;
	}

	function poll(){
		console.log('poll');
	}

	return {
		init: function(){
			$('#submit').click(addComment);
			poll();
		}
	}

})();

$(Client.init);
