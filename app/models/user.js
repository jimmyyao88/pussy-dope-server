/**
 * Created by jimmy on 6/25/15.
 */
var mongoose=require('mongoose');
var UserSchema=require('../schemas/user');
var User=mongoose.model('User',UserSchema);


module.exports=User;