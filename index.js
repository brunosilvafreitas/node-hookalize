var config = require('./config');

var x = function (y) {
	return new Promise(function(resolve, reject){
		y = y+':final';
		console.log(y);
		if(y)
			resolve(y);
		else
			reject(new Error('invalid y'));
	});
};

var hookalize = require('./hookalize');

x = hookalize(x,config);
x('joao').then(function(a){
		console.log("---fim---");
		console.log(a);
	});