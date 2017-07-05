/**
 * Created by jimmy on 10/4/15.
 */

exports.showAbout=function(req,res){
    res.render('pages/about',{
        title:'关于cberry'
    })
};

exports.showConstruct=function(req,res){
    res.render('pages/constructing',{
        title:'页面建设中'
    })
};