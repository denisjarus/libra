var leftPan, rightPan, maxWeight = 0;

window.onload = function() {
	var items = document.getElementsByClassName('item');
	for (var i = 0, len = items.length; i < len; i++) {
		var item = items[i];
		item.id = 'item' + i;
		item.addEventListener('dragstart', onDrag, false);
		item.weight = i + 1;
		maxWeight += item.weight;
	}

	leftPan = document.getElementById('left-pan');
	rightPan = document.getElementById('right-pan');

	var targets = [leftPan, rightPan, document.getElementById('ground')];
	for (i = 0, len = targets.length; i < len; i++) {
		var target = targets[i];
		target.addEventListener('dragover', onOver, false);
		target.addEventListener('drop', onDrop, false);
	}
}

function onDrag(event) {
	var offset = getPosition(event.target);
	offset.x -= event.clientX;
	offset.y -= event.clientY;

	//event.dataTransfer.setData('id', event.target.id);
	event.dataTransfer.setData('offsetX', offset.x);
	event.dataTransfer.setData('offsetY', offset.y);

}

function onOver(event) {
	if (event.target.className === 'target') {
		event.preventDefault();
	}
}

function onDrop(event) {
	var item = document.getElementById('item0'),
		position = getPosition(event.target),
		offset = {
			x: Number(event.dataTransfer.getData('offsetX')),
			y: Number(event.dataTransfer.getData('offsetY'))
		};

	event.preventDefault();
	event.target.appendChild(item);
	item.style.left = event.clientX - position.x + offset.x + 'px';
	item.style.top = event.clientY - position.y + offset.y + 'px';
	item.style.webkitAnimation = 'none';
	setTimeout(function() {
		item.style.webkitAnimation = 'fall 5s';
	}, 10);
	calculate();
}

function getPosition(element) {
	var position = { x: 0, y: 0 };
	while (element) {
		position.x += element.offsetLeft;
		position.y += element.offsetTop;
		element = element.offsetParent;
	}
	return position;
}

function getWeight(target) {
	var weight = 0;
	for (var i = 0, len = target.children.length; i < len; i++) {
		weight += target.children[i].weight;
	}
	return 50 + (weight / maxWeight) * 50 + '%';
}

function calculate() {
	leftPan.style.height = getWeight(leftPan);
	rightPan.style.height = getWeight(rightPan);
}

