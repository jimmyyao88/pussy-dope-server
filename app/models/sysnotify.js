/**
 * Created by jimmy on 6/25/15.
 */
var mongoose=require('mongoose');
var SysnotifySchema=require('../schemas/sysnotify');
var Sysnotify=mongoose.model('Sysnotify',SysnotifySchema);

module.exports=Sysnotify;