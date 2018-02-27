const mongoose=require('mongoose');
const bcrypt=require('bcrypt-nodejs');//encryption and decryption
const crypto=require('crypto');//built in java methods for secure cryptography 
const Schema=mongoose.Schema;

const admin=new Schema({
	username:{
		type:String,
		unique:true,
		required:true
	},
	password:{
		type:String,
		required:true,
		

	},
	photo:{
		type:String
	}

});

admin.pre('save',function(next){
	var admin=this;
	if(!admin.isModified('password')){
		return next(err);
	}
	bcrypt.genSalt(10,function(err,salt){
		if(err){
			return next(err);
		}
		bcrypt.hash(admin.password,salt,null,function(err,hash){
			if(err){
				return next(err);
			}
			admin.password=hash;
			next(err);
		});
	});

});

admin.methods.comparePassword=function(password){
	return bcrypt.compareSync(password,this.password);
}

module.exports=mongoose.model('Admin',admin);