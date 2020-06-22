function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OFFSET = 200;
var Targets = [];
prevent = true;

var Dot =
/*#__PURE__*/
function () {
  function Dot() {
	_classCallCheck(this, Dot);

	for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
	  props[_key] = arguments[_key];
	}

	this.x = props[0];
	this.y = props[1];
	this.size = 0;
  }

  _createClass(Dot, [{
	key: "draw",
	value: function draw(size) {
	  begin();
	  if (this.x + this.size < 0 || this.y + this.size < 0 || this.x - this.size > cw || this.y - this.size > ch) return;
	  circle(this.x, this.y, size);
	  fill(255);
	  close();
	}
  }, {
	key: "update",
	value: function update(size) {
	  this.draw(this.size = size);
	}
  }]);

  return Dot;
}();

var Snake =
/*#__PURE__*/
function () {
  function Snake() {
	_classCallCheck(this, Snake);

	for (var _len2 = arguments.length, props = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	  props[_key2] = arguments[_key2];
	}

	this.x = props[0];
	this.y = props[1];
	this.angle = 0;
	this.DETAIL = 5;
	this.points = 0;
	this.speed = props[2] || 0;
	this.tail = [new Dot(this.x, this.y), new Dot(this.x, this.y - 10)];
	var i = 0;

	while (i < 10) {
	  this.tail.push(new Dot(this.x, this.y - i++ * this.DETAIL));
	}

	this.size = this.tail.length * cos(50);
  }

  _createClass(Snake, [{
	key: "extraPoint",
	value: function extraPoint(objectPoint) {
	  this.tail.push(new Dot(objectPoint.x, objectPoint.y));
	  this.points += ~~objectPoint.size;
	}
  }, {
	key: "draw",
	value: function draw(index) {
	  this.tail[index].update(this.size);
	}
  }, {
	key: "update",
	value: function update() {
	  // bypass dot one because that head snake :)
	  var i = 1,
		  length = this.tail.length;

	  while (i < length) {
		this.draw(length - i);
		var dist = hypot(this.tail[i].x - this.tail[i - 1].x, this.tail[i].y - this.tail[i - 1].y);

		if (dist > this.DETAIL) {
		  var deg = atan2(this.tail[i - 1].x - this.tail[i].x, this.tail[i - 1].y - this.tail[i].y);
		  this.tail[i].x += dist / this.DETAIL * sin(deg) * this.speed;
		  this.tail[i].y += dist / this.DETAIL * cos(deg) * this.speed;
		}

		i++;
	  }

	  this.draw(0); //this.x += this.speed * cos(this.deg)
	  //this.y += this.speed * sin(this.deg)
	}
  }]);

  return Snake;
}();

var SnakeMain = new Snake(ww / 2, wh / 2, 1);
var backgroundPlate = new (
/*#__PURE__*/
function () {
  function _class() {
	_classCallCheck(this, _class);

	this.x = 100 * 40;
	this.y = 100 * 40;
	this.speed = 1;
	this.angle = 0;
  }

  _createClass(_class, [{
	key: "draw",
	value: function draw() {
	  var max = Math.min(200, Math.max(this.x + cw, this.y + ch) / 40);

	  for (var _i = ~~Math.min(this.x / 40, this.y / 40); _i < max; _i++) {
		begin();
		line(0 - this.x, _i * 40 - this.y, 200 * 40 - this.x, _i * 40 - this.y);
		stroke(255, 255, 265, .5);
		close();
		begin();
		line(_i * 40 - this.x, -this.y, _i * 40 - this.x, 200 * 40 - this.y);
		stroke(255, 255, 255, .5);
		close();
	  }
	}
  }, {
	key: "update",
	value: function update() {
	  this.draw();
	  this.x += this.speed * sin(this.angle);
	  this.y += this.speed * cos(this.angle); // update con snake main

	  var i = 1,
		  length = SnakeMain.tail.length;

	  while (i < length) {
		var e = SnakeMain.tail[i++];
		e.x -= this.speed * sin(this.angle);
		e.y -= this.speed * cos(this.angle);
	  } //@end


	  Target.updateOffsetAnchor(this.speed, this.angle);
	  if (this.x + OFFSET > 200 * 40) this.x = 200 * 40 - OFFSET;else if (this.x - OFFSET < 0) this.x = OFFSET;
	  if (this.y + OFFSET > 200 * 40) this.y = 200 * 40 - OFFSET;else if (this.y - OFFSET < 0) this.y = OFFSET;
	}
  }, {
	key: "speed",
	set: function set(e) {
	  SnakeMain.speed = e;
	},
	get: function get() {
	  return SnakeMain.speed;
	}
  }]);

  return _class;
}())();

