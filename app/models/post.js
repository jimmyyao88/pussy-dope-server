/**
 * Created by jimmy on 6/25/15.
 */
var mongoose=require('mongoose');
var PostSchema=require('../schemas/post');
var Post=mongoose.model('Post',PostSchema);

module.exports=Post;