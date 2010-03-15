#!/usr/bin/env node

require('../lib/bootstrap');

var
	http = require('http'),
	fab = require('lib/fab'),
	middleware = {
		paperboy:	require('lib/node-paperboy').fabware
	};
http.createServer(
	(fab)
		(middleware.paperboy('public'))
	(fab)
).listen(8080);
