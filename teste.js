const Acl = require('./src/ACL');

const roles = {
	//Group
	managements: {
		//idAdm
		'23213aswew': {
			condominium: {
				get: true,
			},
		},
		'23213asw3w': {
			condominium: {
				create: true,
			},
		},
	},
	unit: {
		'212113': {
			calls: {
				create: true,
			},
		},
	},
};

/* const acls = {
	//roles
	public: {},
	managements: {
		get: function(req, res, id) {
			return Observable.of();
		},

		update: function(req, res, id) {
			console.log('Enable Update');
		},

		post: function(req, res, id) {
			console.log('Enable Post');
		},
	},
	assignee: {},
	unit: {},
};
 */

//acl para condominio
const acls = {
	get: function(idCond) {
		const data = {};
	},
};

const acl = new Acl(acls, 'condominium');

acl.checkPermissions('get', roles);
