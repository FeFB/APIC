const { Observable } = require('rxjs');

class APIC {
	constructor(req, res, jwt = false) {
		this.req = req;
		this.res = res;
		this.method = req.method;
		this.routes = {};
		this.once();
		this.verifyTag();
	}

	once() {
		this.sucessFn = function(req, res, values) {
			let { status, message } = values;
			if (!status) status = 200;
			if (!message) message = values;
			res.status(status).send(message);
		};

		this.errorFn = function(req, res, values) {
			let { status, message } = values;
			if (!status) status = 500;
			if (!message) message = values;
			res.status(status).send(values);
		};
	}

	/**
	 *
	 * @param {function} nextFn - Function to execute when the route was successfully done
	 */
	onSucess(nextFn) {
		this.sucessFn = nextFn;
	}

	onError(errFn) {
		this.errorFn = errFn;
	}
	/**
	 * helps to identify the routes. Usually the first name should be the tag
	 * '/home/roomB/' - tag should be '/home'
	 */
	verifyTag() {
		const { path } = this.req;

		if (!path) {
			this.path = '/';
			return;
		}
		this.path = '/' + path.split('/')[1]; // '/employee' <= employee
	}

	/**
	 *
	 * @param {function} cb - Returns a Observable to be solve
	 *
	 */
	mid(cb) {
		if (!cb || typeof cb !== 'function') {
			throw 'Error in callback of the APIC middleWare';
		}
		this.middleWare = cb;
	}
	/*
	 Routes should be [{tag: Class Route}]
	Example: {'/home': Home}, {'/user': User}
	
		*/
	use(routes) {
		this.routes = routes;
	}

	run() {
		//Get
		const route = this.routes[this.path];

		if (!route) {
			this.res.status(400).send({
				message: 'End Point not found'
			});
		}

		const rte = new route();

		if (!this.middleWare) {
			//Create Router class
			rte
				.run(this.req, this.res)
				.subscribe(
					(msg) => this.sucessFn(this.req, this.res, msg),
					(err) => this.errorFn(this.req, this.res, err)
				);
			return;
		}

		this.middleWare(this.req, this.res)
			.mergeMap((value) => rte.run(this.req, this.res, value))
			.subscribe(
				(msg) => this.sucessFn(this.req, this.res, msg),
				(err) => this.errorFn(this.req, this.res, err)
			);
	}
}

module.exports = APIC;
