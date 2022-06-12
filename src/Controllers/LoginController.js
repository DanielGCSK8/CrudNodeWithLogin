const bcrypt = require('bcrypt');

function index(req, res) {
    if (req.session.loggedin != true) {
        res.render('login/index');
        
    } else {
        res.redirect('/');
    }
}

function login(req, res) {
    if (req.session.loggedin != true) {
        // Output username
        res.render('login/register');

    } else {
        res.redirect('/');
    }
}

function register(req, res) {
    if (req.session.loggedin != true) {
        // Output username
        res.render('login/register');

    } else {
        res.redirect('/');
    }
}

function storeUser(req, res) {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if(userdata.length > 0) {
                res.render('login/register', { error: 'User already exists!'})
            } else {
                bcrypt.hash(data.password, 12).then(hash => {
                    data.password = hash;
                    req.getConnection((err, conn) => {
                            conn.query('INSERT INTO users SET ?', [data], (err, rows) => {
                                res.redirect('/');
                            });
                    });
            });
            }
        });
    });
  
}

function auth(req, res) {
    const data = req.body
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if (userdata.length > 0) {
                
                userdata.forEach(element => {
                    bcrypt.compare(data.password, element.password, (err, isMatch) => {
                    
                        if(!isMatch) {
                            console.log(req.body)
                            res.render('login/index', { error: 'Incorrect Password'});
                        } else {
                            req.session.loggedin = true;
                            req.session.name = element.name;

                            res.redirect('/');
    
                        }
                    });        
                });
              
            } else {
                res.render('login/index', {error: 'User not exists'});
            }

        });
    });
}

function logout(req, res) {
    if (req.session.loggedin == true) {
        req.session.destroy();
    }
    res.redirect('/login');
}


module.exports = {
    index,
    register,
    login,
    storeUser,
    auth,
    logout,
}