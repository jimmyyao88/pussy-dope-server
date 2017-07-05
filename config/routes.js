/**
 * Created by jimmy on 6/13/15.
 */
var Index=require('../app/controllers/index');

module.exports=function(app){
    // app.use(function(req,res,next){
    //     var _user=req.session.user;
    //     app.locals.user=_user;
    //     next();
    // });

    app.get('/',Index.showIndex);

    app.get('*',Err.error);
};