var Target =
/*#__PURE__*/
function () {
  function Target() {
	_classCallCheck(this, Target);

	var _ref = [random(0, 100 * 40), random(0, 100 * 40)];
	this.x = _ref[0];
	this.y = _ref[1];
	this.color = [random(0, 360), random(40, 60), random(40, 60)];
	this.shadowCount = random(0, 20);
	this.size = random(3, 10);
  }

  _createClass(Target, [{
	key: "draw",
	value: function draw() {
	  var r = this.size + ~~this.shadowCount;
	  if (this.x + r < 0 || this.y + r < 0 || this.x - r > cw || this.y - r > ch) return;
	  var i = ~~this.shadowCount;

	  while (i > -1) {
		begin();
		circle(this.x, this.y, this.size + i);
		fill("hsla(".concat(this.color[0], ", ").concat(this.color[1], "%, ").concat(this.color[1], "%, ") + (i ? (~~this.shadowCount - i) * .2 / ~~this.shadowCount : 1) + ")");
		close();
		i--;
	  }
	}
  }, {
	key: "drawInMap",
	value: function drawInMap() {
	  var xNotView = (~~(ww / 2 / 40) + 40) * 40;
	  var yNotView = (~~(wh / 2 / 40) + 40) * 40;
	  if (abs(this.x) > xNotView || abs(this.y) > yNotView) return;
	  var a = Math.max(xNotView, yNotView);
	  begin();
	  circle(this.x * 100 / a, this.y * 100 / a, 2);
	  fill("hsla(".concat(this.color[0], ", ").concat(this.color[1], "%, ").concat(this.color[1], "%, 1)"));
	  close();
	}
  }], [{
	key: "updateOffsetAnchor",
	value: function updateOffsetAnchor(speed, angle) {
	  Targets = Targets.map(function (e) {
		e.x -= speed * sin(angle);
		e.y -= speed * cos(angle);
		e.draw();
		e.drawInMap();

		if (CircleCheck({
		  x: SnakeMain.x,
		  y: SnakeMain.y,
		  radius: SnakeMain.size
		}, {
		  x: e.x,
		  y: e.y,
		  radius: e.size
		})) {
		  // ;)
		  SnakeMain.extraPoint(e);
		  return new Target();
		}

		return e;
	  });
	}
  }]);

  return Target;
}();

for (var _i2 = 0; _i2 < 200 * 4; _i2++) {
  Targets.push(new Target());
}

