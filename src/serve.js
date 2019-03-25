import https from 'https'
import http from 'http'
import qs from 'querystring'


const getReqType = url => {
  return url.startsWith('https://') ? https : http
}


export const getReq = (url, params, options = {}) => (new Promise((resolve, reject) => {
  let request = getReqType(url)
  let keys = Object.keys(params)
  url = keys.length ? (url + (url.indexOf('?') > -1 ? '&' : '?') + qs.stringify(params).replace(/\?$/g, '')) : url
  request.get(url, options, res => {
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

export const postReq = (url, body, options = {}) => (new Promise((resolve, reject) => {
  let request = getReqType(url)
  let content = qs.stringify(body)
  options.headers = options.headers ? options.headers['content-type'] ? options.headers : {
    ...options.headers,
    'content-type': 'application/x-www-form-urlencoded'
  } : {
    'content-type': 'application/x-www-form-urlencoded'
  }
  options.headers['Content-Length'] = Buffer.byteLength(content, 'utf8')

  let req = request.request(url, {
    ...options,
    method: 'POST',
  }, res => {
    res.setEncoding('utf8');
    var data = ''
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      resolve(data)
    })
  }).on('error', err => {
    reject(err)
  })
  req.write(qs.stringify(body))
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
