/**
 * Created by jimmy on 7/20/15.
 */
/**
 * Created by jimmy on 6/25/15.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

var PostSchema=new Schema({
    title:String,
    content:String,
    user:{
        type:ObjectId,
        ref:'User'
    },
    like: {
        type: Number,
        default: 0
    },
    pv:{
        type:Number,
        default:0
    },
    category:{
        type:ObjectId,
        ref:'Category'
    },
    awesome:{
        type:Boolean,
        default:false
    },
    top:{
        type:Boolean,
        default:false
    },
    replynum:{
        type:Number,
        default:0
    },
    replylast:{
        type:ObjectId,
        ref:'User'
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

PostSchema.pre('save',function(next){
    var user=this;
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now();
    }else{
        this.meta.updateAt=Date.now();
    };
    next()
});


PostSchema.statics={
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

module.exports=PostSchema;