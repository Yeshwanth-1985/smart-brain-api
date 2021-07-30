 const handleRegister = (req,res,knex,bcrypt,CryptoJS,generatetoken) => {
	let {email, username, password} = req.body;
	if(email && username && password){
	var bytes  = CryptoJS.AES.decrypt(password, "secret key 123");
	password = bytes.toString(CryptoJS.enc.Utf8);
	
	password = bcrypt.hashSync(password, 10);
	knex.transaction(trx => {
		trx.insert({
				hash: password,
				email: email
		})
		.into('login')
		.transacting(trx)
		.returning('email')
		.then(loginemail => {
			
			trx('users')
			.returning('*')
			.insert({
					email: loginemail[0],
					name: username,
					joined: new Date()
				})
			.then(user => {
				var token = generatetoken(user[0]);
				res.json({token, user: user[0]});
				})
			.catch(err => res.status(400).json("Email already exist, try another"));		
		})
	.then(trx.commit)
	.catch(trx.rollback);		
	})
	.catch(err => res.status(400).json("Cannot register due to errors"));
}
else {
	res.status(400).json("Error in the received data");
}
}

module.exports = {
	handleRegister: handleRegister
}