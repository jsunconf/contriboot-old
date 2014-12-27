(function() {
    "use strict";

    var requestAnimationFrame = window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(func, element) {
            setTimeout(func, 10);
        };
    }

    var BALL_SIZE = 20;
    var BALL_VELOCITY = 250; // px/second

    var PADDLE_WIDTH = 20;
    var PADDLE_HEIGHT = 100;
    var PADDLE_VELOCITY = 400; // px/second

    var KEYS = {
        UP: 38,
        DOWN: 40,
        A: 65,
        Z: 90
    };

    var pressedKeys = {};

    var boardHeight;
    var boardWidth;

    var lastUpdatedAt;

    function reduce(acc, arr, f) {
        for (var i = 0; i < arr.length; i++) {
            acc = f(acc, arr[i]);
        }
        return acc;
    };

    function map(arr, f) {
        return reduce([], arr, function(acc, e) {
            acc.push(f(e));
            return acc;
        });
    };

    function range(start, end) {
        var range = []
        for (var i = start; i < end; i++) {
            range.push(i);
        }
        return range;
    }

    function combinations(nums, order) {
        if (order === 0) {
            return [[]];
        } else if (order > nums.length) {
            return [];
        } else {
            var withFirst = map(combinations(nums.slice(1), order - 1), function(combo) {
                return [nums[0]].concat(combo);
            });
            var withoutFirst = combinations(nums.slice(1), order);
            return withFirst.concat(withoutFirst);
        }
    }

    function isBetweenInclusive(val, start, end) {
        return start <= val && val <= end;
    };

    function overlaps(o1, o2) {
        return (isBetweenInclusive(o1.x, o2.x, o2.x + o2.width) ||
                isBetweenInclusive(o1.x + o1.width, o2.x, o2.x + o2.width)) &&
               (isBetweenInclusive(o1.y, o2.y, o2.y + o2.height) ||
                isBetweenInclusive(o1.y + o1.height, o2.y, o2.y + o2.height));
    }

    function collide(scene) {
        var indexes = range(0, scene.length);

        var combos = combinations(indexes, 2);

        for (var i = 0; i < combos.length; i++) {
            var o1 = scene[combos[i][0]];
            var o2 = scene[combos[i][1]];

            if (overlaps(o1, o2)) {
                o1.collide(o2);
                o2.collide(o1);
            }
        }
    };

    function update(scene) {
        var now = Date.now();
        var deltaT = (now - lastUpdatedAt) / 1000;
        lastUpdatedAt = now;

        for (var i = 0; i < scene.length; i++) {
            scene[i].update(deltaT);
        }

        collide(scene);
    };

    function draw(ctx, scene) {
        ctx.clearRect(0, 0, boardWidth, boardHeight);

        for (var i = 0; i < scene.length; i++) {
            scene[i].draw(ctx);
        }
    };

    function Ball(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.width = BALL_SIZE;
        this.height = BALL_SIZE;
    };

    Ball.prototype.draw = function(ctx) {
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
    };

    Ball.prototype.update = function(deltaT) {
        this.x += this.vx * deltaT;
        this.y += this.vy * deltaT;

        this.ensureInsideBounds();
    };

    Ball.prototype.ensureInsideBounds = function() {
        if (this.x < 0) {
            this.x = 0;
            this.vx *= -1;
        } else if (this.x + this.width > boardWidth) {
            this.x = boardWidth - this.width;
            this.vx *= -1;
        }

        if (this.y < 0) {
            this.y = 0;
            this.vy *= -1;
        } else if (this.y + this.height > boardHeight) {
            this.y = boardHeight - this.height;
            this.vy *= -1;
        }
    };

    Ball.prototype.calculateIntersectionArea = function(other) {
        var a, b;
        if (this.x <= other.x) {
            a = this;
            b = other;
        } else {
            a = other;
            b = this;
        }

        var rect = {}
        rect.x = b.x;

        var topEdgeInside = isBetweenInclusive(a.y, b.y, b.y + b.height);
        var rightEdgeInside = isBetweenInclusive(a.x + a.width, b.x, b.x + b.width);
        var bottomEdgeInside = isBetweenInclusive(a.y + a.height, b.y, b.y + b.height);

        if (topEdgeInside) {
            rect.y = a.y;
        } else {
            rect.y = b.y;
        }

        if (rightEdgeInside) {
            rect.width = a.x + a.width - b.x;
        } else {
            rect.width = b.width;
        }

        if (rightEdgeInside && topEdgeInside && bottomEdgeInside) {
            rect.height = a.height;
        } else if (bottomEdgeInside) {
            rect.height = a.y + a.height - b.y;
        } else if (topEdgeInside) {
            rect.height = b.y + b.height - a.y;
        } else {
            rect.height = b.height;
        }

        return rect;
    }

    Ball.prototype.collide = function(other) {
        var inter = this.calculateIntersectionArea(other);
        if (inter.width > inter.height) {
            if (inter.y + inter.height >= other.y + other.height) {
                this.vy = BALL_VELOCITY;
            } else {
                this.vy = -1 * BALL_VELOCITY;
            }
            this.y += this.vy / Math.abs(this.vy) * inter.height;
        } else {
            if (inter.x > other.x && inter.x < other.x + other.width) {
                this.vx = BALL_VELOCITY;
            } else {
                this.vx = -1 * BALL_VELOCITY;
            }
            this.x += this.vx / Math.abs(this.vx) * inter.width;
        }

        this.ensureInsideBounds();
    };

    function Paddle(side) {
        this.width = PADDLE_WIDTH;
        this.height = PADDLE_HEIGHT;

        if (side === "left") {
            this.x = 0;
            this.upKey = KEYS.A;
            this.downKey = KEYS.Z;
        } else {
            this.x = boardWidth - this.width;
            this.upKey = KEYS.UP;
            this.downKey = KEYS.DOWN;
        }

        this.y = (boardHeight - this.height) / 2;

        this.vy = 0;
        this.vx = 0;
    };

    Paddle.prototype.draw = function(ctx) {
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), PADDLE_WIDTH, PADDLE_HEIGHT);
    };

    Paddle.prototype.update = function(deltaT) {
        this.vy = 0;

        if (pressedKeys[this.upKey]) {
            this.vy -= PADDLE_VELOCITY;
        }

        if (pressedKeys[this.downKey]) {
            this.vy += PADDLE_VELOCITY;
        }

        this.y += this.vy * deltaT;

        if (this.y < 0) {
            this.y = 0;
        }

        if (this.y + this.height > boardHeight) {
            this.y = boardHeight - this.height;
        }
    };

    Paddle.prototype.collide = function(ball) {
        // if the ball is against the wall, the paddle should not be forced to
        // stop moving. It might be nicer if the wall was just another
        // collidable, but fixed entity.
        if (ball.y <= 0 && this.y < ball.height) {
            this.y = ball.height;
        } else if (ball.y + ball.height >= boardHeight && this.y + this.height > ball.y) {
            this.y = boardHeight - ball.height - this.height;
        }
    };

    window.addEventListener("load", function() {
        var canvas = document.getElementById("c");
        var ctx = canvas.getContext("2d");

        boardHeight = canvas.height;
        boardWidth = canvas.width;

        var leftPaddle = new Paddle("left", PADDLE_VELOCITY);
        var rightPaddle = new Paddle("right", PADDLE_VELOCITY);

        var ball;
        if (Math.random() > 0.5) {
            ball = new Ball(leftPaddle.width, Math.random() * (boardHeight - BALL_SIZE), BALL_VELOCITY, BALL_VELOCITY);
        } else {
            ball = new Ball(boardWidth - 2 * rightPaddle.width - 1, Math.random() * (boardHeight - BALL_SIZE), -1 * BALL_VELOCITY, BALL_VELOCITY);
        }

        var scene = [ball, leftPaddle, rightPaddle];

        window.addEventListener("keydown", function(e) {
            pressedKeys[e.keyCode] = true;
        });

        window.addEventListener("keyup", function(e) {
            delete pressedKeys[e.keyCode];
        });

        lastUpdatedAt = Date.now();
        function gameLoop() {
            update(scene);
            draw(ctx, scene);
            requestAnimationFrame(gameLoop, canvas);
        };
        requestAnimationFrame(gameLoop, canvas);
    });
}());
