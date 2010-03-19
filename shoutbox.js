/**
 * shoutbox.js
 * a simple comment shoutbox using long-polling and node.js
 * Steven Wilkin @stevebiscuit
 */

var PORT = 8080;	// port to listen on

require('./lib/bootstrap');

var
	http = require('http'),
	fab = require('lib/fab'),
	paperboy = require('lib/node-paperboy').fabware;

var Comments = (function(){
	var
		comments = [],
		callbacks = [];

	function sendJSON(respond, js){
		body = JSON.stringify(js);
		respond({
			status: 200,
			headers: {
				"Content-Type": "text/json",
				"Content-Length": body.length
			},
			body: body
		}, null);
	}

	return {
		add: function(text){
			c = {
				timestamp: (new Date()).getTime(),
				comment: text
			};
			comments.push(c);
			// release any waiting callbacks with the new comment
			while(callbacks.length){
				callbacks.shift()([c]);
			}
		},
		list: function(respond, since){
			var c = [];
			// find comments added after 'since'
			if(!since)
				c = comments;
			else {
				for(i in comments){
					if(comments[i].timestamp > since){
						c = comments.slice(i);
						break;
					}
				}
			}
			// if there are any matching comments send them now, else add a callback
			if(c.length)
				sendJSON(respond, c);
			else {
				callbacks.push(function(c){
					sendJSON(respond, c);
				});
			}
		}
	};
})();

http.createServer(
	(fab)
		(paperboy('public'))
		('/comments')
			// get all comments
			['GET'] (function(respond){
				return Comments.list(respond, null);
			})
			// get all comments since a specific time
			(/\/([\d]+)/, function(respond){
				return Comments.list(respond, this.url.capture[0]);
			})
			// add a comment
			// have to use GET as fab currently doesn't support POST form variables
			(/\/add\/(\S+)/, function(respond){
				Comments.add(unescape(this.url.capture[0]));
				respond(null);
			})
		()
	(fab)
).listen(PORT);
