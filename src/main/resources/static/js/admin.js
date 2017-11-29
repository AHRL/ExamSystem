(function () {
    var script = document.createElement('script');
    var __dirPath = '../static/js/';
    script.setAttribute('src', __dirPath + 'funLib.js');
    document.head.appendChild(script);
})();
window.onload = function () {
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
    var listItems = document.getElementsByClassName('list-group-item');
    var len = listItems.length;
    var oH1 = document.getElementsByTagName('h1')[0];
    for(var i=0; i<len; i++){
        (function (i) {
            EventUtil.addHandler(listItems[i], 'click', function () {
                for (var j=0; j<len; j++){
                    if (hasClass(listItems[j], 'active')){
                        removeClass(listItems[j], 'active');
                    }
                }
                if (!hasClass(listItems[i], 'active')) {
                    addClass(listItems[i], 'active');
                    oH1.innerHTML = this.innerHTML;
                }
                var xhr = createXHR();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4){
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
                            console.log(JSON.parse(xhr.responseText));
                        } else {
                            console.log('Request was unsuccessful: ' + xhr.status);
                        }
                    }
                };
                xhr.open('get', 'http://localhost:8080/registered', true);
                xhr.send(null);
                ajax({
                    url: 'http://localhost:8080/registered',
                    type: 'get',
                    data: {
                        page: 'page'
                    },
                    dataType: 'json',
                    success: function (response, xml) {
                        console.log(JSON.parse(response));
                    },
                    error: function (status) {
                        console.log('error');
                    }
                })
            });
        })(i);
    }
};