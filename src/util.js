export const stringify = function() {
  let dataArr = []
  for (var k in data) {
    if (typeof data[k] !== 'undefined') {
      dataArr.push(k + '=' + data[k])
    }
  }
  return dataArr.join('&')
}
export urlStringify = function(data) {
  let str=stringify(data)
  url = str ? (url + (url.indexOf('?') > -1 ? '&' : '?') + str.replace(/\?$/g, '') : url
}
