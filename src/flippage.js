// 初始化页面滑动效果
function initPageFlip(){
	var winHeight = $(window).height();
	var pagePointer = 0;
	var pageCount = $('.page-block').length;

	var pageUpperSet = $('.page-block>.upper-block');
	var pageLowerSet = $('.page-block>.lower-block');

	var endDistance = 200;

	for (var i = 0; i < pageUpperSet.length; i++) {
		if (i!==0) {
			updatePos(-180, pageUpperSet[i]);
		}
		updateZIndex(pageCount-i, pageUpperSet[i]);
		updateZIndex(pageCount-i, pageLowerSet[i]);
		if (i!==0&&i!==1) {
			updateDisplay(false, pageUpperSet[i]);
			updateDisplay(false, pageLowerSet[i]);
		}
	}

	var target = $(".page-wrapper").get(0);

	if (target) {

		// 添加hammer事件
		var hammertime = new Hammer(target);
		hammertime.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
		// threshold表示识别拖动事件的最短距离，默认是10，设定为0保证更顺滑的拖动效果

		// pos：当前页面的位置
		var pos={x:0, y:0};
		hammertime.on('panstart panmove', function(ev) {
			if (ev.type == 'panstart') {
				_x = pos.x || 0;
				_y = pos.y || 0;
			}
			pos.x = _x + ev.deltaX;
			pos.y = _y + ev.deltaY;

			// 拖动某个页面的时候，通过计算角度倾斜上方或者下方的页面
			// y值为正代表向下，负值代表向上
			if (pos.y<=0) {
				// 翻上
				if (pos.y<=-endDistance&&pageCount-pagePointer<=1) {
					pos.y=-endDistance;
				}

				var deg = (pos.y/(winHeight/2))*(-90);
				updatePos(deg, pageLowerSet[pagePointer]);
				updateZIndex(pageCount+1, pageLowerSet[pagePointer]);

				var lowerDeg = (2+(pos.y/(winHeight/2)))*(-90);
				updatePos(lowerDeg, pageUpperSet[pagePointer+1]);
				updateZIndex(pageCount, pageUpperSet[pagePointer+1]);
			}else{
				// 翻下
				if (pos.y>=endDistance&&pagePointer===0) {
					pos.y=endDistance;
				}

				var deg = (pos.y/(winHeight/2))*(-90);
				updatePos(deg, pageUpperSet[pagePointer]);
				updateZIndex(pageCount, pageUpperSet[pagePointer]);

				var lowerDeg = (2-(pos.y/(winHeight/2)))*(90);
				updatePos(lowerDeg, pageLowerSet[pagePointer-1]);
				updateZIndex(pageCount+1, pageLowerSet[pagePointer-1]);
			}
		});
		hammertime.on('panend', function(ev){
			// 一次拖动结束之后的处理事件
			if (pos.y<-100&&(pageCount-pagePointer>1)) {
				// 当y小于-100时，换下一页，下一页转动到0°位置，本页转到180°位置，上一页复位
				// 如果没有下一页，本页归位
				pagePointer++;

				updateAni(0, pageLowerSet[pagePointer]);
				updateAni(0, pageUpperSet[pagePointer]);
				updateAni(-180, pageUpperSet[pagePointer+1]);
				updateAni(180, pageLowerSet[pagePointer-1]);
				pos.x=0;
				pos.y=0;

				setTimeout(function(){
					
					updateZIndex(pageCount, pageUpperSet[pagePointer-1]);
					updateZIndex(pageCount, pageLowerSet[pagePointer-1]);

					updateZIndex(pageCount, pageUpperSet[pagePointer]);
					updateZIndex(pageCount, pageLowerSet[pagePointer]);

					// 下数第二页重新显示，上数第二页隐藏，保证性能
					updateDisplay(true, pageUpperSet[pagePointer+1]);
					updateDisplay(true, pageLowerSet[pagePointer+1]);
					updateDisplay(false, pageUpperSet[pagePointer-2]);
					updateDisplay(false, pageLowerSet[pagePointer-2]);
				}, 0);

				// setTimeout(function(){
				// 	$(target).removeClass('wl-active').next().addClass('wl-active');
				// }, 300);

			}else if(pos.y>100&&(pagePointer>0)){
				// 当y大于100时，换上一页，上一页转动到0°位置，本页转到-180°位置，下一页复位
				// 如果没有上一页，本页归位
				pagePointer--;

				updateAni(0, pageLowerSet[pagePointer]);
				updateAni(0, pageUpperSet[pagePointer]);
				updateAni(-180, pageUpperSet[pagePointer+1]);
				updateAni(180, pageLowerSet[pagePointer-1]);
				pos.x=0;
				pos.y=0;

				setTimeout(function(){

					updateZIndex(pageCount-pagePointer-1, pageUpperSet[pagePointer+1]);
					updateZIndex(pageCount-pagePointer-1, pageLowerSet[pagePointer+1]);

					updateZIndex(pageCount, pageUpperSet[pagePointer]);
					updateZIndex(pageCount, pageLowerSet[pagePointer]);


					// 下数第二页重新显示，上数第二页隐藏，保证性能
					updateDisplay(true, pageUpperSet[pagePointer-1]);
					updateDisplay(true, pageLowerSet[pagePointer-1]);
					updateDisplay(false, pageUpperSet[pagePointer+2]);
					updateDisplay(false, pageLowerSet[pagePointer+2]);
				}, 0);


				// setTimeout(function(){
				// 	$(target).removeClass('wl-active').prev().addClass('wl-active');
				// }, 300);

			}else{
				// 拖动距离没有超过阈值，全部归位
				updateAni(0, pageLowerSet[pagePointer]);
				updateAni(0, pageUpperSet[pagePointer]);
				updateAni(-180, pageUpperSet[pagePointer+1]);
				updateAni(180, pageLowerSet[pagePointer-1]);

				updateZIndex(pageCount, pageUpperSet[pagePointer]);
				updateZIndex(pageCount, pageLowerSet[pagePointer]);
				updateZIndex(pageCount-pagePointer-1, pageUpperSet[pagePointer+1]);
				updateZIndex(pageCount, pageLowerSet[pagePointer-1]);
				pos.x=0;
				pos.y=0;
			}
		});

	}
}

// 无动画更新页面位置的方法
function updatePos (deg, obj) {
	if (obj) {
		var value = [
			'perspective(1000px) rotate3d(1, 0, 0, '+deg+'deg)'
		];
		obj.style.webkitTransition = 'none';
		obj.style.mozTransition = 'none';
		obj.style.transition = 'none';
		obj.style.webkitTransform = value;
		obj.style.mozTransform = value;
		obj.style.transform = value;
	}
}

// 有动画更新页面位置的方法
function updateAni (deg, obj){
	if (obj) {
		var value = [
			'perspective(1000px) rotate3d(1, 0, 0, '+deg+'deg)'
		];
		obj.style.webkitTransition = 'all 0.5s';
		obj.style.mozTransition = 'all 0.5s';
		obj.style.transition = 'all 0.5s';
		obj.style.webkitTransform = value;
		obj.style.mozTransform = value;
		obj.style.transform = value;
	}
}

function updateZIndex (zIndex, obj){
	if (obj) {
		obj.style.zIndex = zIndex;
	}
}

function updateDisplay (display, obj){
	if (obj) {
		if (display) {
			obj.style.display = 'block';
		}else{
			obj.style.display = 'none';

		}
	}
}