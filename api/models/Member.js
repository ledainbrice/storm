/**
 * Group.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: "users_groups",
	attributes: {
		role: {
			type: 'string',
			defaultsTo: 'none'
		},
		user: {
			model: 'user'
		},
		group: {
			model: 'group'
		}
}
};

