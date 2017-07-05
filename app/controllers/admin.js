/**
 * Created by jimmy on 9/2/15.
 */
var Post=require('../models/post');

exports.showAdmin=function(req,res){
        res.render('pages/admin',{
            title:'管理页面'
        })
};
exports.update=function(req,res){
    var _post=req.body.post;
    console.log(_post);
    if(_post.awesome){
        Post.findByIdAndUpdate(_post.awesome,{$set:{awesome:true}},function(err,post){

        })
    }else if(_post.top){
        Post.findByIdAndUpdate(_post.top,{$set:{top:true}},function(err,post){
            if(err){
                console.log(err)
            }else{
            }
        })
    }
    res.redirect('/');
};