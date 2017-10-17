(function (e, c, a, g) {
    var d = "gradientify", f = {angle: "0deg", fps: 60, gradients: {}, transition_time: 8};

    function b(i, h) {
        this.element = i;
        this.settings = e.extend({}, f, h);
        this._defaults = f;
        this._name = d;
        this.init()
    }

    e.extend(b.prototype, {
        init: function () {
            if (!Modernizr.cssgradients) {
                return
            }
            this.currentIndex = 0;
            this.nextIndex = 1;
            this.steps_count = 0;
            this.steps_total = Math.round(this.settings.transition_time * this.settings.fps);
            this.rgb_steps = {start: [0, 0, 0], stop: [0, 0, 0]};
            this.rgb_values = {start: [0, 0, 0], stop: [0, 0, 0]};
            this.prefixes = ["-webkit-", "-moz-", "-o-", "-ms-", ""];
            this.color1 = null;
            this.color2 = null;
            this.calculateSteps();
            setInterval(function () {
                this.updateGradient.apply(this)
            }.bind(this), Math.round(1000 / this.settings.fps))
        }, setNext: function (h) {
            return (h + 1 < this.settings.gradients.length) ? h + 1 : 0
        }, calculateStepSize: function (i, h) {
            return (i - h) / this.steps_total
        }, calculateSteps: function () {
            for (var j in this.rgb_values) {
                if (this.rgb_values.hasOwnProperty(j)) {
                    for (var h = 0; h < 3; h++) {
                        this.rgb_values[j][h] = this.settings.gradients[this.currentIndex][j][h];
                        this.rgb_steps[j][h] = this.calculateStepSize(this.settings.gradients[this.nextIndex][j][h], this.rgb_values[j][h])
                    }
                }
            }
        }, updateGradient: function () {
            var k;
            for (var j in this.rgb_values) {
                if (this.rgb_values.hasOwnProperty(j)) {
                    for (k = 0; k < 3; k++) {
                        this.rgb_values[j][k] += this.rgb_steps[j][k]
                    }
                }
            }
            var l = "rgb(" + (this.rgb_values.start[0] | 0) + "," + (this.rgb_values.start[1] | 0) + "," + (this.rgb_values.start[2] | 0) + ")";
            var h = "rgb(" + (this.rgb_values.stop[0] | 0) + "," + (this.rgb_values.stop[1] | 0) + "," + (this.rgb_values.stop[2] | 0) + ")";
            if (l != this.color1 || h != this.color2) {
                this.color1 = l;
                this.color2 = h;
                e(this.element).css("background-image", "-webkit-gradient(linear, left bottom, right top, from(" + this.color1 + "), to(" + this.color2 + "))");
                for (k = 0; k < 4; k++) {
                    e(this.element).css("background-image", this.prefixes[k] + "linear-gradient(" + this.settings.angle + ", " + this.color1 + ", " + this.color2 + ")")
                }
            }
            this.steps_count++;
            if (this.steps_count > this.steps_total) {
                this.steps_count = 0;
                this.currentIndex = this.setNext(this.currentIndex);
                this.nextIndex = this.setNext(this.nextIndex);
                this.calculateSteps()
            }
        }
    });
    e.fn[d] = function (h) {
        return this.each(function () {
            if (!e.data(this, "plugin_" + d)) {
                e.data(this, "plugin_" + d, new b(this, h))
            }
        })
    }
})(jQuery, window, document);