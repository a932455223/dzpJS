dzpJS
=====
## 简介
dzpJS帮助快速制作大转盘前端效果，特点：

1.兼容性好，支持canvas的浏览器都支持

2.流畅，尤其在`andorid`上无卡顿

## example
注：用手机看效果更佳

[example 1](http://simon-du.me/dzpJs/example/wheel.html)

[example 2](http://simon-du.me/dzpJs/example/needle.html)

## usage

```
	<script src='yourpath/js/dzp.js'></script> //支持cmd,amd
	<div id='dzp'></div>
	<script>
		var dzp = new Dzp('dzpWrap',{
			wheelImg:'../images/round.png',
			needleImg:'../images/needle.png',
			partNum:6,
			wheelRun:true,
			timeout:10*1000,
			needleRatio:0.49,
			eventRange:0.3
		});
	</script>
```
#### 参数

partNum:大转盘的表盘一共有几块

wheelImg:转盘图片路径

partNum:转盘份数

timeout:多久时间后没有调用stop，则触发`timeout`事件

needleRatio:中心的指针，占盘面的比例

eventRange:中心的指针的可点击区域


在需要让大转盘停止下来的时候，就调用`result`对象的方法。下例中的5指的是指针停在第5个盘面上。

		result.stop(5);
在大转盘停下来后，如果还要继续使用，可以调用reset方法重置大转盘。

		result.reset();
