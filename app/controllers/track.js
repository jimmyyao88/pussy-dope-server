var url = 'https://api.soundcloud.com'
var client_id= 'a0f84e7c2d612d845125fb5eebff5b37';
var request = require('request');
var requestify=require('requestify');

exports.pipeRawLink=function(req,res){
  var id = req.params.id;
  var streamUrl = url+'/tracks/' + id + '/stream?client_id=' + client_id;
  console.log('id',id);
  console.log('streamUrl',streamUrl);
  requestify
   .head(streamUrl)
   .then(function(response){
  },function(response){
    //var data=JSON.parse(response.headers);
    // res.status(303).send(response.headers.location);
    console.log('error');
    if(response.headers.location.indexOf('ec-media.sndcdn.com/')!=-1){
      request(response.headers.location).pipe(res);
    }else{
      res.redirect(response.headers.location);
    }
  });
}
