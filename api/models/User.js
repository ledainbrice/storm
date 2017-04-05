/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
	name: {
		type: 'string',
		required: true
	},

	firstname: {
		type: 'string',
		required: true
	},

	email: {
		type: 'string',
		email: true,
		required: true,
		unique:true

	},

	admin: {
	  type: 'boolean',
	  defaultsTo: false
	},

	actived: {
	  type: 'boolean',
	  defaultsTo: false,
	  boolean: true
	},

	encryptedpassword: {
		type: 'string'
	},


	groups: {
	  collection: 'group',
	  via: 'members'
	},

		toJSON: function(){
			var obj = this.toObject();
			delete obj.encryptedPassword;
			delete obj._csrf;
			
			return obj;
		}
  	},

  	beforeValidation: function(values,next){
		if(typeof values.admin != 'undefined'){
		  	if(values.admin == 'unchecked'){
				values.admin = false;
		  	}else if(values.admin[1]=='on'){
				values.admin = true;
		  	}
		}
	  	next();
  	},

  	beforeCreate : function (values, next) {
		bcrypt.genSalt(10, function (err, salt) {
	  	
	  	if(err) return next(err);
	  		
	  		bcrypt.hash(values.password, salt, function (err, hash) {
			
			if(err) return next(err);
				values.encryptedPassword = hash;
				next();
	  		})
		})
  	},

  comparePassword : function (password, user, cb) {
	bcrypt.compare(password, user.encryptedPassword, function (err, match) {

	  if(err) cb(err);
	  if(match) {
		cb(null, true);
	  } else {
		cb(err);
	  }
	})
  }
};

