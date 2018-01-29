const _ = require('lodash');
const {
	Observable
} = require('rxjs');

/**
 * The ACL will be built for Route
 * Each route has its ACL. The route is identify bye the tag.
 *
 */
class Acl {
	constructor(acls, tag) {
		this.acls = acls;
		this.tag = tag; // condominio
	}


	//Get
	buildExpression(method) {
		//get
		const acl = _.get(this.acls, method, false);

		if (!acl) {
			throw {
				status: 500,
				message: 'Acl not found'
			}
		}

		//A funcao da ACL tem q retornar um Observable que monte as expressoes possiveis

		return acl(req, res, tokenDecoded);

	}
	//Checks if the User has the permission for the method that is trying to do
	checkPermissions(method, roles) {
		//The path that this ACL is controlling controls.
		this.path = this.tag + '.' + method; // example:  condominium.get

		//Scan the roles for the permission
		this.permissions = _.transform(
			roles,
			(acc, space, groupType) => {
				const rules = this.scanGroup(acc, space, groupType);
				_.set(acc, groupType, rules);
			}, []
		);
		console.log('===============');
		console.log(this.permissions);
	}

	/**
	 * acc - Array acumulador que sera retornada na funcao
	 * space - cada grupo do usuario (managements, unit) esta linkada a uma administradora ou mais
	 * ou o usuario poderia estar linkado a mais apartamentos
	 */

	scanGroup(acc, space, groupType) {
		console.log('this user has the group type: ' + groupType);
		console.log(space);

		return _.transform(
			space,
			(reduction, rules, key) => {
				console.log('Has key: ' + key);
				const rule = _.get(rules, this.path);
				console.log(rule);
				if (rule) {
					_.set(reduction, key + '.' + this.path, rule);
				}
			}, []
		);
	}

	get(method, roles) {
		this.method = method;
		const path = this.tag + '.' + method; //condominio.get

		this.toRun_ = _.transform(
			roles,
			(red, o, groupType) => {
				const acc = this.getPermissions(groupType, o);
				red = _.merge(red, acc);
			}, []
		);
	}

	getPermissions(group, object) {
		const path = 'rules.' + this.tag + '.' + this.method; //condominio.get

		return _.transform(
			object,
			function (red, o, key) {
				const permission = _.get(o, path);
				if (permission) {
					const acl = this.getAcl(group + '.' + this.method);
					red.push(acl);
				}
			}, []
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