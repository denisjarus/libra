var leftPan, rightPan,
	maxWeight = 0,
	dragOffset = {};

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
	event.dataTransfer.setData('Text', event.target.id);

	var position = event.target.getBoundingClientRect();

	dragOffset.x = position.left - event.clientX;
	dragOffset.y = event.clientY - position.bottom;

	event.target.style.transition = 'bottom 0s';
}

function onOver(event) {
	if (event.target.className === 'target') {
		event.preventDefault();
	}
}

function onDrop(event) {
	var item = document.getElementById(event.dataTransfer.getData('Text')),
		itemSize = item.getBoundingClientRect(),
		position = event.target.getBoundingClientRect();

	event.preventDefault();
	event.target.appendChild(item);

	item.style.left = event.clientX - position.left + dragOffset.x + 'px';
	item.style.bottom = (position.bottom - event.clientY) + dragOffset.y + 'px';

	window.setTimeout(function() {
		item.style.transition = 'bottom 0.15s ease-in';
		item.style.bottom = 0;
	}, 10);

	update();
}

function getWeight(target) {
	var weight = 0;
	for (var i = 0, len = target.children.length; i < len; i++) {
		weight += target.children[i].weight;
	}
	return 50 + (weight / maxWeight) * 25 + '%';
}

function update() {
	leftPan.style.height = getWeight(leftPan);
	rightPan.style.height = getWeight(rightPan);
}

