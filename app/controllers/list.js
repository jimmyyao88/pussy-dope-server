/**
 * Created by jimmy on 6/18/15.
 */
var Post=require('../models/post');
var Category=require('../models/category');
exports.showList=function(req,res) {
    var categoryName = req.query.category;
    var pageSize=10;
    if(categoryName=='all'){
            var data={};
            var currentPage=req.query.p;
            var promise=Category.find({}).exec();
            promise.then(function(categories){
                data.categories=categories;
                return Post.count({}).exec();
            }).then(function(total){
                console.log(total);
                data.total=total;
                return Post.find({}).sort({'pv':-1}).limit(10).populate('user').exec();
            }).then(function(hotrecommend){
                data.hotrecommend=hotrecommend;
                return Post.find({}).sort({'meta.updateAt':-1}).populate('category user').skip(currentPage*pageSize).limit(pageSize).exec()
            }).then(function(posts){
                data.posts=posts;
                res.render('pages/all_list',{
                    title:'全部列表',
                    posts:data.posts,
                    hotrecommend:data.hotrecommend,
                    currentPage:currentPage,
                    totalPage:Math.ceil(data.total/pageSize),
                    categories:data.categories,
                    categoryName:'all'
                })
            });
    }else if(categoryName=='awesome'){
        var data = {};
        var currentPage = req.query.p;
        var promise=Category.find({}).exec();
        promise.then(function(categories){
            data.categories=categories;
            return Post.count({awesome:true});
        }).then(function(total){
            data.total=total;
            return Post.find({awesome: true}).populate('user category').skip(currentPage*pageSize).limit(pageSize).sort({'meta.updateAt':-1})
        }).then(function(posts){
            data.posts=posts;
            return Post.find({}).sort({'meta.updateAt':-1}).populate('category user').skip(currentPage*pageSize).limit(pageSize).exec()
        }).then(function(hotrecommend){
            data.hotrecommend=hotrecommend;
            res.render('pages/all_list',{
                title:'精华列表--cberry 树莓派中国',
                posts:data.posts,
                hotrecommend:data.hotrecommend,
                currentPage:currentPage,
                totalPage:Math.ceil(data.total/pageSize),
                categories:data.categories,
                categoryName:'awesome'
            })
        })
    }else{
        var data = {};
        var currentPage = req.query.p;
        var promise =Category.find({}).exec();
        promise.then(function(categories){
            data.categories=categories;
            return Category.findOne({name: categoryName}).select('_id').exec();
        }).then(function(category){
            data.categoryId=category._id;
            return Post.count({category:data.categoryId}).exec();
        }).then(function(total){
            data.total=total;
            return Post.find({category:data.categoryId}).sort({'pv':-1}).limit(10).populate('user').exec();
        }).then(function(hotrecommend){
            data.hotrecommend=hotrecommend;
            return Post.find({category:data.categoryId}).sort({'meta.updateAt':-1}).populate('category user').skip(currentPage*pageSize).limit(pageSize).exec()
        }).then(function(posts){
            data.posts=posts;
            res.render('pages/all_list',{
                title:'cberry－－－中国树莓派社区',
                posts:data.posts,
                hotrecommend:data.hotrecommend,
                currentPage:currentPage,
                totalPage:Math.ceil(data.total/pageSize),
                categoryName:categoryName,
                categories:data.categories
            })
        });
    }

};




exports.awesomeList=function(req,res){
        Post
            .count({awesome:true})
            .exec(function(err,total){
                if(err){
                    console.log(err)
                }else{
                    var currentPage=req.query.p;
                    var pageSize=10;
                    Post
                        .find({awesome: true})
                        .skip(currentPage*pageSize)
                        .limit(pageSize)
                        .exec(function(err,posts){
                            if(err){
                                console.log(err)
                            }else{
                                res.render('pages/awesome_list',{
                                    title:'招聘列表页面',
                                    posts:posts,
                                    currentPage:currentPage,
                                    totalPage:Math.ceil(total/pageSize)
                                })
                            }
                        })
                }
            });

};


exports.showAppList=function(req,res){
    var data = {};
    var currentPage = req.query.p;
    var pageSize = 2;
    var categoryName=req.query.category;
    var promise =Category.find({}).exec();
    promise.then(function(categories){
        data.categories=categories;
        return Category.findOne({name: categoryName}).select('_id').exec();
    }).then(function(category){
        data.categoryId=category._id;
        return Post.count({category:data.categoryId}).exec();
    }).then(function(total){
        data.total=total;
        return Post.find({category:data.categoryId}).sort({'pv':-1}).limit(10).populate('user').exec();
    }).then(function(hotrecommend){
        data.hotrecommend=hotrecommend;
        return Post.find({category:data.categoryId}).sort({'meta.updateAt':-1}).populate('category user').skip(currentPage*pageSize).limit(pageSize).exec()
    }).then(function(posts){
        data.posts=posts;
      res.send({posts:data.posts})
    });
};