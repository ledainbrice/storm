/**
 * GroupController
 *
 * @description :: Server-side logic for managing groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create: function(req,res,next){
		var groupObj = {
			name:req.param('name')
			}

		Group.create(groupObj,function GroupCreated(err,group){
			if (err) {
				console.log(err);
				return next(err);
			}
			//group.users.add( req.param('user_id') );
			Member.create({user: req.param('user_id'), role: 'admin',group: group.id},function AdminGroupCreated(err,member){
				if(err){next(err);}
				return res.json(group);
			});
			
		});
	},

	invite: function(req,res,next){
		var groupObj = {
			name:req.param('name')
			}

		Group.findOne(req.param('id'),function Group(err,group){
			if (err) {
				return next(err);
			}
			Member.create({user: req.param('user_id'), role: 'invite',group: group.id},function InviteGroupCreated(err,member){
				if(err){next(err);}
				return res.json(group);
			});
			
		});
	},

	'index': function (req,res,next){
		//console.log(req.session);
		Group.find().exec( function foundGroups(err,groups){
			if (err) return next(err);
			res.json({
				groups:groups
			});
		});
	},

	'edit': function (req,res,next){
		console.log(req.session);
		User.findOne( req.param('id'), function foundUser(err,user){
			if (err) {
				return next(err);
			}
			res.json({
				user:user
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
	},
	
};

