/**
 * Created by jimmy on 6/3/15.
 */


exports.error=function(req,res){
    res.render('pages/404',{
        title:'出错了'
    })
};
