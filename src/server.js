import Promise from 'bluebird'
import express from 'express'
import cookieParser from 'cookie-parser' 
import bodyParser   from 'body-parser'

import passport from 'passport' 
import session from 'express-session' 
import passportLocal from 'passport-local'
import flash from 'connect-flash'

import Database from './models/database' 
import User from './models/user'

const app = express();
const LocalStrategy = passportLocal.Strategy;

Database.connect();

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(flash());
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
	console.log("serialize", user.username);
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	console.log("deserialize", username);
    User.getUser(username).asCallback(done);
});

passport.use(new LocalStrategy((username, password, done) => {
	/*
	**  Passport has no support for promises so to mimic the functionality of the done callback:
	**  1) Return Promise.resolve passing in an array of done's arguments
	**	2) Call Promise.asCallback with spread set to true on the promise
	*/
	User.getUser(username).then((user) => {
		if(!user) {
			return Promise.resolve([false, { message: 'Incorrect username.' }]);
		}

		return User.checkPassword(username, password).then(validPassword => {
			if(validPassword) {
				return Promise.resolve([user, { message: 'Welcome' }]);
			}
			else {
				return Promise.resolve([false, { message: 'Incorrect password.' }]);
			}
		});
	}).asCallback(done, { spread: true });
}));

app.get('/', (req, res) => {
	res.sendFile(__dirname+"/app/index.html");
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});

/*
User.addUser({
	username: "ankushrayabhari5", 
	firstname: "Ankush", 
	middlename: null, 
	lastname: "Rayabhari", 
	password: "lol", 
	email: "ankush02@gmail.com", 
	birthday: new Date(1998, 6, 24),  
	gender: "M"
});
*/