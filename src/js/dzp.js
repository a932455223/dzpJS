;(function(struct,global){
	var dftOpt = {

	};

	function getStyle(elem,props){
			var style = global.getComputedStyle && global.getComputedStyle(elem) || elem.currentStyle || elem.style;
			return style[props];
		}

	
	function extend(target){
		for(var index=1;index<arguments.length;index++){
			var source = arguments[index];
			if(source !=null){
				for(var key in source){
					if(Object.prototype.hasOwnProperty.call(source,key)){
						target[key] = source[key];
					}
				}
			}
		}
	}	
	
	//
	function loadImg(imgs,callback){
		var imgNodes = [];
		var count = 0;
		imgs.forEach(function(src){
			var img = new Image();
			img.onload = function(){
				count++;
				if(imgs.length === count){
					callback(imgNodes);
				}
			}
			img.onerror = function(err){
				throw err;
			}
			img.src = src;
			imgNodes.push(img);
		});
	}



	struct.prototype = {
		init:function(config){
			var that = this;
			console.log('%cDzp is inited.','color:DeepSkyBlue;');

			extend(this.config = {},dftOpt,config);

			
			this.canvas = document.createElement('canvas');
			this.width = this.container.clientWidth - parseFloat(getStyle(this.container,'paddingLeft')) - parseFloat(getStyle(this.container,'paddingRight'));
			this.height = this.width;
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.container.appendChild(this.canvas);
			if(this.canvas.getContext){
				this.ctx = this.canvas.getContext('2d');
			}else{
				this.container.appendChild(document.createTextNode('Sorry.your browser doesn\'t support canvas'));
				throw new Error('cant find getContext on canvas');
			}

			loadImg([this.config.wheelImg,this.config.needleImg],function(imgNodes){
				that.wheelImg = imgNodes[0];
				that.needleImg = imgNodes[1];
				that.draw();
				console.log('imgs is loading.');
			});

		},
		draw:function(){
			this.ctx.drawImage(this.wheelImg,0,0,this.width,this.width);
		}
	}
	if(typeof module === 'object' && module.exports){
		module.exports = struct;
	}
	else if(typeof define === 'function' && define.amd){
		define('dzp',struct);
	}
	global.dzp = struct;
})(function(wrap,opts){
	this.container = typeof wrap === 'string' ? document.getElementById(wrap):wrap;
	this.init(opts);
},window);

