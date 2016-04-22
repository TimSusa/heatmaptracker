(function snippet(w, d) {
    'use strict';

    //
    // VARIABLES
    //
    var intervalFunc;
    var objToSend = {}; // The object to send

    //
    // START
    //
    addLoadEvent(init);

    //
    // FUNCTION IMPLEMENTATIONS
    //
    function init () {
      var body = document.getElementsByTagName('body')[0];
      addEvent(body, 'mousemove', trackCoord);
      intervalFunc = setInterval(sendEvent, 1000);
    }

    function sendEvent () {

      var url = 'https://data-f539adb0-d76a-4c53-845a-58e61308c79a.lambdanow.com';
      var token = 'ef15682f3c';
      var collectionUrl = [url, '1', 'channels', 'heatmapchannel9' ].join('/');
      // var headers = { 'X-AUTH-TOKEN': token };

      var xhttp;
      if (w.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
      } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }

      xhttp.open("POST", collectionUrl, true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.setRequestHeader("X-AUTH-TOKEN", token);

      var jsonBlob = JSON.stringify(objToSend);
      if (Object.keys(objToSend).length !== 0) {
        console.log("send event with blob: ", objToSend);
        xhttp.send(jsonBlob);
      }
    }

    // Will be called on each new mousevent
    function trackCoord (blob) {
      var maxX = d.body.clientWidth;
      var maxY = d.body.clientHeight;
      objToSend = {
        view: separateViewFromUrl(),
        x: blob.pageX,
        y: blob.pageY,
        xMax: maxX,
        yMax: maxY,
        timestamp: new Date().getTime()
      };
      // console.log( objToSend );
    }

    function addEvent (elm, evType, fn, useCapture) {
      if (elm.addEventListener) {
        elm.addEventListener(evType, fn, useCapture);
        return true;
      } else if (elm.attachEvent) {
        var r = elm.attachEvent('on' + evType, fn);
        return r;
      } else {
        elm['on' + evType] = fn;
      }
    }

    function addLoadEvent (func) {
      var oldonload = w.onload;
      if (typeof w.onload !== 'function') {
        w.onload = func;
      } else {
        w.onload = function() {
          oldonload();
          func();
        };
      }
    }

    function separateViewFromUrl () {
      // Extract view from url
      var a = d.createElement('a');
      a.href = w.location.href;
      // 'https://www.example.com:123/foo/bar.html?fox=trot#foo';
      // ['href', 'protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash'].forEach(function(k) {
      // console.log(k + ':', a[k]);
      // });
      return a.pathname;
    }
  })(window, document);
