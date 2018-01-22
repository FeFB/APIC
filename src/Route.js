const { Observable } = require('rxjs');

class Route {
	constructor() {
		this.getR = new Map();
		this.postR = new Map();
		this.putR = new Map();

		this.methods = {
			GET: this.getR,
			POST: this.postR,
			PUT: this.putR
		};
	}

	use(subRoutes) {
		Object.keys(subRoutes).forEach((key) => {
			// /user/employee
			console.log('key SubRoute: ' + key);
			const methodsAndCallbacks = subRoutes[key];

			Object.keys(methodsAndCallbacks).forEach((method) => {
				const cb = methodsAndCallbacks[method];
				console.log('methodo: ' + method);

				switch (method) {
					case 'post':
						this.post(key, cb);
						break;
					case 'get':
						console.log('Get');
						console.log(cb);
						this.get(key, cb);
						break;
					case 'put':
						this.put(key, cb);
						break;
					default:
						throw 'Method of subroutes not found';
				}
			});
		});
	}

	mid(cb) {
		if (!cb || typeof cb !== 'function') {
			throw 'Run: middleWare configuration';
		}

		this.middleWare = cb;
	}

	run(req, res, valuesFromAuth = 'null') {
		const { method, path } = req;
		//Select the Map that holds de endPoints from the verb;
		const routeMap = this.methods[method];

		//If not exists
		if (!routeMap) {
			return Observable.throw('method not found');
		}
		//Get the Callback for that endpoint
		const cb = routeMap.get(path);

		//If not exists
		if (!cb) {
			return Observable.throw('endpoint not found');
		}

		return cb(req, res, valuesFromAuth);
	}

	get(route, cb) {
		this.check(route, cb);
		this.getR.set(route, cb);
	}

	post(route, cb) {
		this.check(route, cb);
		this.postR.set(route, cb);
	}

	put(route, cb) {
		this.check(route, cb);
		this.putR.set(route, cb);
	}

	check(route, cb) {
		if (!route || typeof route !== 'string' || !cb || typeof cb !== 'function') {
			throw 'Check Route Failed';
		}
	}
}

module.exports = Route;
