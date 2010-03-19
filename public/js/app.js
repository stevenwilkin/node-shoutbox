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

	function display(comments){
		for(i in comments){
			var
				c = comments[i],
				ts = new Date(c.timestamp),
				t = {
					h: ts.getHours(),
					m: ts.getMinutes(),
					s: ts.getSeconds()
				};
			for(i in t){
				if(t[i] < 10)
					t[i] = '0' + t[i];
			}
			var
				time = t.h + ':' + t.m + ':' + t.s,
				li = '<li><span>' + time + '</span>' + '<p>' + c.comment + '</p>'  + '</li>';
			$('#comments ol').append(li);
		}
		since = comments[comments.length - 1].timestamp;
		// scroll new comment into view if the mouse isn't over the comments list
		if(!$('#comments').data('mouseover'))
			$('#comments').scrollTop($('ol').height());	
	}

	function poll(){
		$.ajax({
			url: '/comments' + ((since) ? '/' + since : ''),
			success: display,
			complete: poll
		});
	}

	return {
		init: function(){
			$('#submit').click(addComment);
			$('#comments').mouseover(function(){
				$(this).data('mouseover', true);
			});
			$('#comments').mouseout(function(){
				$(this).data('mouseover', false);
			});
			poll();
		}
	}

})();

$(Client.init);
