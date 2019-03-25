var __jpid = 0

class Request {
  get(url, params) {
    return new Promise((resolve, reject) => {
      this._formatRequest(url, 'GET', params, resolve)
    })
  }
  post(url, params) {
    return new Promise((resolve, reject) => {
      this._formatRequest(url, 'POST', params, resolve)
    })
  }
  _formatRequest(url, type, data, resolve) {
    this.ajax({
      url: url,
      type: type,
      data: data
    }).then(res => {
      resolve(res)
    })
  }
  ajax(opt) {
    return new Promise((resolve, reject) => {
      var xhr = XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject
      var type = opt.type.toUpperCase(),
        data = opt.data,
        url = opt.url,
        dataArr = []
      for (var k in data) {
        if (typeof data[k] !== 'undefined') {
          dataArr.push(k + '=' + data[k])
        }
      }
      if (type === 'GET') {
        url = dataArr.length ? (url + (url.indexOf('?') > -1 ? '&' : '?') + dataArr.join('&')).replace(/\?$/g, '') : url
        xhr.open(type, url, true)
        for (var k in opt.headers) {
          xhr.setRequestHeader(k, opt.headers)
        }
        xhr.send()
      } else if (type === 'POST') {
        xhr.open(type, url, true)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        for (var k in opt.headers) {
          xhr.setRequestHeader(k, opt.headers)
        }
        xhr.send(dataArr.join('&'))
      } else if (type === 'JSONP') {
        this.jsonp(opt, reject, resolve)
      }
      xhr.onload = function() {
        var res = JSON.parse(xhr.responseText)
        if (xhr.status === 200 || xhr.status === 304) {
          resolve(res)
          if (opt.success && opt.success instanceof Function) {
            opt.success.call(xhr, res)
          }
        } else {
          reject(res)
          if (opt.error && opt.error instanceof Function) {
            opt.error.call(xhr, res)

          }
        }
      }
    })

  }
  jsonp(opt) {
    return new Promise((resolve, reject) => {
      // var callbackName = opt.jsonp;
      var callbackName = opt.jsonp || ((opt.data && opt.data.callback) ? opt.data.callback : '_jp' + __jpid++)
      opt.data.callback = callbackName
      var head = document.getElementsByTagName('head')[0]
      var data = formatParams(opt.data);
      var script = document.createElement('script')
      head.appendChild(script)
      window[callbackName] = function(json) {
        head.removeChild(script);
        clearTimeout(script.timer);
        window[callbackName] = null;
        resolve(json)
        if (opt.success && opt.success instanceof Function) {
          opt.success.call(window, json)
        }
      }
      script.src = opt.url + '?' + data
      if (opt.time) {
        script.timer = setTimeout(function() {
          window[callbackName] = null;
          head.removeChild(script);
          reject({
            message: '超时'
          })
          opt.error && opt.error({
            message: '超时'
          });
        }, time)
      }
    })
  }
}

function formatParams(data) {
  var arr = [];
  for (var name in data) {
    arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  };
  // 添加一个随机数，防止缓存
  arr.push('v=' + random());
  return arr.join('&');
}
// 获取随机数
function random() {
  return Math.floor(Math.random() * 10000 + 500);
}
// export default Request
