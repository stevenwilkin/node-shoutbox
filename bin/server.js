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
	return {
		add: function(text){
			c = {
				timestamp: new Date(),
				comment: text
			};
			comments.push(c);
		},
		list: function(since, callback){
			for(c in comments){
				com = comments[c];
				sys.puts(com.timestamp + ' - ' + com.comment);
			}
			callback();
		}
	};
})();

http.createServer(
	(fab)
		(middleware.paperboy('public'))
		('/comments')
			// get all comments
			['GET'] (function(respond){
				return Comments.list(null, function(){
					respond(null);
				});
			})
			// get all comments since a specific time
			(/\/([\d]+)/, function(respond){
				return Comments.list(this.url.capture[0], function(){
					respond(null);
				});
			})
			// add a comment
			// have to use GET as fab currently doesn't support POST form variables
			(/\/add\/(\S+)/, function(respond){
				Comments.add(this.url.capture[0]);
				respond(null);
			})
		()
	(fab)
).listen(8080);
