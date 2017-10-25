function createXHR() {
    if (typeof XMLHttpRequest !== 'undefined'){
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject !== 'undefined'){
        var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'],
            i, len;
        for (i = 0, len=versions.length; i<len; i++){
            try {
                new ActiveXObject(versions[i]);
                arguments.callee.activeXString = versions[i];
                break;
            } catch (ex){

            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error('No XHR object available');
    }
}

function ajax(options) {
    options = options || {};
    options.type = (options.type || 'GET').toUpperCase();
    options.dataType = options.dataType || 'json';
   /* var params = formatParams(options.data);*/
    var xhr = createXHR();
    if (options.type === 'GET'){
        xhr.open('GET', options.url/* + '?' + params*/, true);
        xhr.send(null);
    } else if (options.type === 'POST'){
        xhr.open('POST', options.url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(null);
    }
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4){
            if ((xhr.status >= 200 && xhr.status <300) || xhr.status === 304){
                options.success && options.success(xhr.responseText, xhr.responseXML);
            } else {
                options.error && options.error(xhr.status);
            }
        }
    }
}

/*
function formatParams(data) {
    var arr = [];
    for (var name in data){
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    arr.push(('v=' + Math.random()).replace('.', ''));
    console.log(arr);
    return arr.join('&');
}*/
