const fs = require('fs');

const file = fs.readFileSync('./script2.js').toString();

console.time('challenge');
const my = file.split('');

const acc = my.reduce((acc,i) => {
	acc = (i === '(') ? acc+1 : acc-1;
	return acc;
}, 0)
console.log(acc);

console.timeEnd('challenge');

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const database = {
	users: [
	{
		id: '123',
		name: 'john',
		email: 'john@example.com',
		password: 'rgukt123',
		entries: 0,
		joined: new Date()
	
	},
	{
		id: '124',
		name: 'sally',
		email: 'sally@example.com',
		password: 'rahul123',
		entries: 0,
		joined: new Date()
	
	}
	],
	login: [
	{
		id: '123',
		hash: '',
		email: ''
	}]
}

app.get('/', (req,res) => {
	res.send(database.users);
});

app.post('/signin', (req,res) => {
	bcrypt.compare("bugga123", '$2a$10$udzgChr4b5TCP2yN./6DwejLY28mbgY83hJPG91dLD7/XTY/tLt8y', function(err, res) {
    console.log('first guess',res);
});

	bcrypt.compare("rgukt123", '$2a$10$rSx8VmiBUu.OEEwstcXQDeIANs6egsnRLrM2sbxrKZcylvBb5R.AK', function(err, res) {
    console.log('second guess',res);
});
	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password){
	res.json("success");	
	}
	else {
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req,res) => {
	const {email, name, password} = req.body;
	bcrypt.hash(password, null, null, function(err, hash) {
    if(err)
    	console.log(err);
    else
    	password = hash;
    console.log(hash);
});

	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.send(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req,res) => {
	const {id} = req.params;
	database.users.forEach(user => {
		if(user.id === id)
			return res.json(user);
	});
	res.status(404).json("no user record found");
});

app.post('/image/:id', (req,res) => {
	const {id} = req.params;
	database.users.forEach(user => {
		if(user.id === id)
		{
			user.entries += 1;
			return res.json(user);
		}
	});
	res.status(404).json("no user record found");
});

app.listen(3000, () => {
	console.log("app is running on port 3000");
});

/*
bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
});

// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});
*/