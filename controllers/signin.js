const handleSignin = (req,res,knex,bcrypt) => {
	const {email, password} = req.body;
	if(email && password){
	knex.select('email','hash').from('login').where({email})
		.then(data => {
			if(data.length)
			{
				if(bcrypt.compareSync(password,data[0].hash))
				{
						knex.select('*').from('users').where({email})
						.then(user => {
						res.json(user[0]);
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