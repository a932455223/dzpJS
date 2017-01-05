;(function(struct,global){
	'use strict'
	var dftOpt = {

	};

	function getStyle(elem,props){
			var style = global.getComputedStyle && global.getComputedStyle(elem) || elem.currentStyle || elem.style;
			return style[props];
		}

	function getOffsetRect(elem){
		var box = elem.getBoundingClientRect();
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
		var clientTop = document.clientTop || document.body.clientTop || 0;
		var clientLeft = document.clientLeft || document.body.clientLeft || 0;
		return {
			top:box.top + scrollTop - clientTop,
			left:box.left + scrollLeft - clientLeft
		}
	}
	
	//两点间距离公式
	function pointDistance(x1,y1,x2,y2){
		return Math.abs(Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)));
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

	function fixed(num,precision){
		precision = precision || 2;
		return parseFloat(num.toFixed(precision))
	}


	struct.prototype = {
		init:function(config){
			var that = this;
			this.rotate = 0;
			this.speed = 0;
			this.accelerate = 0.01;
			this.state = 0;
			this.prepareStop = false;
			this.beginStop = false;
			this._timestart = 0;
			this._timeend = 0;
			//减速停止时使用到的变量
			this.minTargetDegree = 0;
			this.beginSlowDegree = 0;
			console.log('%cDzp is inited.','color:DeepSkyBlue;');
			extend(this.config = {},dftOpt,config);
			this.clickable = true;
			this.timeoutable = true;
			this.canvas = document.createElement('canvas');
			this.width = this.container.clientWidth - parseFloat(getStyle(this.container,'paddingLeft')) - parseFloat(getStyle(this.container,'paddingRight'));
			this.height = this.width;
			this.maxSpeed = 0.5;
			this.decelerationDistance = (function(){
				var an = parseFloat((this.maxSpeed - this.accelerate).toFixed(2));
				var a1 = 0;
				var d = Math.abs(this.accelerate);
				var n = an/d+1;
				return parseFloat(((a1+an)*n*0.5).toFixed(3));
			}.bind(this))();
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.container.appendChild(this.canvas);
			this.x0 = this.width/2;
			this.y0 = this.height/2;
			this.debug = false;
			if(this.canvas.getContext){
				this.ctx = this.canvas.getContext('2d');
			}else{
				this.container.appendChild(document.createTextNode('Sorry.your browser doesn\'t support canvas'));
				throw new Error('cant find getContext on canvas');
			}

			loadImg([this.config.wheelImg,this.config.needleImg],function(imgNodes){
				that.wheelImg = imgNodes[0];
				that.needleImg = imgNodes[1];
				that.needleWidth = that.width * that.config.needleRatio;
				that.needleHeight = (that.needleWidth/that.needleImg.width)*that.needleImg.height; //等比例缩放
				that.draw();
			});
			
			this.eventRegion = Math.round(this.width*this.config.eventRange*0.5);
			this.canvas.addEventListener('click',function(evt){
				var offset = getOffsetRect(that.canvas);
				var x = evt.pageX - offset.left;
				var y = evt.pageY - offset.top;
				var distance = pointDistance(x,y,this.x0,this.y0);
				if(distance < this.eventRegion && this.clickable){//触发事件
					this.clickable = false;
					if(!this._events ||!this._events['click'] || this._events['click'].length === 0){
						this.run();
					}else{
						this.emit('click');
					}
					
				}
			}.bind(this));
		},
		draw:function(){
			this.ctx.clearRect(0,0,this.width,this.height);
			this.ctx.save();
			

			if(this.state === 1 && this.speed === this.maxSpeed){
				this.state = 2;
				if(!!this.config.timeout){
					this._timestart =+ new Date();
				}
			}

			if(this.timeoutable && this.state === 2 && !!this.config.timeout && (new Date() - this._timestart) > parseInt(this.config.timeout)){//触发timeout事件
				this.timeoutable = false;
				this.emit('timeout');
			}
			if(this.state === 2 && this.prepareStop){//准备减速
				var diff = fixed(this.beginSlowDegree - this.rotate,3);
				while(diff < 0){
					diff = fixed(diff+2*Math.PI,3);
				}		
				 if(diff <= this.maxSpeed){
					this.speed = diff;
					this.beginStop = true;
				 }
			}

			if(this.accelerate > 0 && this.state === 3){
				this.accelerate = -this.accelerate;
			}

			if(this.state === 3 && this.speed === 0){
				this.state = 4;
				this.emit('stop');
			}

			
			if(this.state === 1 || this.state === 3){
				this.speed = parseFloat((this.speed+this.accelerate).toFixed(2));
			}
			
			// console.log(this.speed);
			this.rotate = this.rotate + this.speed;
			this.rotate = parseFloat((this.rotate > 2*Math.PI ? this.rotate - 2*Math.PI : this.rotate).toFixed(3));

			this.ctx.translate(this.width*0.5,this.height*0.5);
			this.ctx.save();
			if(this.config.wheelRun){
				this.ctx.rotate(this.rotate);
				this.ctx.drawImage(this.wheelImg,-this.width*0.5,-this.width*0.5,this.width,this.width);
				this.ctx.restore();
			}else{
				this.ctx.drawImage(this.wheelImg,-this.width*0.5,-this.width*0.5,this.width,this.width);
			}
			

			if(!this.config.wheelRun){
				this.ctx.rotate(this.rotate);
			}

			this.ctx.drawImage(this.needleImg,-this.needleWidth*0.5,-this.needleHeight*0.5,this.needleWidth,this.needleHeight);
			
			if(!this.config.wheelRun){
				this.ctx.restore();
			}
			this.ctx.restore();


			if(this.beginStop === true){
				this.state = 3;
				this.beginStop = false;
				this.speed = this.maxSpeed;
			}

			if(this.state!==0 && this.state!==4){
				global.requestAnimationFrame(this.draw.bind(this));
			}
		},
		reset:function(resetConfig){
			var resetConfig = resetConfig ||{removeClick:false}
			this.speed = this.minTargetDegree = this._timestart = this._timeend = this.beginSlowDegree =  this.rotate = this.state = 0;
			this.accelerate = Math.abs(this.accelerate);
			this.prepareStop  = this.beginStop =false;
			this.timeoutable = this.clickable = true;
			if(resetConfig.removeClick){
				this.off('click');
			}
			if(resetConfig.removeTimeout){
				this.off('timeout')
			}
			if(resetConfig.timeout){
				this.config.timeout = this.resetConfig.timeout;
			}

			this.draw();
		},
		stop:function(pointAt){
			if(this.config.wheelRun){
				pointAt = this.config.partNum - pointAt + 2;
			}
			if(!this.prepareStop){
				this.prepareStop = true;
				this.minTargetDegree = (pointAt-1)*(2*Math.PI/this.config.partNum);
				this.beginSlowDegree = this.minTargetDegree - this.decelerationDistance;
				console.log(this.beginSlowDegree);
				(function(){
					while(this.beginSlowDegree < 0){
						this.beginSlowDegree = fixed(this.beginSlowDegree + 2*Math.PI,3);
					}
				}.bind(this))();
				console.log('minTargetDegree:'+this.minTargetDegree);
				console.log('beginSlowDegree:'+this.beginSlowDegree);
			}
			
		},
		on:function(name,callback){
			this._events = this._events || {};
			this._events[name] = this._events[name] || [];
			this._events[name].push(callback);
		},
		off:function(name){
			this._events && this._events[name] && (this._events[name] = []);
		},
		emit:function(name){
			if(this._events[name] && this._events[name].length > 0){
				for(var i in this._events[name]){
					this._events[name][i].apply(this,Array.prototype.slice.call(arguments,1));
				}
			}
		},
		run:function(){
			if(this.state === 0){
				this.state = 1;
				this.draw();
			}
		}
	}
	if(typeof module === 'object' && module.exports){
		module.exports = struct;
	}
	else if(typeof define === 'function' && define.amd){
		define('dzp',struct);
	}
	global.Dzp = struct;
})(function(wrap,opts){
	this.container = typeof wrap === 'string' ? document.getElementById(wrap):wrap;
	this.init(opts);
},window);

