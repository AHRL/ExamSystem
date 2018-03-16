window.onload = function() {
    pageFinished();
};

function pageFinished() {
    var examEntry = document.getElementById('exam-entry');
}

function initRenderPage() {
    $.ajax({
        type: 'GET',
        url: '',
        dataType: 'json',
        success: function(data) {
            if (!data || parseInt(data) !== 1) {
                examEntry.style.display = 'none';
            }
        },
        error: function(err) {
            console.log('error ' + err.code);
        }
    })
}