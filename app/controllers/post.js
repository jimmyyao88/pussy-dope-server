/**
 * Created by jimmy on 6/17/15.
 */
var Post=require('../models/post');
var User=require('../models/user');
var path=require('path');
var Category=require('../models/category');
var Reply=require('../models/reply');
var fs=require('fs');
exports.showDetail=function(req,res){
        var _id=req.params.id;
        console.log(_id);
        Post.update({_id:_id},{$inc:{pv:1}},function(err){
            if(err){
                console.log(err);
            }else{
                Post.findOne({_id:_id}).populate('user').exec(function(err,post){
                        console.log(post);
                        Reply.find({post:_id}).populate('user').sort({'meta.updateAt':1}).limit(40).exec(function(err,replys){
                            Post.find({}).sort({'top':-1}).limit(10).populate('user').exec(function(err,hotRecommend){
                                if(err){
                                    console.log(err)
                                }else{
                                    res.render('pages/detail',{
                                        title:post.title+' cberry',
                                        post:post,
                                        replys:replys,
                                        hotRecommend:hotRecommend
                                    })
                                }
                            })
                            })
                    })
            }
        });
};

exports.showPoster=function(req,res){
    Category.find({}).exec(function(err,categories){
        res.render('pages/poster',{
            title:'cberry 发帖',
            categories:categories
        })
    })
};

exports.save=function(req,res){
    var post=req.body.post;
    var _post=new Post(post);
    _post.save(function(err,post){
        if(err){
            console.log(err);
        }
        User.findById(req.session.user._id,function(err,user){
            if(err){
                console.log(err)
            }else{
                user.posts.addToSet(post._id);
                User.findByIdAndUpdate(req.session.user._id,{$set:{posts:user.posts},$inc:{postcount:1}},function(err,user){
                    if(err){
                        console.log(err);
                    }else{
                        res.send({status:1,post:post._id});
                    }
                });
            }
        });
    });
};


exports.upload=function(req,res){
    var fileData=req.files.fileData;
    var filePath=fileData.path;
    var originalFilename=fileData.originalFilename;
    if(originalFilename){
        fs.readFile(filePath,function(err,data) {
            var timestamp = Date.now();
            var type = fileData.type.split('/')[1];
            var poster = timestamp + '.' + type;
            //__dirname当前文件路径 第二个参数 是来调整这个路径的 第三个路径才是join
            var newPath = path.join(__dirname, '../../', '/public/images/upload/' + poster);
            fs.writeFile(newPath,data,function(err){
                if(err){
                    console.log(err);
                }else{
                    res.send({file_path:'/images/upload/'+poster});
                }
            })
        })
    }

};

exports.search=function(req,res){
    var q=req.query.q;
    var page=req.query.p;
    Post.count({
        title:new RegExp(q+'.*','i')
    },function(err,total){
        var pageSize=10;
        Post.find({title:new RegExp(q+'.*','i')})
            .skip(page*pageSize)
            .limit(10)
            .populate('category')
            .exec(function(err,posts){
            if(err){
                console.log(err);
            }else{
                res.render('pages/result',{
                    title:'结果页面',
                    keyword:q,
                    currentPage:page,
                    query:'q='+q,
                    totalPage:Math.ceil(total/pageSize),
                    posts:posts
                })
            }
        })
    });
};

exports.showAppDetail=function(req,res){
    var _id=req.params.id;
    Post.update({_id:_id},{$inc:{pv:1}},function(err){
        if(err){
            console.log(err);
        }else{
            Post.findOne({_id:_id}).populate('user').exec(function(err,post){
                Reply.find({post:_id}).populate('user').sort({'meta.updateAt':1}).limit(40).exec(function(err,replys){
                    Post.find({}).sort({'top':-1}).limit(10).populate('user').exec(function(err,hotRecommend){
                        if(err){
                            console.log(err)
                        }else{
                            res.send({
                              post:post,
                              replys:replys
                            });
                        }
                    })
                })
            })
        }
    });
};