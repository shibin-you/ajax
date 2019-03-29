'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});

var __jpid = 0;

var Request =
/*#__PURE__*/
function () {
  function Request() {
    _classCallCheck(this, Request);
  }

  _createClass(Request, [{
    key: "get",
    value: function get(url, params) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this._formatRequest(url, 'GET', params, resolve);
      });
    }
  }, {
    key: "post",
    value: function post(url, params) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2._formatRequest(url, 'POST', params, resolve);
      });
    }
  }, {
    key: "_formatRequest",
    value: function _formatRequest(url, type, data, resolve) {
      this.ajax({
        url: url,
        type: type,
        data: data
      }).then(function (res) {
        resolve(res);
      });
    }
  }, {
    key: "ajax",
    value: function ajax(opt) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
        var type = opt.type.toUpperCase();
        var data = opt.data;
        var url = opt.url;
        dataArr = [];

        for (var k in data) {
          if (typeof data[k] !== 'undefined') {
            dataArr.push(k + '=' + data[k]);
          }
        }

        if (type === 'GET') {
          url = dataArr.length ? (url + (url.indexOf('?') > -1 ? '&' : '?') + dataArr.join('&')).replace(/\?$/g, '') : url;
          xhr.open(type, url, true);

          for (var k in opt.headers) {
            xhr.setRequestHeader(k, opt.headers);
          }

          xhr.send();
        } else if (type === 'POST') {
          xhr.open(type, url, true);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

          for (var k in opt.headers) {
            xhr.setRequestHeader(k, opt.headers);
          }

          xhr.send(dataArr.join('&'));
        } else if (type === 'JSONP') {
          _this3.jsonp(opt, reject, resolve);
        }

        xhr.onload = function () {
          var res = JSON.parse(xhr.responseText);

          if (xhr.status === 200 || xhr.status === 304) {
            resolve(res);

            if (opt.success && opt.success instanceof Function) {
              opt.success.call(xhr, res);
            }
          } else {
            reject(res);

            if (opt.error && opt.error instanceof Function) {
              opt.error.call(xhr, res);
            }
          }
        };
      });
    }
  }, {
    key: "jsonp",
    value: function jsonp(opt) {
      return new Promise(function (resolve, reject) {
        // var callbackName = opt.jsonp;
        var callbackName = opt.jsonp || (opt.data && opt.data.callback ? opt.data.callback : '_jp' + __jpid++);
        opt.data.callback = callbackName;
        var head = document.getElementsByTagName('head')[0];
        var data = formatParams(opt.data);
        var script = document.createElement('script');
        head.appendChild(script);

        window[callbackName] = function (json) {
          head.removeChild(script);
          clearTimeout(script.timer);
          window[callbackName] = null;
          resolve(json);

          if (opt.success && opt.success instanceof Function) {
            opt.success.call(window, json);
          }
        };

        script.src = opt.url + '?' + data;

        if (opt.time) {
          script.timer = setTimeout(function () {
            window[callbackName] = null;
            head.removeChild(script);
            reject({
              message: '超时'
            });
            opt.error && opt.error({
              message: '超时'
            });
          }, time);
        }
      });
    }
  }]);

  return Request;
}();

function formatParams(data) {
  var arr = [];

  for (var name in data) {
    arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  }

  arr.push('v=' + random());
  return arr.join('&');
} // 获取随机数


function random() {
  return Math.floor(Math.random() * 100000);
}

module.exports = Request;
