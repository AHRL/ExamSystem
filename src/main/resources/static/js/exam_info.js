(function() {
    var script = document.createElement('script');
    var __dirPath = '../static/js/';
    script.setAttribute('src', __dirPath + 'funLib.js');
    document.head.appendChild(script);
})();

window.onload = function() {
    var listItems = document.getElementsByClassName('list-group-item');
    var span = [];
    /*var listItems_content = $.ajax({
        type: 'POST',
        url: '',
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            console.lod(data);
        },
        error: function(jqXHR, textStatus, error) {
            console.log(0);
        }
    });
    for (var i = 0; i < 3; i++) {
        span[i] = listItems[i].getElementsByTagName('span');
        for (var j = 0; j < 4; j++) {
            span[i][j].innerHTML = listItems_content[i][j];
        }
    }*/

    var selection = document.getElementsByClassName('custom-select')[0];
    var search_btn = document.getElementsByClassName('btn')[0];
    EventUtil.addHandler(search_btn, 'click', function() {
        var val = selection.value;
        var jsonObj = $.ajax({
            type: 'get',
            url: '',
            dataType: 'json',
            data: {
                'option': val,
            },
            success: function(data) {
                console.log(data);
            },
            error: function() {
                console.log(0);
            }
        });
        jsonObj = [{
            "content": "C 语言",
            "time": "2017/12/15 19:00-21:00",
            "description": "2017级C语言第二次考试",
            "nums": "45",
        }, {
            "content": "C 语言",
            "time": "2017/12/03 15:00-17:00",
            "description": "2017级C语言第一次考试",
            "nums": "33",
        }];
    });
}