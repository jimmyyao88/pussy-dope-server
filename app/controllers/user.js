/**
 * Created by jimmy on 6/25/15.
 */
var User=require('../models/user');
var Post=require('../models/post');
var Reply=require('../models/reply');
var SysNotify=require('../models/sysnotify');
var fs=require('fs');
var path=require('path');
var jwt = require('jwt-simple');
/*
    User是 model
    user是查询到的对象 以及 查询以后新建的对象
    _user是前端传递过来的对象
 */

exports.signup=function(req,res){
    var _user=req.body.user;
    User.find({email:_user.email},function(err,user){
        if(err){
            console.log(err);
        }else{
            if(user.length>0){
                res.send({status:1})
            }else{
                var user=new User(_user);
                user.save(function(err,user){
                    if(err){
                        console.log(err)
                    }else{
                        var _sysNotify={};
                        _sysNotify.user=user._id;
                        _sysNotify.content='欢迎来到cberry! ✪ω✪ ,快前往<a href=\"/user/edit\">修改资料</a>去上传你的头像和修改信息吧 ';
                        var sysNotify=new SysNotify(_sysNotify);
                        sysNotify.save(function(err){
                            req.session.user=user;
                            res.send({status:2});
                        });
                    }
                })
            }
        }

    })
};

exports.signin=function(req,res){
    var _user=req.body.user;
    User.findOne({email:_user.email},function(err,userData){
        console.log(2);
        if(!userData){
           res.send({status:1});
        }else{
            userData.comparePassword(_user.password,function(err,isMatch){
                if(isMatch){
                    console.log(3)
                    req.session.user=userData;
                    res.send({status:2});
                }else{
                    console.log(5)
                    res.send({status:1});
                }
            })
        }
    })
};

exports.logout=function(req,res){
    delete req.session.user;
    res.redirect('/');
};

exports.showPersonalIndex=function(req,res){
    var _id=req.params.id;
        User.findOne({_id:_id})
            .deepPopulate('replys.post replys.user posts favorites.user')
            .exec(function(err,user){
            if(err){
                console.log(err);
            }else{
                res.render('pages/personal',{
                                    title:'个人主页',
                                    _user:user,
                                    uid:_id
                                })
            }
    });
};

exports.signinRequired=function(req,res,next){
    var user = req.session.user;
    if(!user)
    {
        return res.redirect('/signin');
    }else{
        next();
    }
};

exports.adminRequired=function(req,res,next){
    var user = req.session.user;
    if(!user)
    {
        return res.redirect('/signin');
    }else if(user.admin==777){
        next();
    }else{
        res.redirect('/');
    }
};

exports.favorite=function(req,res){
    var pid=req.body.pid;
    User.findByIdAndUpdate(req.session.user._id,{$addToSet:{favorites:pid}},function(err,user){
        if(err){
            console.log(err);
        }
        res.send({status:1});
    })
};

exports.saveDesc=function(req,res){
    var desc=req.body.desc;
    User.findByIdAndUpdate(req.session.user._id,{$set:{desc:desc}},function(err){
            if(err){
                console.log(err)
            }else{
                User.findById(req.session.user._id,function(err,user){
                    if(err){
                        console.log(err)
                    }else{
                        res.send({
                            status:1,
                            desc:user.desc
                        })
                    }
                })
            }

    })
};

exports.morePost=function(req,res){
    var _id=req.params.id;
    var currentPage=req.query.p;
    var pageSize=10;

    Post.count({user:_id},function(err,total){
        var totalPage=Math.ceil(total/pageSize);
        if(err){
            console.log(err)
        }else{
            Post.find({user:_id}).populate('user').limit(pageSize).skip(pageSize*currentPage).exec(function(err,posts){
                if(err){
                    console.log(err)
                }else{
                    res.render('pages/more_post',{
                        title:'更多话题',
                        posts:posts,
                        totalPage:totalPage,
                        currentPage:currentPage,
                        userId:_id
                    })
                }
            });
        }
    })
};

