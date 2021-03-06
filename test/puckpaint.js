// Generated by CoffeeScript 1.3.3

/*
 Vector Class
*/


(function() {
  var DOMNorm, DOMNormalizer, Puck, PuckCanvas, SelfVector, Vector, init, intervalId, start, step, stop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Vector = (function() {

    function Vector(x, y) {
      var _ref, _ref1;
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      if (((_ref = this.x) != null ? _ref.x : void 0) && ((_ref1 = this.x) != null ? _ref1.y : void 0)) {
        this.y = this.x.y;
        this.x = this.x.x;
      }
      this.self = new SelfVector(this);
    }

    Vector.prototype.dupl = function() {
      return new Vector(this.x, this.y);
    };

    Vector.prototype.load = function(other) {
      this.x = other.x;
      this.y = other.y;
      return this;
    };

    Vector.prototype.magn = function() {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };

    Vector.prototype.add = function(other) {
      var sum;
      sum = this.dupl();
      sum.x += other.x;
      sum.y += other.y;
      return sum;
    };

    Vector.prototype.sub = function(other) {
      var diff;
      diff = this.dupl();
      diff.x -= other.x;
      diff.y -= other.y;
      return diff;
    };

    Vector.prototype.scale = function(scalar) {
      var scaled;
      scaled = this.dupl();
      scaled.x *= scalar;
      scaled.y *= scalar;
      return scaled;
    };

    Vector.prototype.rotate = function(rad) {
      var x, y;
      x = this.x * Math.cos(rad) - this.y * Math.sin(rad);
      y = this.x * Math.sin(rad) + this.y * Math.cos(rad);
      return new Vector(x, y);
    };

    Vector.prototype.unit = function() {
      return this.scale(1 / this.magn());
    };

    return Vector;

  })();

  SelfVector = (function(_super) {

    __extends(SelfVector, _super);

    function SelfVector(self) {
      this.self = self;
    }

    SelfVector.prototype.add = function(other) {
      return this.self.load(this.self.add(other));
    };

    SelfVector.prototype.sub = function(other) {
      return this.self.load(this.self.sub(other));
    };

    SelfVector.prototype.scale = function(scalar) {
      return this.self.load(this.self.scale(scalar));
    };

    SelfVector.prototype.rotate = function(rad) {
      return this.self.load(this.self.rotate(rad));
    };

    return SelfVector;

  })(Vector);

  /*
   Cross Browser DOM
  */


  DOMNormalizer = (function() {

    function DOMNormalizer() {}

    DOMNormalizer.prototype.size = function(node) {
      var dims;
      dims = {
        width: node.scrollWidth,
        height: node.scrollHeight
      };
      if (node === document.body) {
        dims = {
          width: Math.max(dims.width, window.innerWidth),
          height: Math.max(dims.height, window.innerHeight)
        };
      }
      return dims;
    };

    return DOMNormalizer;

  })();

  DOMNorm = new DOMNormalizer();

  /*
   Puck Class
  */


  Puck = (function() {

    Puck.prototype.friction = 0.005;

    Puck.prototype.mousePos = new Vector();

    Puck.prototype.date = new Date();

    function Puck(domParent, pos, options) {
      var bounds, onss,
        _this = this;
      if (pos == null) {
        pos = {
          x: 0,
          y: 0
        };
      }
      if (options == null) {
        options = {};
      }
      this.pos = new Vector(pos);
      this.vel = new Vector();
      this.el = document.createElement('div');
      this.el.setAttribute('class', 'puck');
      if (options["class"]) {
        this.el.classList.add(options["class"]);
      }
      this.render();
      domParent.appendChild(this.el);
      this.dims = new Vector({
        x: this.el.scrollWidth,
        y: this.el.scrollHeight
      });
      bounds = DOMNorm.size(domParent);
      this.bounds = new Vector({
        x: bounds.width,
        y: bounds.height
      });
      this.bounds.self.sub(this.dims);
      this.el.addEventListener('mousedown', function(ev) {
        _this.grabbed = true;
        _this.vel.self.scale(0);
        return _this.el.classList.add('grabbed');
      });
      document.addEventListener('mouseup', function() {
        _this.grabbed = false;
        return _this.el.classList.remove('grabbed');
      });
      document.addEventListener('mousemove', function(ev) {
        return _this.mousePos.load({
          x: ev.pageX,
          y: ev.pageY
        });
      });
      if (document.onselectstart) {
        onss = document.onselectstart;
        document.onselectstart = function() {
          return onss() && !_this.grabbed;
        };
      } else {
        document.onselectstart = function() {
          return !_this.grabbed;
        };
      }
      this.moveListeners = [];
      this.grabbed = false;
      this.lastTime = new Date().getTime();
      this;

    }

    Puck.prototype.addMoveListener = function(moveListener) {
      return this.moveListeners.push(moveListener);
    };

    Puck.prototype.render = function() {
      this.el.style["top"] = this.pos.y + 'px';
      this.el.style["left"] = this.pos.x + 'px';
      return this;
    };

    Puck.prototype.timeDelta = function() {
      var deltaSecs, time;
      time = new Date().getTime();
      deltaSecs = (time - this.lastTime) / 1000;
      this.lastTime = time;
      return deltaSecs;
    };

    Puck.prototype.update = function() {
      var centerPos, ml, newPos, _i, _len, _ref;
      if (this.grabbed) {
        newPos = this.mousePos.sub(this.dims.scale(1 / 2));
        this.vel.load(newPos.sub(this.pos).scale(1 / this.timeDelta()));
        this.pos.load(newPos);
      } else {
        this.pos.self.add(this.vel.scale(this.timeDelta()));
        this.vel.self.scale(1 - this.friction);
      }
      if (this.pos.x <= 0) {
        this.vel.x = -this.vel.x;
        this.pos.x = 0;
      } else if (this.pos.x >= this.bounds.x) {
        this.vel.x = -this.vel.x;
        this.pos.x = this.bounds.x;
      }
      if (this.pos.y <= 0) {
        this.vel.y = -this.vel.y;
        this.pos.y = 0;
      } else if (this.pos.y >= this.bounds.y) {
        this.vel.y = -this.vel.y;
        this.pos.y = this.bounds.y;
      }
      centerPos = this.pos.add(this.dims.scale(1 / 2));
      _ref = this.moveListeners;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ml = _ref[_i];
        ml(centerPos);
      }
      return this;
    };

    return Puck;

  })();

  /*
   Puck Canvas Class
  */


  PuckCanvas = (function() {

    function PuckCanvas(domParent) {
      var bounds, cvs;
      cvs = document.createElement('canvas');
      cvs.setAttribute('class', 'puckcanvas');
      bounds = DOMNorm.size(domParent);
      cvs.setAttribute('width', bounds.width);
      cvs.setAttribute('height', bounds.height);
      domParent.appendChild(cvs);
      this.ctx = cvs.getContext('2d');
      this.ctx.strokeStyle = '#7a4e4e';
      this.ctx.lineWidth = 2;
    }

    PuckCanvas.prototype.drawTo = function(point) {
      if (!this.lastPoint) {
        this.lastPoint = point;
      }
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
      this.ctx.closePath();
      return this.lastPoint = point;
    };

    PuckCanvas.prototype.clearRect = function(rect) {
      return this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    };

    return PuckCanvas;

  })();

  /*
   Puck Paint Setup
  */


  intervalId = void 0;

  init = function(domParent) {
    var eraserPuck, painterPuck, puck, pucks, starter, _i, _len, _results;
    if (domParent == null) {
      domParent = document.body;
    }
    painterPuck = new Puck(domParent, {
      x: 20,
      y: 20
    });
    eraserPuck = new Puck(domParent, {
      x: 20,
      y: 60
    }, {
      "class": 'eraser'
    });
    pucks = [painterPuck, eraserPuck];
    if (intervalId) {
      stop();
    }
    starter = function() {
      var puck, _i, _len;
      for (_i = 0, _len = pucks.length; _i < _len; _i++) {
        puck = pucks[_i];
        puck.el.removeEventListener('mousedown', starter);
      }
      return start(pucks, domParent);
    };
    _results = [];
    for (_i = 0, _len = pucks.length; _i < _len; _i++) {
      puck = pucks[_i];
      _results.push(puck.el.addEventListener('mousedown', starter));
    }
    return _results;
  };

  start = function(pucks, domParent) {
    var canvas, eraserPuck, painterPuck;
    painterPuck = pucks[0];
    eraserPuck = pucks[1];
    canvas = new PuckCanvas(domParent);
    painterPuck.addMoveListener(function(pos) {
      return canvas.drawTo(pos);
    });
    eraserPuck.addMoveListener(function(pos) {
      var ep;
      ep = eraserPuck;
      return canvas.clearRect({
        x: ep.pos.x,
        y: ep.pos.y,
        width: ep.dims.x,
        height: ep.dims.y
      });
    });
    return intervalId = setInterval(step, 1000 / 60, pucks, canvas);
  };

  stop = function() {
    return clearInterval(intervalId);
  };

  step = function(pucks, canvas) {
    var puck, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = pucks.length; _i < _len; _i++) {
      puck = pucks[_i];
      _results.push(puck.update().render());
    }
    return _results;
  };

  this.PuckPaint = {
    init: init,
    stop: stop
  };

}).call(this);
