var runMultSteps = function(steps, index, args) {
	return new Promise(function(resolve, reject){
		if(steps.length) {
			var currentModule = require(steps[index].module);

			currentModule(args)
				.then(function(...args){
					if(index+1 === steps.length)
						resolve(...args);
					else
						resolve(runMultSteps(steps,index+1,...args));
				})
				.catch(function(err){
					reject(err);
				});
		}
		else
			resolve(args);
	});
};

var hookalize = function(func, modules) {
	modules = modules || [];
	var pre = modules.filter(function(value){
		return value.target === func.name && value.type === 'pre';
	});
	var post = modules.filter(function(value){
		return value.target === func.name && value.type === 'post';
	});
	return function(...args){
		return new Promise(function(resolve, reject){
			runMultSteps(pre,0,...args)
				.then(function(...args){
					return func(...args);
				})
				.then(function(...args){
					return runMultSteps(post,0,...args);
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