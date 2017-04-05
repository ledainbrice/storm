/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
				return res.json(err);
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
		User.find().exec( function foundUsers(err,users){
			if (err) return next(err);
			
			return res.json({
				users:users
			});
		});
	},

	'update': function (req,res,next){

		if(req.session.User.admin){
			var userObj = {
				name:req.param('name'),
				email:req.param('email'),
				admin:req.param('admin')
			}
		}else{
			var userObj = {
				name:req.param('name'),
				email:req.param('email')
			}
		}
		User.update( req.param('id'), userObj, function userUpdated(err){
			if (err) {
				return res.redirect('/user/edit/'+req.param('id'));
			}
			return res.redirect('/user/show/'+req.param('id'));
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
			return res.redirect('/user');
		});
	}
};

