/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const bcrypt = require('bcrypt');

module.exports = {
	
	create: function(req,res,next){
		sails.log('Msg');
		var userObj = {
			name:req.param('name'),
			email:req.param('email'),
			password:req.param('password'),
			admin:false
			}
		
		User.create(req.params.all(),function userCreated(err,user){
			sails.log('Suite');
			if (err) {
				return next(err);
			}
			
			return res.json(user);
		});
	},

	'show': function (req,res,next){
		User.findOne(req.param('id')).populate("groups").exec( function foundUser(err,user){
			if (err) return next(err);
			if(!user) return next();
			return res.json(user);
		});
	},

	'index': function (req,res,next){
		//console.log(req.session);
		User.find({actived: true}).exec( function foundUsers(err,users){
			if (err) return next(err);
			
			return res.json({
				users:users
			});
		});
	},

	'update': function (req,res,next){

		User.update( req.param('id'), userObj, function userUpdated(err){
			if (err) {
				next(err);
			}
			return res.redirect('/user/show/'+req.param('id'));
		});
	},

	'activation': function(req,res,next){

		User.findOne({activation: req.param('activation'),actived: false}).exec( function foundUser(err,user){
			if (err) return next(err);

			User.update( user.id, {activation: '', actived: true}, function userUpdated(err){
				if (err) {
					return next(err);
				}
				user.actived = true;
				return res.json({user: user});
			});
		});
	},

	'destroy': function (req,res,next){
		User.findOne( req.param('id'), function findUser(err,user){
			if (err) {
				return next(err);
			}
			if(!user){
				return next('Nobody has been find');
			}
			User.destroy(req.param('id'),function userDestroyed(err){
				if (err) {
					return next(err);
				}
			});
			return res.json({user:user});
		});
	},

	login: function (req, res) {
		User.findOne({email: req.param('email'),actived: true},function foundUser(err,user){
			if(err) return next(err);
			if(!user){
				var noAccountError= [{name: 'noAccount', message: 'The email adress '+req.param('email')+' not found or inactived account.'}];
				return res.json(401,{error: noAccountError});
			}

			bcrypt.compare(req.param('password'),user.encryptedPassword,function(err,valid){
				if(err) return next(err);
				if(!valid){
					var usernamepasswordMismatchError = [{name:'usernamePasswordMismatch',message:'Invalid username and password combination.'}];
					return res.json(401,{error: usernamepasswordMismatchError});
				}
				
				console.log('connection de '+user.id);
				
				res.json(200, {user: user, token: jwToken.issue({id: user.id})});
			});
		});	    
    }
   
};

