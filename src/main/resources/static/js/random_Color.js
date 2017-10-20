window.onload = function () {
    var aColors = [
        ['#3bd8dd', '#e8e383'],
        ['#2d8cc8', '#ebbea0'],
        ['#3352ae', '#ee9fbb'],
        ['#f4664d', '#f099eb']
    ];
    var examTitle = document.getElementsByClassName('examTitle');
    for (var i=0, len=examTitle.length; i<len; i++){
        examTitle.css({
            "background-color": "-webkit-linear-gradient(left, " + aColors[0][0] +   " , " + aColors[0][1] + ")"
        });
    }
};