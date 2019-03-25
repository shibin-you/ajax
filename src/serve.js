import https from 'https'
import * as qs from 'querystring'

/**
nodejs网络请求
*/
export const getReq = (url, params, ) => (new Promise((resolve, reject) => {
  let dataArr = []
  for (var k in params) {
    if (typeof params[k] !== 'undefined') {
      let key = params[k]
      if (typeof params[k] === 'object') {
        key = JSON.stringify(params[k])
      }
      dataArr.push(k + '=' + key)
    }
  }
  url = dataArr.length ? (url + (url.indexOf('?') > -1 ? '&' : '?') + dataArr.join('&')).replace(/\?$/g, '') : url
  https.get(url, {
    headers: headers
  }, res => {
    var data = ''
    res.on('data', (chunk) => {
      data += chunk;
    })
    res.on('end', () => {
      resolve(data)
    })
  }).on('error', err => {
    reject(err)
  })
}))

export const postReq = (url, body) => (new Promise((resolve, reject) => {
  let req = https.request(url, {
    headers
  }, res => {
    res.setEncoding('utf8');
    var data = ''
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      console.log(data);
    })
  }).on('error', err => {
    reject(err)
  })
  req.write(qs.stringify(content))
  req.end()
}))

export const jsonp = async (url, params) => {
  let callback = '_cb'
  if (params.callback) {
    callback = params.callback
  }
  let res
  const data = await getReq(url, { ...params,
    callback
  })
  eval(`function ${callback}(data){res=data}   ` + data)
  return res
}



export default {
  get: getReq,
  post: postReq,
  jsonp
}
