const Acl = require('./src/ACL');

const roles = {
	//Group
	managements: {
		//idAdm
		'23213aswew': {
			rules: {
				condominium: {
					get: true,
				},
			},
		},
		'23213asw3w': {
			rules: {
				condominium: {
					create: true,
				},
			},
		},
	},
	unit: {
		'212113': {
			rules: {
				calls: {
					create: true,
				},
			},
		},
	},
};

const acls = {
	//roles
	public: {},
	managements: {
		get: function(req, res, id) {
			return Observable.of('1234');
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

const acl = new Acl(acls, 'condominium');

acl.run('get', roles).subscribe((value) => {
	console.log('dentro do sucesso');
	console.log(value);
});
