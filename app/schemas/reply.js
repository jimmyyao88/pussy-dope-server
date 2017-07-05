/**
 * Created by jimmy on 7/20/15.
 */
/**
 * Created by jimmy on 6/25/15.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

var ReplySchema=new Schema({
    content:String,
    user:{
        type:ObjectId,
        ref:'User'
    },
    post:{
        type:ObjectId,
        ref:'Post'
    },
    like:{
        type:Number,
        default:0
    },
    reply:[
        {
            type:ObjectId,
            ref:'Reply'
        }
    ]
    ,
    unread:{
        type:Boolean,
        default:true
    },
    replyTo:{
        type:ObjectId,
        ref:'User'
    },
    replyUnread:{
        type:Boolean,
        default:true
    }
    ,floor:{
        type:Number
    },
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


ReplySchema.pre('save',function(next){
    var user=this;
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now();
    }else{
        this.meta.updateAt=Date.now();
    };
    next();
});
ReplySchema.statics={
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

module.exports=ReplySchema;