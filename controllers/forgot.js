const handleForgot = (req,res,knex) => {
	const {email, username} = req.body;
	if(email && username) {
	knex.select('*').from('users').where({email}).then(
		user => {
			if(user.length)
			{
				if(user[0].name == username){
					res.json({success: user[0].id});
				}
				else {
					res.json({failed: "failed"});	
				}
			}
			else {
				res.status(404).json("User not found");
			}
		})
	.catch(err => res.status(404).json("Error in getting users"));
	}
	else {
		res.status(404).json("Error in getting users");	
	}
}

const handleReset = (req,res,knex,bcrypt,CryptoJS,generatetoken) => {
	let {email, password} = req.body;
	if(email && password)
	{
		var bytes  = CryptoJS.AES.decrypt(password, "secret key 123");
		password = bytes.toString(CryptoJS.enc.Utf8);
		knex('login')
		.where({email: email})
		.update({hash: bcrypt.hashSync(password, 10)})
		.returning('*')
		.then(resp => {
				if(resp.length) {
					var token = generatetoken(resp[0]);
					res.json({success: "updated"});
					}
				else {
					res.status(400).json({failed: "unable to update"})
					}
		})
		.catch(err => {
			res.status(400).json({failed: "error updating data"})
		})
	}
	else {
	res.status(400).json("error in the received data");
	}
}


module.exports = {
	handleForgot: handleForgot,
	handleReset: handleReset
}