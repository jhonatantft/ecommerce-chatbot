const express = require('express');
const router = express.Router(); 
const favicon = require('serve-favicon');
const mustacheExpress = require('mustache-express');
const app = express();
const mustache = mustacheExpress();
const home = require('./routes/home');
const db = require('./db/queries');
const bodyParser = require('body-parser');

require('dotenv').config();

mustache.cache = null;
app.engine('mustache', mustache);
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views');
app.use(express.static('public'));

// app.use(favicon(__dirname + '/public/img/favicon.png'));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))

app.use('/', home);

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.get('/users/username/:username', db.getUserByUsername)

app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)

app.get('/products', db.getProducts)


app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}.`);
});