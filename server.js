const express = require('express');
const app = express();
const cors = require('cors');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'postgresql-deep-65513',
    user : 'postgres',
    password : 'rgukt123',
    database : 'smart-brain'
  }
});

const signin = require('./controllers/signin.js');
const register = require('./controllers/register.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const bcrypt = require('bcrypt');
const saltRounds = 10
const salt='yesh';

app.get('/', (req,res) => {
	res.send("welcome all");
});

app.post('/signin', (req,res) => {signin.handleSignin(req,res,knex,bcrypt)});

app.post('/register',(req,res) => {register.handleRegister(req,res,knex,bcrypt)});

app.get('/profile/:id', (req,res) => {profile.handleProfile(req,res,knex)});

app.put('/image', (req,res) => {image.handleImage(req,res,knex)});

app.post('/imageurl', (req,res) => {image.handleApiCall(req,res)});

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
});