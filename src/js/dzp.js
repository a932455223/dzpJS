;(function(struct,global){

	if(typeof module === 'object' && module.exports){
		module.exports = struct;
	}
	else if(typeof define === 'function' && define.amd){
		define('dzp',struct);
	}
	global.dzp = struct;
})(function(wrap,opts){
	console.log('%cThis is a app.','color:red;');
},window);

