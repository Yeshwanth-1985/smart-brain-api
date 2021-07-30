const express = require('express');
const app = express();
const cors = require('cors');
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const bcrypt = require('bcrypt');
const saltRounds = 10
const salt='yesh';

const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
  }
});

const signin = require('./controllers/signin.js');
const register = require('./controllers/register.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');
const signout = require('./controllers/signout.js');
const changepass = require('./controllers/changepass.js');

app.get('/', (req,res) => {
	res.send("welcome all");
});

app.post('/signin',(req,res) => {signin.handleSignin(req,res,knex,bcrypt,CryptoJS,generatetoken)});

app.post('/register',(req,res) => {register.handleRegister(req,res,knex,bcrypt,CryptoJS,generatetoken)});

app.get('/profile/:id',Auth,(req,res) => {profile.handleProfile(req,res,knex)});

app.post('/profile/:id',Auth,(req,res) => {profile.updateProfile(req,res,knex)});

app.put('/image',Auth,(req,res) => {image.handleImage(req,res,knex)});

app.post('/imageurl',Auth,(req,res) => {image.handleApiCall(req,res)});

app.post('/changepass',Auth,(req,res) => {changepass.updatePassword(req,res,knex,bcrypt,CryptoJS)});

app.post('/signout',Auth,(req,res) => {signout.handleSignout(req,res)});

app.post('/refresh',Auth,(req,res) => {
  knex.select('*').from('users').where({email: req.user.email}).then(
    user => {
      if(user.length)
      {
        res.json({user: user[0]});
      }
      else {
        res.status(404).json("Id not found");
      }
    })
  .catch(err => res.status(404).json("Error in getting users"));
});

const generatetoken = (data) => {
  var token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
  return token;
}

function Auth (req,res,next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null)
    res.status(400).json("invalid token")

   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, result) => {
    if(err)
      res.status(400).json("invalid token");
    if(result.id) {
      req.user=result;
      next();
    }
    else {
      res.status(400).json("invalid token redis");
    }
    })
}


app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
});