/**
 * Created by jimmy on 6/25/15.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcryptjs');
var ObjectId=Schema.Types.ObjectId;
var SALT_WORK_FACTORY=10;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var UserSchema=new Schema({
    name:{
        unique:true,
        type:String
    },
    avatar:{
        type:String,
        default:'/images/noface.png'
    },
    email:{
        unique:true,
        type:String
    },
    signature:{
        type:String,
        default:'他什么也没留下'
    },
    replys:[{
        type:ObjectId,
        ref:'Reply'
    }],
    posts:[{
        type:ObjectId,
        ref:'Post'
    }],
    postcount:{
        type:Number,
        default:0
    }
    ,
    favorites:[{
        type:ObjectId,
        ref:'Post'
    }],
    desc:{
        type:String,
        default:'什么也没有...'
    }
    ,
    admin:{
        type:Number,
        default:0
    },
    replycount:{
        type:Number,
        default:0
    },
    password:String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});

UserSchema.plugin(deepPopulate,{
    populate: {
        'posts':{
            options:{
                limit:5
            }
        },
        'replys': {
            options: {
                limit: 5
            }
        },
        'favorites': {
            options: {
                limit: 5
            }
        }
    }
});

UserSchema.pre('save',function(next){
    var user=this;
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now();
    }else{
        this.meta.updateAt=Date.now();
    };
    bcrypt.genSalt(SALT_WORK_FACTORY,function(err,salt){
        if(err)
        {
            return next(err);
        }

        bcrypt.hash(user.password,salt,function(err,hash){
            if(err){
                return next(err);
            }
            user.password=hash;
            next();
        })
    })
});


UserSchema.methods={
    comparePassword:function(_password,cb){
        bcrypt.compare(_password,this.password,function(err,isMatch){
            if(err){
                return cb(err);
            }
            cb(null,isMatch);
        })
    },
    deepPopulate:function(){
        deepPopulate()
    }
};
UserSchema.statics={
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    }
};

module.exports=UserSchema;