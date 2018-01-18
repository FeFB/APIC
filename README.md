# APIC

to build simple API on serverless

## Usage

### Route Class

```
const {Route} = require('apic-serverless');
const {Observable}
class Home extends Route {

    constructor() {
		super();
		this.get('/home', (req, res) => Observable.of({
            status: 200,
            message: {
                name: 'Elon',
                lastName: 'Musk'
            }
        }));

        this.post('/home', (req, res) => Observable.of({'somehting'}));

        this.post('/home/2', (req, res) => Observable.of({'somehting2'}));

        this.put('/home/type', (req, res)=> Observable.of('Something'));

	}
}
module.exports = Home
```

To use the routes class:

```
const functions = require('firebase-functions');
const {Observable} = require('rxjs');
const {APIC} = require('apic-serverless');
const Home = require('./Home');

const routes = {
    '/home': Home
}

const GetHome = functions.https.onRequest((req, res) => {
	const app = new APIC(req, res);

	const middle = function(req, res) {
        const token = req.get('Authorization');

        if(!token) {
            return  Observable.throw({ status: 401, message: 'Missing Token' });
        }

        let decoded = {};

        try {
            decoded = jwt.verify(token, YOUR_PRIVATE_KEY);
            return Observable.of(decoded);
        }catch(err) {
            return Observable.throw({status: 401, message: err})
        }
	};

	app.mid(middle);
	app.use(routes);
	app.run();
});
```