exports.moreReply=function(req,res){
    var _id=req.params.id;
    var currentPage=req.query.p;
    var pageSize=10;
    Reply.count({user:_id},function(err,total){
        var totalPage=Math.ceil(total/pageSize);
        if(err){
            console.log(err)
        }else{
            Reply.find({user:_id}).populate('user post').limit(pageSize).skip(pageSize*currentPage).exec(function(err,replys){
                if(err){
                    console.log(err)
                }else{
                    res.render('pages/more_reply',{
                        title:'更多话题',
                        replys:replys,
                        totalPage:totalPage,
                        currentPage:currentPage,
                        userId:_id
                    })
                }
            });
        }
    })
};



exports.moreFav=function(req,res){
    var _id=req.params.id;
    var currentPage=req.query.p;
    User.findOne({_id:_id}).deepPopulate('favorites favorites.user').exec(function(err,user){
        if(err){
            console.log(err)

        }else{
            var totalPage=Math.ceil(user.favorites.length/10);
            res.render('pages/more_fav',{
                title:'更多话题',
                favorites:user.favorites,
                totalPage:totalPage,
                currentPage:currentPage,
                userId:_id
            })
        }
    });
};


exports.postAvatar=function(req,res,next){
    var postData=req.files.avatar;
    if(postData.originalFilename){
        var filepath=postData.path;
        fs.readFile(filepath,function(err,data){
            var timestamp=Date.now();
            var type=postData.type.split('/')[1];
            var avatar=timestamp+'.'+type;
            //__dirname当前文件路径 第二个参数 是来整这个路径的 第三个路径才是join
            var newPath=path.join(__dirname,'../../','public/images/upload/'+avatar);
            console.log(newPath);
            fs.writeFile(newPath,data,function(err){
                if(err){
                    console.log(err);
                }
                var imgUrl='/images/upload/'+avatar;
                User.findByIdAndUpdate(req.session.user._id,{$set:{avatar:imgUrl}},function(err,user){
                    console.log(user);
                    next();
                });
            })
        })
    }else{
        next();
    }
};

exports.showEdit=function(req,res){
    User.findById(req.session.user._id,function(err,user){
        if(err){
            console.log(err)
        }else{
            res.render('pages/edit',{
                title:'编辑资料',
                user:user
            })
        }
    });
};

exports.update=function(req,res){
    var _user=req.body.user;
    var user=req.session.user;
    User.findByIdAndUpdate(user._id,{$set:{name:_user.name,email:_user.email,signature:_user.signature}},function(err){
        if(err){

        }else{
            User.findById(user._id,function(err,user){
                req.session.user=user;
                req.session.save();
                res.redirect('/personal/'+req.session.user._id);
            });
        }
    });
};

exports.showNotify=function(req,res){
    User.findById(req.session.user._id,function(err,user){
        if(err){
            console.log(err);
        }else{
            var data={};
            var post_ids=user.posts;
            var promise=Reply.find({post:{'$in':post_ids}}).sort({'meta.updateAt':'desc'}).populate('user post').exec();
            promise.then(function(replies){
                data.replies=replies;
                return Reply.find({replyTo:req.session.user._id}).populate('user post').exec()
            }).then(function(commentReplies) {
                data.commentReplies = commentReplies;
                return Reply.find({'post': {'$in': post_ids}}).populate('user post').where('unread').equals('true').exec();
            }).then(function(unreadReplies){
                data.unreadReplies=unreadReplies;
                return Reply.update({'post':{'$in':post_ids}},{$set:{unread:'false'}},{ multi: true }).exec();
            }).then(function() {
                return SysNotify.find({user: req.session.user._id}).populate('user').where('unread').equals('true').exec();
            }).then(function(unreadSysNotifies) {
                data.unreadSysNotifies = unreadSysNotifies;
                return SysNotify.find({user: req.session.user._id}).populate('user').exec();
            }).then(function(sysNotifies) {
                data.sysNotifies = sysNotifies;
                return Reply.find({replyTo: req.session.user._id}).populate('user post').exec();
            }).then(function(commentReplies) {
                data.commentReplies = commentReplies;
                return Reply.find({replyTo: req.session.user._id}).populate('user post').where('replyUnread').equals('true').exec();
            }).then(function(unreadCommentReplies) {
                data.unreadCommentReplies = unreadCommentReplies;
                return Reply.update({replyTo: req.session.user._id}, {$set: {replyUnread: 'false'}}, {multi: true}).exec();
            }).then(function() {
                return SysNotify.update({user: req.session.user._id}, {$set: {unread: 'false'}}, {multi: true}).exec();
            }).then(function(){
                res.render('pages/notify',{
                    title:'氦星球 通知页面',
                    replies:data.replies,
                    unreadReplies:data.unreadReplies ,
                    unreadSysNotifies:data.unreadSysNotifies,
                    sysNotifies:data.sysNotifies,
                    unreadCommentReplies:data.unreadCommentReplies,
                    commentReplies:data.commentReplies
                })
            });
        }
    });
};

