
require('../css/example.less');
require('../index.html');

var dzp = require('./dzp');

var dzp = new Dzp('dzpWrap',{
	wheelImg:'../images/round.png',
	needleImg:'../images/needle.png',
	partNum:6,
	wheelRun:true,
	offset:false,
	timeout:10*1000,
	needleRatio:0.49,
	eventRange:0.3
});

//该事件为点击中心按钮时候触发的。
dzp.on('click',function(){
	this.run(); // dzp.run();

	setTimeout(function(){//模拟ajax
		dzp.stop(3)
	},3000);

});

dzp.on('timeout',function(){
	console.log('timeout');
});