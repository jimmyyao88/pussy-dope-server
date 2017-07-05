/**
 * Created by jimmy on 6/3/15.
 */


var mongoose=require('mongoose');
var CategorySchema=require('../schemas/category');
var Category=mongoose.model('Category',CategorySchema);

module.exports=Category;