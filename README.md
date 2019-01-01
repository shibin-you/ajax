# ajax

Encapsulated the Ajax request of the native JS

## #

```javascript
var $=new Request()
// get or post
$.ajax({
  url:'...',
  type:'get',
  headers:headers,
  success:function(res){
    console.log(res)
  },
  error:function(err){
    console.log(err);
  }
})

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
