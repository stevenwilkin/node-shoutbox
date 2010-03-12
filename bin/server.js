#!/usr/bin/env node

require('../lib/bootstrap');

var
	http = require('http'),
	fab = require('lib/fab');

http.createServer(
	(fab)
		('/', 'hello world!')
	(fab)
).listen(8080);
