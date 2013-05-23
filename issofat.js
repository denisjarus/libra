var ui = {},
	maxWeight = 0,
	dragOffset = {};

window.onload = function() {
	ui.arrow = document.getElementById('arrow');
	ui.proceed = document.getElementById('proceed');
	ui.leftPan = document.getElementById('left-pan');
	ui.rightPan = document.getElementById('right-pan');

	//init items
	var ground = document.getElementById('ground'),
		bounds = ground.getBoundingClientRect();

	ui.items = document.getElementsByClassName('item');

	for (var i = 0, len = ui.items.length; i < len; i++) {
		var item = ui.items[i];
		item.id = 'item' + i;
		item.addEventListener('dragstart', onDrag, false);
		item.addEventListener('dragend', onDragEnd, false);
		item.weight = 1 + i;
		item.style.left = Math.random() * (bounds.width - item.getBoundingClientRect().width) + 'px';

		maxWeight += item.weight;
	}

	//init targets
	var targets = [ui.leftPan, ui.rightPan, ground];

	for (i = 0, len = targets.length; i < len; i++) {
		var target = targets[i];
		target.addEventListener('dragover', onDragOver, false);
		target.addEventListener('drop', onDrop, true);
	}

	saveGame(true);
	update();
}

function onDrag(event) {
	var item = event.target,
		position = item.getBoundingClientRect();

	dragOffset.x = position.left - event.clientX;
	dragOffset.y = event.clientY - position.bottom;

	item.style.transition = 'bottom 0s, opacity 0.5s';
	item.style.opacity = '0.1';

	event.dataTransfer.setData('Text', item.id);
}

function onDragEnd(event) {
	event.target.style.opacity = null;
}

function onDragOver(event) {
	event.preventDefault();
}

function onDrop(event) {
	var item = document.getElementById(event.dataTransfer.getData('Text')),
		bounds = event.currentTarget.getBoundingClientRect(),
		x = event.clientX - bounds.left + dragOffset.x,
		y = bounds.bottom - event.clientY + dragOffset.y;

	if (! item) return;

	event.preventDefault();
	event.currentTarget.appendChild(item);

	item.style.left = clamp(x, 0, bounds.width - item.getBoundingClientRect().width) + 'px';
	item.style.bottom = y + 'px';

	window.setTimeout(function() {
		item.style.transition = null;
		item.style.bottom = null;
		item.style.opacity = '1';
	}, 50);

	update();
}

function getWeight(target) {
	var weight = 0;
	for (var i = 0, len = target.children.length; i < len; i++) {
		weight += target.children[i].weight;
	}
	return (weight / maxWeight);
}

function clamp(value, min, max) {
	return Math.max(min, Math.min(value, max));
}

function update() {
	var weight1 = getWeight(ui.leftPan),
		weight2 = getWeight(ui.rightPan);

	ui.leftPan.style.height = 405 + weight1 * 60 + 'px';
	ui.rightPan.style.height = 405 + weight2 * 60 + 'px';
	ui.arrow.style['-webkit-transform'] = 
	ui.arrow.style.transform ='rotate(' + Math.max(-45, Math.min((weight2 - weight1) * 135, 45)) + 'deg)';

	if (weight1 === 0.5 && weight2 === 0.5) {
		ui.proceed.style.color = null;
		ui.proceed.style.textDecoration = null;
		ui.proceed.setAttribute('href', 'http://www.mspaintadventures.com/?s=6&p=pony');
	} else {
		ui.proceed.style.color = 'gray';
		ui.proceed.style.textDecoration = 'none';
		ui.proceed.setAttribute('href', '#');
	}
}

function saveGame(session) {
	try {
		var storage = session ? sessionStorage : localStorage;
		for (var i = 0, len = ui.items.length; i < len; i++) {
			var item = ui.items[i];

			storage[i] = JSON.stringify({
				id: item.id,
				parentId: item.parentNode.id,
				position: item.style.left
			});
		}
	} catch(error) {
		console.log(error);
	}
}

function loadGame(session) {
	try {
		var storage = session ? sessionStorage : localStorage;
		for (var i = 0, len = ui.items.length; i < len; i++) {
			var data = JSON.parse(storage[i]),
				item = document.getElementById(data.id);

			document.getElementById(data.parentId).appendChild(item);
			item.style.left = data.position;

			update();
		}
	} catch(error) {
		console.log(error);
	}
}
