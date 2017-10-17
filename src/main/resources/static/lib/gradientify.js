/**
 * jQuery Gradientify plugin 1.0.0
 *
 * Provides animating CSS gradients.
 * Based on http://opticalcortex.com/animating-css-gradients/ by Mike Byrne.
 *
 * @author  Codefog <http://codefog.pl>
 * @author  Kamil Kuzminski <kamil.kuzminski@codefog.pl>
 * @license MIT License
 * @see     http://opticalcortex.com/animating-css-gradients/
 */
(function ($, window, document, undefined) {

    'use strict';

    // Create the defaults once
    var pluginName = 'gradientify',
        defaults = {
            angle: '0deg', // Gradient angle
            fps: 60, // Frames per second
            gradients: {}, // Gradients
            transition_time: 8 // Transition time
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            // Return if the browser does not support CSS gradients
            if (!Modernizr.cssgradients) {
                return;
            }

            // Where we are in the gradients array
            this.currentIndex = 0;

            // What index of the gradients array is next
            this.nextIndex = 1;

            // Steps counter
            this.steps_count = 0;

            // Total amount of steps
            this.steps_total = Math.round(this.settings.transition_time * this.settings.fps);

            // How much to alter each rgb value
            this.rgb_steps = {
                start: [0, 0, 0],
                stop: [0, 0, 0]
            };

            // The current rgb values, gets altered by rgb steps on each interval
            this.rgb_values = {
                start: [0, 0, 0],
                stop: [0, 0, 0]
            };

            // For looping through adding styles
            this.prefixes = ['-webkit-', '-moz-', '-o-', '-ms-', ''];

            // Color helpers
            this.color1 = null;
            this.color2 = null;

            // Initial step calculation
            this.calculateSteps();

            // Launch the timer
            setInterval(function() {
                this.updateGradient.apply(this);
            }.bind(this), Math.round(1000 / this.settings.fps));
        },

        /**
         * Set next current and next index of gradients array
         *
         * @param {int} num
         *
         * @returns {int}
         */
        setNext: function (num) {
            return (num + 1 < this.settings.gradients.length) ? num + 1 : 0;
        },

        /**
         * Work out how big each rgb step is
         *
         * @param {int} a
         * @param {int} b
         *
         * @return {int}
         */
        calculateStepSize: function (a, b) {
            return (a - b) / this.steps_total;
        },

        /**
         * Populate the rgb_values and rgb_steps objects
         */
        calculateSteps: function () {
            for (var key in this.rgb_values) {
                if (this.rgb_values.hasOwnProperty(key)) {
                    for (var i = 0; i < 3; i++) {
                        this.rgb_values[key][i] = this.settings.gradients[this.currentIndex][key][i];
                        this.rgb_steps[key][i] = this.calculateStepSize(this.settings.gradients[this.nextIndex][key][i], this.rgb_values[key][i]);
                    }
                }
            }
        },

        /**
         * Update current RGB values, update DOM element with new CSS background
         */
        updateGradient: function () {
            var i;

            // Update the current RGB values
            for (var key in this.rgb_values) {
                if (this.rgb_values.hasOwnProperty(key)) {
                    for (i = 0; i < 3; i++) {
                        this.rgb_values[key][i] += this.rgb_steps[key][i];
                    }
                }
            }

            // Generate CSS RGB values
            var t_color1 = 'rgb(' + (this.rgb_values.start[0] | 0) + ',' + (this.rgb_values.start[1] | 0) + ',' + (this.rgb_values.start[2] | 0) + ')';
            var t_color2 = 'rgb(' + (this.rgb_values.stop[0] | 0) + ',' + (this.rgb_values.stop[1] | 0) + ',' + (this.rgb_values.stop[2] | 0) + ')';

            // Has anything changed on this iteration?
            if (t_color1 !== this.color1 || t_color2 !== this.color2) {

                // Update cols strings
                this.color1 = t_color1;
                this.color2 = t_color2;

                // Update DOM element style attribute
                $(this.element).css('background-image', '-webkit-gradient(linear, left bottom, right top, from(' + this.color1 + '), to(' + this.color2 + '))');

                for (i = 0; i < 4; i++) {
                    $(this.element).css('background-image', this.prefixes[i] + 'linear-gradient(' + this.settings.angle + ', ' + this.color1 + ', ' + this.color2 + ')');
                }
            }

            // We did another step
            this.steps_count++;

            // Did we do too many steps?
            if (this.steps_count > this.steps_total) {
                // Reset steps count
                this.steps_count = 0;

                // Set new indexes
                this.currentIndex = this.setNext(this.currentIndex);
                this.nextIndex = this.setNext(this.nextIndex);

                // Calculate steps
                this.calculateSteps();
            }
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);