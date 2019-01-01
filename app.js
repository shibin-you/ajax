const Koa = require('koa')
const app=new Koa()
const Router = require('koa-router')
var router = new Router()

router.get('/get', (ctx, next) => {
  // ctx.router available
   ctx.set('Access-Control-Allow-Origin','*')
  ctx.body=JSON.stringify({
    status:1,
    data:'get 请求成功'
  })
  next()
})
router.post('/post', (ctx, next) => {
   ctx.set('Access-Control-Allow-Origin','*')
  // ctx.router available
  ctx.body={
    status:1,
    data:'post 请求成功'
  }
  next()
})
router.get('/jsonp', (ctx, next) => {
  // ctx.router available

  ctx.body=`jsonp(${JSON.stringify({
    status:1,
    data:'jsonp请求成功'
  })})`
  next()
})
app
  .use(router.routes())
  .use(router.allowedMethods());



app.listen(3000)
