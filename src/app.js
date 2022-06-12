const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const tasksRoutes = require('./routes/tasks');
const loginRoutes = require('./routes/login');
const middleware = require('./middleware/validate');

const app = express();
app.set('port', 4000);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'crudnodejs'
}, 'single'));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.listen(app.get('port'), () => {
console.log('Listening on port ', app.get('port'));
});

function isAdmin(req, res, next) {
    if (req.session.loggedin == true) {
		console.log(req.session);
      next();
    } else {
		
        res.redirect('/login');
    }
  }
app.use(isAdmin);

app.use('/', tasksRoutes);

app.use('/', loginRoutes);


// app.get('/', (req, res) => {
// 	if (req.session.loggedin == true) {
// 		let name = req.session.name;
		
//  		res.render('home', { name });
// 	} else {
// 		res.redirect('/login');
// 	}
// });


