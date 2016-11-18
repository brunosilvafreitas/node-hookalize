var preX = function (y) {
	return new Promise(function(resolve, reject){
		y = 'pre1:'+y;
		console.log(y);
		if(y)
			resolve(y);
		else
			reject(new Error('invalid y'));
	});
};
module.exports = preX;