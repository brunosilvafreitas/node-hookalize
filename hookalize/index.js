var registredHooks = require('../modules');

var runMultSteps = function(steps, args, index) {
	return new Promise(function(resolve, reject){
		var currentModule = require('../modules/'+steps[index].module);

		currentModule(args)
			.then(function(...args){
				if(index+1 === steps.length)
					resolve(...args);
				else
					resolve(runMultSteps(steps,...args,index+1));
			})
			.catch(function(err){
				reject(err);
			});
	});
};

var hookalize = function(func) {
	var pre = registredHooks.filter(function(value){
		return value.target === func.name && value.type === 'pre';
	});
	var post = registredHooks.filter(function(value){
		return value.target === func.name && value.type === 'post';
	});
	return function(...args){
		return new Promise(function(resolve, reject){
			runMultSteps(pre,...args,0)
				.then(function(...args){
					return func(...args);
				})
				.then(function(...args){
					return runMultSteps(post,...args,0);
				})
				.then(function(...args){
					resolve(...args);
				})
				.catch(function(err){
					reject(err);
				});
		});
	};
};

module.exports = hookalize;