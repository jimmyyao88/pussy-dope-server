/**
 * Created by jimmy on 6/13/15.
 */
var Post=require('../models/post');
var User=require('../models/user');
var Category=require('../models/category');

exports.showIndex=function(req,res){
    var data={};
    var promise=User.find({}).sort({'postcount':-1}).limit(8).exec();
    promise.then(function(postUsers){
        data.postUsers=postUsers;
        return User.find({}).sort({'meta.updateAt':-1}).limit(10).exec();
    }).then(function(newUsers){
        data.newUsers=newUsers;
        return User.find({}).sort({'replycount':-1})
    }).then(function(favorUsers){
        data.favorUsers=favorUsers;
        return Post.find({awesome:true}).sort({'meta.updateAt': -1}).limit(7).populate('category user replylast').exec()
    }).then(function(allPosts){
        data.allPosts=allPosts;
        return Category.findOne({name:'问答'}).exec()
    }).then(function(query){
        data.queryId=query._id;
        return Category.findOne({name:'交易'}).exec()
    }).then(function(trade){
        data.tradeId=trade._id;
        return Post.find({category:data.queryId}).sort({'meta.updateAt': -1}).populate('category user replylast').limit(7).exec()
    }).then(function(queryPosts){
        data.queryPosts=queryPosts;
        return Post.find({category:data.tradeId}).sort({'meta.updateAt': -1}).populate('category user replylast').limit(7).exec();
    }).then(function(tradePosts) {
        data.tradePosts = tradePosts;
        return Post.find({category: data.queryId}).sort({'meta.updateAt': -1}).limit(5).exec();
    }).then(function(recQueryPosts){
        data.recQueryPosts=recQueryPosts;
        return Post.find({category:data.tradeId}).sort({'meta.updateAt': -1}).limit(5).exec();
    }).then(function(recTradePosts){
        data.recTradePosts=recTradePosts;
        return Post.find({}).sort({'meta.updateAt': -1}).limit(5).exec()
    }).then(function(recAllPosts){
        data.recAllPosts=recAllPosts;
        res.render('pages/index',{
            title:'cberry---树莓派专业中文社区 ',
            allPosts:data.allPosts,
            queryPosts:data.queryPosts,
            tradePosts:data.tradePosts,
            favorUsers:data.favorUsers,
            newUsers:data.newUsers,
            postUsers:data.postUsers,
            recQueryPosts:data.recQueryPosts,
            recTradePosts:data.recTradePosts,
            recAllPosts:data.recAllPosts
        })
    });
    //User.find({}).sort('-postcount').limit(8).exec(function(err,users) {
    //        Post.find({})
    //            .limit(5)
    //            .populate('category')
    //            .exec(function (err, posts) {
    //                if (err) {
    //                    console.log(err)
    //                } else {
    //                    res.render('pages/index', {
    //                        title: '首页',
    //                        posts: posts,
    //                        users:users
    //                    })
    //                }
    //            })
    //    })
};
