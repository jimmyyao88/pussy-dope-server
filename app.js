/**
 * Created by jimmy on 6/11/15.
 */
var express=require('express');
var mongoose=require('mongoose');
var path=require('path');
var cookieParser = require('cookie-parser');
var session=require('express-session');
var MongoStore = require('connect-mongo')(session);
var multiPart=require('connect-multiparty');
var bodyParser=require('body-parser');
var app=express();


var dbUrl="mongodb://localhost/cberry";

//if (process.env.VCAP_SERVICES) {
//    var db_config = JSON.parse(process.env.VCAP_SERVICES).mongodb[0].credentials;
//    console.log(db_config);
//    dbUrl = db_config.uri;
//}
var port=4000;

mongoose.connect(dbUrl);
app.locals.moment=require('moment');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    secret: 'cberry',
    store:new MongoStore({
        url:dbUrl,
        collection:'sessions'
    })
}));


app.use(multiPart());

app.set('views','./app/views');

app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

require('./config/routes')(app);

console.log('started at'+port);

app.listen(port);
