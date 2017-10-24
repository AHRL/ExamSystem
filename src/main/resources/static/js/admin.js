window.onload = function () {

    /*(function () {
        var width = 400;
        var height = 225;
        var dataSet = [551, 423, 109, 228, 449, 512, 1033];

        var svg = d3.select('.data_target').append('svg')
            .attr('width', width)
            .attr('height', height);

        // x 坐标轴
        var xAxisScale = d3.scale.ordinal()
            .domain(d3.range(dataSet.length))
            .rangeRoundBands([0, 320]);

        // y 坐标轴
        var yAxisScale = d3.scale.linear()
            .domain([0, d3.max(dataSet)])
            .range([180, 0]);

        var xAxis = d3.svg.axis()
            .scale(xAxisScale)
            .orient('bottom');

        var yAxis = d3.svg.axis()
            .scale(yAxisScale)
            .orient('left');

        var xScale = d3.scale.ordinal()
            .domain(d3.range(dataSet.length))
            .rangeRoundBands([0, 400], 0.05);

        var yScale = d3.scale.linear()
            .domain([0, d3.max(dataSet)])
            .range([0, 225]);

        svg.selectAll('rect')
            .data(dataSet)
            .enter()
            .append('rect')
            .attr('x', function (d, i) {
                return 30 + xScale(i);
            })
            .attr('y', function (d, i) {
                return 22.5 + 225 - yScale(i);
            })
            .attr('width', function (d, i) {
                return xScale.rangeBand();
            })
            .attr('height', yScale)
            .attr('fill', 'red');

        svg.selectAll('text')
            .data(dataSet)
            .enter()
            .append('text')
            .attr('x', function (d, i) {
                return 30 + xScale(i);
            })
            .attr('y', function (d, i) {
                return 22.5 + 225 - yScale(d);
            })
            .attr('dx', function (d, i) {
                return xScale.rangeBand()/3;
            })
            .attr('dy',15)
            .attr('text-anchor', 'egin')
            .attr('font-size', 12)
            .attr('fill', 'white')
            .text(function (d, i) {
                return d;
            });

        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(50, 200)')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(50, 20)')
            .call(yAxis);
    })();*/

    (function () {
        Highcharts.chart('h-container', {

            title: {
                text: 'Fun Exam 最近7天统计数据'
            },

            subtitle: {
                text: '来源：swpuiot.com'
            },

            xAxis: {
                title: {
                    text: '时间轴'
                }
            },

            yAxis: {
                title: {
                    text: '人次'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 16
                }
            },

            series: [{
                name: '访问次数',
                data: [225, 177, 156, 149, 220, 277, 290]
            }, {
                name: '注册人数',
                data: [45, 70, 91, 98, 107, 115, 144]
            }, {
                name: '在线人数',
                data: [11, 17, 15, 23, 29, 33, 41]
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }

        });
    })();

    (function () {
        var listItems = document.getElementsByClassName('list-group-item');
        var len = listItems.length;
        for(var i=0; i<len; i++){
            (function (i) {
                var curActive = (function (i) {
                    if (hasClass(listItems[i], 'active')){
                        return i;
                    }
                })(i);
                EventUtil.addHandler(listItems[i], 'click', function () {
                    if (!hasClass(listItems[i], 'active')) {
                        addClass(listItems[i], 'active');
                        if (curActive){
                            removeClass(listItems[curActive], 'active');
                        }
                    }
                });
            })(i);

        }
    })();


};

// create Object EventUtil
var EventUtil = {
    addHandler: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent('on' + type, handler);
        } else {
            element['on'+type] = handler;
        }
    },
    removeHandler: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if(element.detachEvent){
            element.detachEvent('on' + type, handler);
        } else {
            element['on'+type] = null;
        }
    },
    getEvent: function(event){
        return event ? event : window.event;
    },
    getTarget: function(event){
        return event.target || event.srcElement;
    },
    preventDefault: function(event){
        if(event.preventDefault){
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};

// create Function getClass(), addClass(), removeClass(), hasClass()
// Function removeClass() based Professional JavaScript for Web Developers 3rd Edition
function getClass(obj) {
    return obj.className.split(/\s+/);
}
function addClass(obj, newCls) {
    var aCls = getClass(obj);
    if (Array.isArray(aCls)){
        aCls.push(newCls);
        obj.className = aCls.join(' ');
    }
}
function removeClass(obj, targetCls) {
    var aCls = getClass(obj);
    if (Array.isArray(aCls)){
        if (aCls.length){
            var len = aCls.length;
            var pos = -1;
            for (var i=0; i<len; i++){
                if (aCls[i] === targetCls){
                    pos = i;
                    break;
                }
            }
            aCls.splice(i, 1);
            obj.className = aCls.join(' ');
        }
    }
}
function hasClass(obj, targetCls) {
    var aCls = getClass(obj);
    if (Array.isArray(aCls)){
        var len = aCls.length;
        for (var i=0; i<len; i++){
            if (aCls[i] === targetCls){
                return true;
            }
        }
        return false;
    }
}