function index(req, res) {
  let name = req.session.name;
    req.getConnection((err, conn) => {
      conn.query('SELECT * FROM tasks', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('tasks/index', { tasks, name });
      });
    });
  }

function create(req, res) {
  let name = req.session.name;
    res.render('tasks/create', { name });
}

function store(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
      conn.query('INSERT INTO tasks SET ?', [data], (err, rows) => {
        res.redirect('/tasks');
      });
    });
  }

  function destroy(req, res) {
    const id = req.body.id;
  
    req.getConnection((err, conn) => {
      conn.query('DELETE FROM tasks WHERE id = ?', [id], (err, rows) => {
        res.redirect('/tasks');
      });
    })
  }

  function edit(req, res) {
    const id = req.params.id;
    let name = req.session.name;
  
    req.getConnection((err, conn) => {
      conn.query('SELECT * FROM tasks WHERE id = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('tasks/edit', { tasks, name });
      });
    });
  }

  function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    req.getConnection((err, conn) => {
      conn.query('UPDATE tasks SET ? WHERE id = ?', [data, id], (err, rows) => {
        res.redirect('/tasks');
      });
    });
  }

module.exports = {
    index: index,
    create: create,
    store: store,
    destroy: destroy,
    edit: edit,
    update: update
}