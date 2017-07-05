/**
 * Created by jimmy on 6/25/15.
 */
var mongoose=require('mongoose');
var ReplySchema=require('../schemas/reply');
var Reply=mongoose.model('Reply',ReplySchema);

module.exports=Reply;