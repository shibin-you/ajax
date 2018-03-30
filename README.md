# ajax

Encapsulated the Ajax request of the native JS

## #

```javascript
var $=new Request()
// get或post请求
$.ajax({
  url:'...',
  type:'get',
  success:function(res){
    console.log(res)
  },
  error:function(err){
    console.log(err);
  }
})

// get或post请求
$.ajax({
  url:'...',
  type:'get'
}).then(data=>{
  console.log(data)
})
//jsonp
$.ajax({
  url:'...'
  type:'jsonp',
  jsonp:'jsonp',
  data:{
  ...
  },
  success:function(data){
    console.log(data)
  }
})
```
