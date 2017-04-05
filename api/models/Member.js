/**
 * Group.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		role: {
			type: 'string',
			defaultsTo: 'none'
		},
		user: {
			type: 'integer',
			foreignKey: true,
			references: 'users',
			on: 'id',
			onKey: 'id',
			via: 'group'
		},
		group: {
			type: 'integer',
			foreignKey: true,
			references: 'groups',
			on: 'id',
			onKey: 'id',
			via: 'user'
		}
}
};

