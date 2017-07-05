/**
 * Created by jimmy on 8/11/15.
 */
var Category=require('../models/category');
exports.save=function(req,res){
    var _category=req.body.category;
    var category=new Category(_category);
    category.save(function(err,category){
        if(err){
            console.log(err);
            res.redirect('/error')
        }
        res.redirect('/');
    })
};
exports.showCategory=function(req,res){
    res.render('pages/category',{
        title:'分类录入'
    })
};