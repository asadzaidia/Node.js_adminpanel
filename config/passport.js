const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const Admin=require('../models/admin-model');

passport.serializeUser(function(user,done){
 done(null,user.id);
});
passport.deserializeUser(function(id,done){
	Admin.findById(id,function(err,user){
		done(err,user)
	});
});
passport.use('local-login',new LocalStrategy({
	usernameField:'username',
	passwordField:'password',
	passReqToCallback:true
},function(req,username,password,done){
	Admin.findOne({username:username},function(err,user){
		if(err){
			return done(err);
		}
		if(!user){
			return done(null,false,req.flash('loginMessage','No User Found'));

		}
		if(!user.comparePassword(password)){
			return done(null,false,req.flash('loginMessage','Oops! wrong Password'));
		}
		return done(null,user);
	});	
}));