exports.showCommentNotify=function(req,res){
    User.findById(req.session.user._id,function(err,user){
        if(err){
            console.log(err);
        }else{
            Reply.find({replyTo:req.session.user._id}).populate('user post').exec(function(err,commentReplies){
                    if(err){
                        console.log(err)
                    }else{
                        Reply.update({replyTo:req.session.user._id},{$set:{replyUnread:'false'}},{ multi: true },function(){
                            res.render('pages/comment_notify',{
                                title:'评论通知提醒',
                                commentReplies:commentReplies
                            })
                        });
                    }
            })
        }
    });
};
exports.showSysNotify=function(req,res){
    var currentPage=req.query.p;
    var pageSize=40;
    var data={};
    var promise=SysNotify.count({user:req.session.user._id}).exec();
    promise.then(function(total){
        data.total=total;
        return SysNotify.find({user:req.session.user._id}).populate('user').skip(currentPage*pageSize).exec()
    }).then(function(notifies){
        data.notifies=notifies;
    }).then(function(unreadReplies){
        console.log(unreadReplies);
        data.unreadReplies=unreadReplies;
        res.render('pages/sys_notify',{
            title:'系统通知--cberry',
            notifies:data.notifies,
            unreadReplies:data.unreadReplies,
            currentPage:currentPage,
            totalpage:Math.ceil(data.total/pageSize)
        })
    });
};
exports.alert=function(req,res){
    var data={};
    if(req.session.user){
        User.findById(req.session.user,function(err,user) {
            var post_ids=user.posts;
            if(err){
                console.log(err)
            }else{
                var promise=Reply.find({'post': {'$in': post_ids}}).where('unread').equals('true').exec();
                promise.then(function(replies){
                        data.reply_num=replies.length;
                        return Reply.find({replyTo: req.session.user._id}).populate('user post').where('replyUnread').equals('true').exec();
                }).then(function(comments){
                        data.comment_num=comments.length;
                        return SysNotify.find({user: req.session.user._id}).populate('user').where('unread').equals('true').exec();
                }).then(function(sysNotifies){
                        data.sys_num=sysNotifies.length;
                    data.length=parseInt(data.sys_num)+parseInt(data.reply_num)+parseInt(data.comment_num);
                    if(data.length>0){
                        res.send({unread:true,notify_num:data.length})
                    }else{
                        res.send({unread:false})
                    }

                });
            }
        })
    }else{
        res.send({unread:false})
    }
};
exports.weiboGetToken=function(req,res){
    var code=req.query.code;
    console.log(code);
    var url='https://api.weibo.com/oauth2/access_token?client_id=1230447599&client_secret=2ef822d33c72183dc91a38e0fcf66f5b&grant_type=authorization_code&redirect_uri=http://www.cberry.cn/weibo/user/login&code='+code;
    res.redirect(url);
};
exports.weiboLogin=function(req,res){
    console.log(req.body);
};

exports.appSignin=function(req,res){
    console.log('caca');

    var _user=req.body.user;
    console.log('caca');
    User.findOne({email:_user.email},function(err,user){
        console.log('xiix');
        if(!user){
            res.send({status:1});
        }else{
            user.comparePassword(_user.password,function(err,isMatch){
                if(isMatch){
                    var expires = moment().add('days', 60).valueOf();
                    // encode 方法第一个参数加密对象，第二个加密方式
                    var token = jwt.encode({
                        iss: user.id,
                        exp: expires
                    }, app.get('jwtTokenSecret'));
                    user.accesstoken=token;
                    res.send({
                        user: user
                    });

                }else{
                    console.log(5);
                    res.send({status:1});
                }
            })
        }
    })
};

exports.auth=function(req,res){
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if(token){
        var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
        if (decoded.exp <= Date.now()) {

            res.end('Access token has expired', 400);
        }else{
            User.findOne({ _id: decoded.iss }, function(err, user) {
                req.user = user;
            });
        }
    }
};