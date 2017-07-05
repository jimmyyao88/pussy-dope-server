/**
 * Created by jimmy on 6/13/15.
 */
var Index=require('../app/controllers/index');
var Post=require('../app/controllers/post');
var List=require('../app/controllers/list');
var User=require('../app/controllers/user');
var Err=require('../app/controllers/err');
var Category=require('../app/controllers/category');
var Reply=require('../app/controllers/reply');
var Admin=require('../app/controllers/admin');
var Log=require('../app/controllers/log');
var Other=require('../app/controllers/other');
module.exports=function(app){
    app.use(function(req,res,next){
        var _user=req.session.user;
        app.locals.user=_user;
        next();
    });

    app.get('/',Index.showIndex);
    app.post('/signup',User.signup);
    app.post('/signin',User.signin);
    app.get('/logout',User.logout);
    /**post**/
    app.get('/poster',User.signinRequired,Post.showPoster);
    app.post('/post/save',User.signinRequired,Post.save);
    app.post('/post/reply/save',User.signinRequired,Reply.save);
    app.post('/post/upload',User.signinRequired,Post.upload);
    app.get('/post/detail/:id',Post.showDetail);
    app.get('/result/',Post.search);
    /***third-party***/
    app.get('/weibo/user/gettoken',User.weiboGetToken);
    app.get('/weibo/user/login',User.weiboLogin);
    /**user**/
    app.post('/user/favorite',User.signinRequired,User.favorite);
    app.post('/user/desc/save',User.signinRequired,User.saveDesc);
    app.get('/user/edit',User.signinRequired,User.showEdit);
    app.post('/user/update',User.signinRequired,User.postAvatar,User.update);
    app.get('/personal/:id',User.showPersonalIndex);
    app.get('/more/post/:id',User.signinRequired,User.morePost);
    app.get('/more/reply/:id',User.signinRequired,User.moreReply);
    app.get('/more/fav/:id',User.signinRequired,User.moreFav);
    app.get('/notify/show',User.signinRequired,User.showNotify);
    app.get('/notify/showcomment',User.signinRequired,User.showCommentNotify);
    app.get('/notify/showsys',User.signinRequired,User.showSysNotify);
    app.get('/alert',User.signinRequired,User.alert);
    /**分类**/
    app.get('/category/show',Category.showCategory);
    app.post('/category/save',Category.save);
    /**list**/
    app.get('/list',List.showList);
    app.get('/log/signup',Log.showSignup);
    app.get('/log/signin',Log.showSignin);
    /**administrator*/
    app.get('/administrator/manage/rockerjimmy',User.adminRequired,Admin.showAdmin);
    app.post('/administrator/profile/update',User.adminRequired,Admin.update);
    /**about**/
    app.get('/about',Other.showAbout);
    /***app***/
    app.get('/app/list',List.showAppList);
    app.get('/app/post/detail/:id',Post.showAppDetail);
    app.post('/app/user/signin',User.appSignin);
    /*****404*****/
    app.get('/constructing',Other.showConstruct);
    app.get('/error',Err.error);
    app.get('*',Err.error);
};