var moveFast = new (
/*#__PURE__*/
function () {
  function _class2() {
	var _this = this;

	_classCallCheck(this, _class2);

	this.x = ww - 70;
	this.y = wh - 80;
	this.radius = 30;
	this.hoverd = false;
	this._hoverd = false;
	this.idTouch = null;
	my(window).touchstart(function () {
	  touches.some(function (e) {
		if (PointCircleCheck(_this, e.x, e.y)) {
		  _this.hoverd = true;
		  _this.idTouch = e.id;
		}
	  });
	}).touchend(function (e) {
	  if ([].slice.call(e.changedTouches).some(function (e) {
		return e.identifier == _this.idTouch;
	  })) _this.hoverd = false;
	});
  }

  _createClass(_class2, [{
	key: "draw",
	value: function draw() {
	  begin();
	  circle(this.x, this.y, this.radius);
	  fill(200, 200, 200, 0.2 + (this.hoverd ? 0.3 : 0));
	  close();
	  begin();
	  move(this.x, this.y - this.radius / 2);
	  to(this.x + this.radius / 2, this.y + this.radius / 3);
	  to(this.x - this.radius / 2, this.y + this.radius / 3);
	  to(this.x, this.y - this.radius / 2);
	  stroke(200, 200, 200, .5 + (this.hoverd ? 0.3 : 0));
	  close();
	}
  }, {
	key: "update",
	value: function update() {
	  this.draw();
	}
  }, {
	key: "hoverd",
	set: function set(e) {
	  this._hover = e;
	  if (e) backgroundPlate.speed = 3;else backgroundPlate.speed = 1; //SnakeMain.speed = 1
	},
	get: function get() {
	  return this._hover;
	}
  }]);

  return _class2;
}())();
var Control = new (
/*#__PURE__*/
function () {
  function _class3() {
	var _this2 = this;

	_classCallCheck(this, _class3);

	this.x = 70;
	this.y = wh - 80; //this.first = []

	this._angle = 0;
	this.idTouch = null;
	my(window).touchstart(function () {
	  touches.some(function (e) {
		if (PointCircleCheck({
		  x: _this2.x,
		  y: _this2.y,
		  radius: 50
		}, e.x, e.y)) {
		  _this2.idTouch = e.id;
		  return true;
		}
	  });
	}).touchend(function (e) {
	  if ([].slice.call(e.changedTouches).some(function (e) {
		return e.identifier == _this2.idTouch;
	  })) {
		_this2.first = [];
		_this2.idTouch = null;
	  }
	});
  }

  _createClass(_class3, [{
	key: "draw",
	value: function draw() {
	  var xOff = Math.min(40, hypot(mouseX - this.x, mouseY - this.y));
	  begin();
	  circle(this.x, this.y, 50);
	  fill('hsla(102, 50%, 50%, .2)');
	  close();
	  /*
	  for ( let i = 0; i < 50; i ++ ) {
	  begin()
		arc(this.x, this.y, i, 0, 360)
		stroke(`hsla(204, 50%, 50%, ` + ( i / 60 ) + ")")
	  close()
	  }
		  
	  for ( let i = 0; i < 30; i++ ) {
	  begin()
		arc(this.x + (this.idTouch ? sin(this.angle) * xOff : 0), this.y + (this.idTouch ? cos(this.angle) * xOff : 0), i, 0, 360)
		stroke(`hsla(102, 50%, 50%, ` + ( i / 60 ) + ")")
	  close()
	  }
	  */

	  begin();
	  circle(this.x + (this.idTouch != null ? sin(this.angle) * xOff : 0), this.y + (this.idTouch != null ? cos(this.angle) * xOff : 0), 30);
	  fill('hsla(204, 50%, 50%, .5)');
	  close();
	}
  }, {
	key: "update",
	value: function update() {
	  var _this3 = this;

	  this.draw();
	  if (!interact || this.idTouch == null) return;
	  touches.some(function (e) {
		if (e.id != _this3.idTouch) return;
		var angle = atan2(e.x - _this3.x, e.y - _this3.y);
		_this3.angle = angle;
		return true;
	  });
	}
  }, {
	key: "angle",
	get: function get() {
	  return this._angle;
	},
	set: function set(e) {
	  this._angle = e;
	  backgroundPlate.angle = e;
	  SnakeMain.angle = e;
	}
  }]);

  return _class3;
}())();

function writePoint() {
  begin();
  fill(255);
  fillText("Score: " + SnakeMain.points, cw, 0);
  close();
}

function drawMap() {
  begin();
  square(0, 0, 100, 100);
  fill("hsla(102, 50%, 50%, .2)");
  close(); // draw snakeMain in map

  begin();
  line(50, 0, 50, 100);
  stroke(177, 177, 177, .5);
  begin();
  line(0, 50, 100, 50);
  stroke(177, 177, 177, .5);
  close();
  begin();
  circle(50, 50, 2);
  fill(255);
  close();
}

function setup() {
  createCanvas();
  fontFamily("sans-serif");
  fontSize(16);
  textBaseline("top");
  textAlign("right");
}

function draw() {
  clear();
  background(20, 20, 20);
  backgroundPlate.update(); // Targets.forEach(e => e.draw())

  drawMap();
  SnakeMain.update();
  Control.update();
  moveFast.update();
  writePoint();
}