#!/usr/bin/env node

require('../lib/bootstrap');

var
	sys = require('sys'),
	http = require('http'),
	fab = require('lib/fab'),
	middleware = {
		paperboy:	require('lib/node-paperboy').fabware
	};

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
			while(callbacks.length){
				callbacks.shift()(c);
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
		(middleware.paperboy('public'))
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
).listen(8080);
