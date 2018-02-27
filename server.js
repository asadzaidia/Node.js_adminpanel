const express=require('express');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const hbs=require('hbs');
const expressHbs=require('express-handlebars');
// const multer=require('multer');
const fs=require('fs');
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);
const flash=require('express-flash');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const cookieParser=require('cookie-parser');
const app=express();
const config=require('./config/secret.js');
const port=process.env.PORT || 3000;

mongoose.connect(config.database,function(err){
	if(err){
		return console.log('Not connect',err);
	}
	console.log('connected to mongodb');
});
app.use(session({
	resave:true,
	saveUninitialized:true,
	secret:config.secret,
	store:new MongoStore({url:config.database,autoReconnect:true})

}));
app.engine('.hbs',expressHbs({defaultLayout:'layout',extname:'.hbs'})); //setting default layout
app.set('view engine','hbs');//setting viewing engine
app.use(express.static(__dirname+'/public'));//setting public directory for css js and other stuffs
app.use(morgan('dev'));//to console .log every server action
app.use(bodyParser.json());//to read input field data
app.use(bodyParser.urlencoded({extended:true}));//to read and uni code type of data
app.use(flash());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());//passport session object
app.use(function(req,res,next){//to acces login user to every page
	res.locals.user=req.user;
	next();
});
app.use(fileUpload());

mainRoutes=require('./routes/main');
app.use(mainRoutes);
app.listen(port,(err)=>{
	if(err){
		console.log(err);
	}
	console.log(`Running on server: ${port}`);
});
