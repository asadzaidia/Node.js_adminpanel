const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const Product=new Schema({
	p_name:{
		type:String,
		required:true
	},
	p_code:{
		type:String,
		required:true,
		

	},
	photo2:{
		type:String
	}

});
module.exports=mongoose.model('Product',Product);
