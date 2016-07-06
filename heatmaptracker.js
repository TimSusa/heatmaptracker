(function snippet (w, d) {
    'use strict';

    var intervalFunc;
    var objToSend = {}; // The object to send
    var isAllowedToSend = true;

    addLoadEvent(init);

    function init () {
      var body = document.getElementsByTagName('body')[0];
      addEvent(body, 'mousemove', trackCoord);
      intervalFunc = setInterval(sendEvent, 100);
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

    function sendEvent () {
      var url = 'https://api.realtimeheatmap.com';
      var token = w.token;
      var collectionUrl = [url, '1', 'channels', 'heatmapchannel1' ].join('/');
      var xhttp;
      if (w.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
      } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }

      xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status !== 201) {
          console.log('Error when sending data...', xhttp.responseText, ' ', xhttp.status);
          isAllowedToSend = false;
        }
      };

      // true for its third parameter to indicate that the request should be handled asynchronously
      xhttp.open("POST", collectionUrl, true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.setRequestHeader("X-AUTH-TOKEN", token);
      xhttp.setRequestHeader("Accept", "application/json");

      var jsonBlob = JSON.stringify(objToSend);
      if ((Object.keys(objToSend).length !== 0) && isAllowedToSend) {
        xhttp.send(jsonBlob);
      }
    }

    function trackCoord (blob) {
      var maxX = d.body.clientWidth;
      var maxY = d.body.clientHeight;
      objToSend = {
        view: separateViewFromUrl(),
        x: blob.pageX,
        y: blob.pageY,
        xMax: maxX,
        yMax: maxY,
        timestamp: new Date().getTime(),
        userId: w.userId
      };

      if (w.isDebug) {
        console.log('view: ', objToSend.view);
        console.log('x: ', objToSend.x);
        console.log('y: ', objToSend.y);
        console.log('xMax: ', objToSend.xMax);
        console.log('yMax: ', objToSend.yMax);
        console.log('userId: ', objToSend.userId);
      }
    }

    function separateViewFromUrl () {
      var a = d.createElement('a');
      a.href = w.location.href;
      return a.pathname;
    }
  })(window, document);
