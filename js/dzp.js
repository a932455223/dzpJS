;(function($, undefined) {
	//两个常量
	var maxSpeed = 20;
	var vendor = ['webkit', 'Moz', 'O', 'ms'];
//下面变量在重置中要修改值
	var accelerate = 1;
	var canStop = false;
	var startStop = false;
	var isAnimation = false;

	// var tempStyle = document.body.style;
	var requestId = 0;
	var startime = 0;
	var lpos = 0;
	var destination,elm,prefix,perPart;
	var options ={
		isOffset:false,
		partNum:8,
		afterStop:undefined
	};
//   var rAF = window.requestAnimationFrame	||
// window.webkitRequestAnimationFrame	||
// window.mozRequestAnimationFrame	||
// window.oRequestAnimationFrame	||
// window.msRequestAnimationFrame	||
// function (callback) { window.setTimeout(callback, 1000 / 60); };
	/**給prefix赋值**/
	(function() {
		var testEl = document.createElement('div');
		$.each(vendor, function(index, item) {
			if (testEl.style[item + 'TransitionProperty'] !== undefined) {
				prefix = '-'+item.toLowerCase()+'-';
				return false;
			}
		});
	})();

	function reset() {
		elm.css(prefix + 'transform', 'rotate(0deg)');
		accelerate = 1;
		canStop = false;
		startStop = false;
		options.partNum = 8;
		options.isOffset = false;
		requestId = 0;
		startime = 0;
		lpos = 0;
		destination = undefined;
		elm = undefined;
		options.cal = undefined;
		perPart = undefined;
	}
	function fixDeg(deg) {
		var _r = deg % 360;
		_r = _r >= 0 ? _r : _r + 360;
		return _r;
	}

	function getStopDeg(destination) {
		var s = destination - 30;
		if (s < 0) {
			s += 360;
		}
		return s;
	}

	function faster(f) {
		if (accelerate < maxSpeed) {
			accelerate += 0.5;
		}
		if (accelerate === maxSpeed && !canStop) {
			canStop = true;
		}
		f = f + accelerate;
		return f;
	}

	function slower(f) {
		var _start = fixDeg(destination) - 30;
		_start = _start > 0 ? _start : _start + 360;
		var _abs = Math.abs(_start - fixDeg(f));
		if (!startStop && _abs <= 20) {
			startStop = true;
			return _start;
		}
		if (startStop && accelerate > 0) {
			accelerate -= 0.5;
		} else if (accelerate === 0) {
			stop();
		}
		f = f + accelerate;
		return f;
	}




	function render() {
		if (destination === undefined) {
			lpos = faster(lpos);
		} else if (canStop) {
			lpos = slower(lpos);
		}
		elm.css(prefix + 'transform', 'rotate(' + lpos + 'deg' + ')');
	}

	function start() {
		//这个if语句在转盘停止转动并且没有重置的时候阻止转盘转动.
		if (!requestId) {
			requestId = setInterval(render, 1000 / 60);
			isAnimation = true;
		}
	}

	function stop() {
		if (requestId) {
			clearTimeout(requestId);
			isAnimation = false;
      	if(options.afterStop){ options.afterStop();}
		}
    
	}

	function stopAndPointer(pointPart) {
		perPart = 360/options.partNum;
		destination = (options.isOffset ? parseInt(pointPart) - 0.5: parseInt(pointPart) - 1) * perPart;
	}

	$.fn.dzp = function(_options) {
		//判断没有动画时候才开始动画
		if(!isAnimation){
			$.extend(options,_options);
    	
			elm = $(this[0]);
			start();
			
		}
		
		return {
			stop: stopAndPointer,
			reset: reset
		};
	}
})(Zepto);