/**
 * Created by jimmy on 6/13/15.
 */
var Track=require('../app/controllers/track');

module.exports=function(app){
    // app.use(function(req,res,next){
    //     var _user=req.session.user;
    //     app.locals.user=_user;
    //     next();
    // });

    app.get('/stream/:id',Track.pipeRawLink);


    // app.get('*',Err.error);
};
