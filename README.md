dzpJS
=====
##简介
dzpJS帮助快速制作大转盘前端效果
##usage
####html
		<div id='dzp'></div>
####javascript
		var result = $('#dzp').dzp(8,afterStop);
第一个参数'8'代表大转盘盘面共有8块，afterStop是转盘停止下来时候调用的方法。
在需要让大转盘停止下来的时候，就调用result中得方法。下例中的5指的是指针停在第5个盘面上。
			result.stop(5);
在大转盘停下来后，如果还要继续使用，可以调用reset方法重置大转盘。
			result.reset();
##待解决
需要添加一个offset属性，兼容指针初始值指向产品边线的情况。
