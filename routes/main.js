const router=require('express').Router();
const Admin=require('../models/admin-model.js');
const Product=require('../models/product.js');
const fileUpload = require('express-fileupload');
const passport=require('passport');
const passportConfig=require('../config/passport');


router.route('/')
 .get((req,res,next)=>{
 	if(req.user){
 		res.redirect('/add-admin');
 	}
	res.render('main/login',{message:req.flash('loginMessage'),layout:'login-layout'});

})
 .post(passport.authenticate('local-login',{
 	successRedirect:'/add-admin',
 	failureRedirect:'/',
 	failureFlash:true
 }));

 router.get('/logout',(req,res,next)=>{
 	req.logout();
 	res.setHeader('Content-Type', 'text/plain');
 	res.redirect('/');
 });


//adding new admin here
router.route('/add-admin')
	.get((req,res,next)=>{
		if(req.user){
	res.render('main/add-admin',{message:req.flash('errors'),success:req.flash('success')});
}else{
		res.setHeader('Content-Type', 'text/plain');
		res.redirect('/');
	} 
})
	//upload.any(),
	.post((req,res,next)=>{
		Admin.findOne({username:req.body.username},function(err,alreadyExist){
			if(alreadyExist){
				req.flash('errors','User with that username already exist!');
				res.redirect('/add-admin');
			}else{
				var admin=new Admin();
				let pic=req.files.pic;
				console.log(pic.name);
				console.log(req.body.username);
				console.log(req.body.password);
				
				admin.username=req.body.username;
				admin.password=req.body.password;
				
				admin.photo=req.files.pic.name;
				pic.mv('public/admin_images/'+pic.name, function(err) {
    if (err)
      return res.send(err);
 
    console.log('File uploaded!');
  });
				admin.save(function(err){
					if(err){
						return next(err);
					}
					req.flash('success','Admin Added!');
					res.redirect('/add-admin');
					
				});
			}
		})
	});

	router.get('/view-admin',(req,res,next)=>{
		if(req.user){
			Admin.find({},function(err,adm){
				if(err){
					console.log(err);
				}
				else{
					res.render('main/view-admin',{admin:adm});

				}

			})
			

		}
	});

	router.get('/dadmin/:id',(req,res,next)=>{
		
		Admin.remove({_id:req.params.id},function(err){
			if(err){
				console.log(err);

			}
			else{
				res.redirect('/view-admin');
			}

		});
	

	});

	router.route('/add-product')
		.get((req,res,next)=>{
			res.render('main/add-product');
		})
		.post((req,res,next)=>{

			var product=new Product();
			let pic=req.files.p_pic;
			product.p_name=req.body.pn;
			product.p_code=req.body.pc;
			product.photo2=req.files.p_pic.name;

			pic.mv('public/product_images/'+pic.name, function(err) {
    					if (err)
     			 return res.send(err);
 
    				console.log('File uploaded!');
  						});
				product.save(function(err){
					if(err){
						return next(err);
					}
					res.redirect('/view-products');
					
				});

		});

	router.get('/view-products',(req,res,next)=>{
		if(req.user){
			Product.find({},function(err,product){
				if(err){
					console.log(err);
				}
				else{
					res.render('main/view-product',{product:product});

				}

			})
			

		}
	});


module.exports=router;