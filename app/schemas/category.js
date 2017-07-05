/**
 * Created by jimmy on 8/11/15.
 */
/**
 * Created by jimmy on 6/3/15.
 */

var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

var CategorySchema=new Schema({
    name:String,
    posts:[{
        type:ObjectId,
        ref:'Post'
    }],
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
//在每次执行save之前只ing的函数
CategorySchema.pre('save',function(next){
    if(this.isNew){

        this.meta.createAt=this.meta.updateAt=Date.now()
    }else
    {
        this.meta.updateAt=Date.now()
    }
    next()

});
CategorySchema.statics={
    //fetch所有数据
    //findById 根据id 来获取数据
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id: id})
            .exec(cb)
    }
};

module.exports=CategorySchema;

