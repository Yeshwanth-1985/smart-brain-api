const handleSignin = (req,res,knex,bcrypt,CryptoJS,generatetoken) => {
	let {email, password} = req.body;
	if(email && password){
	var bytes  = CryptoJS.AES.decrypt(password, 'secret key 123');
	password = bytes.toString(CryptoJS.enc.Utf8);
	knex.select('email','hash').from('login').where({email})
		.then(data => {
			if(data.length)
			{
				if(bcrypt.compareSync(password,data[0].hash))
				{
						knex.select('*').from('users').where({email})
						.then(user => {
						var token = generatetoken(user[0]);
						res.json({token, user: user[0]});
						})
						.catch(err => res.status(400).json("cannot signin db"));				
				}
				else {
					res.status(400).json("Email and Password details doesnt match");	
				}				
			} 
			else {
				res.status(400).json("Email not found");
			}
		})
		.catch(err => res.status(400).json("Cannot signin"));
	}
	else {
	res.status(400).json("error in the received data");
	}
}

module.exports = {
	handleSignin: handleSignin
}