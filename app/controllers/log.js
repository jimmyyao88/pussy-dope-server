/**
 * Created by jimmy on 9/9/15.
 */


exports.showSignup=function(req,res){
    res.render('pages/signup',{
        title:'注册页面'
    })
};
exports.showSignin=function(req,res){
    res.render('pages/signin',{
        title:'注册页面'
    })
};