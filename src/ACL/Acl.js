const _ = require('lodash');
const { Observable } = require('rxjs');

class Acl {
	constructor(acls, tag) {
		this.acls = acls;
		this.tag = tag; // condominio
	}

	get(method, roles) {
		this.method = method;
		const path = this.tag + '.' + method; //condominio.get

		this.toRun_ = _.transform(
			roles,
			(red, o, groupType) => {
				const acc = this.getPermissions(groupType, o);
				red = _.merge(red, acc);
			},
			[]
		);
	}

	getPermissions(group, object) {
		const path = 'rules.' + this.tag + '.' + this.method; //condominio.get

		return _.transform(
			object,
			(red, o, key) => {
				const permission = _.get(o, path);
				if (permission) {
					const acl = this.getAcl(group + '.' + this.method);
					red.push(acl);
				}
			},
			[]
		);
	}

	getAcl(path) {
		//path = groupType.methodName
		return _.get(this.acls, path);
	}

	run(method, roles) {
		this.get(method, roles);
		return Observable.forkJoin(this.toRun_);
	}
}

module.exports = Acl;
