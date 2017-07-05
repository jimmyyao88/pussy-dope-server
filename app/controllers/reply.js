/**
 * Created by jimmy on 8/5/15.
 */

var User=require('../models/user');
var Reply=require('../models/reply');
var Post=require('../models/post');
exports.save=function(req,res){
    var reply=req.body.reply;
    console.log(reply);
    if(!reply.replyTo){
        delete reply.replyTo;
    }
    Reply.count({post:reply.post},function(err,total){
            reply.floor = total + 1;
            var _reply=new Reply(reply);
            _reply.save(function(err,reply){
                    User.findByIdAndUpdate(reply.user,{$addToSet:{replys:reply._id},$inc:{replycount:1}},function(err,user){
                            Post.findByIdAndUpdate(reply.post,{$set:{'meta.updateAt':Date.now()},$set:{'replylast':reply.user},$inc:{replynum:1}},function(err,post){
                                res.send({status:1})
                            })
                    })
            })
    })
};