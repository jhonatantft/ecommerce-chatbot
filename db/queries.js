const { Client, Pool } = require('pg')

const pool = new Pool({
  user: 'jhonatan',
  host: 'localhost',
  database: 'ebot',
  password: 'jhonatan',
  port: 5432
});

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

const getUserByUsername = (request, response) => {
  pool.query('SELECT * FROM users WHERE username = $1', [request.params.username], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

const createUser = (request, response) => {
  const {
    firstname,
    lastname,
    email,
    password_,
    username
  } = request.body

  pool.query(`INSERT INTO users 
    (firstname, lastname, email, password_, username)
    VALUES ($1, $2, $3, $4, $5)`, [firstname, lastname, email, password_, username], (error, results) => {
    if (error) {
      throw error
    }
    response.cookie('ebot-user', JSON.stringify({
      firstname,
      lastname,
      email,
      password_,
      username
    }), { maxAge: 900000 });
    response.status(201).send({
      message: 'user created',
      body: {
        firstname,
        lastname,
        email,
        password_,
        username
      }
    })
  })
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { firstname, lastname, email, password_, username} = request.body

  pool.query(`UPDATE users
    SET firstname = $1, lastname = $2, email = $3, password_ = $4, username = $5 WHERE id = $6`,
    [firstname, lastname, email, password_, username, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
};

const getProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

module.exports = {
  getUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  getProducts
};