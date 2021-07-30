const updatePassword = (req,res,knex,bcrypt,CryptoJS) => {

if(req.body.curpassword && req.body.newpassword) {

let {curpassword, newpassword} = req.body;

curpassword = CryptoJS.AES.decrypt(curpassword, 'secret key 123').toString(CryptoJS.enc.Utf8);
newpassword = CryptoJS.AES.decrypt(newpassword, 'secret key 123').toString(CryptoJS.enc.Utf8);


knex.select('*').from('login').where({email: req.user.email}).then(
	user => {
			if(user.length) {
				if(bcrypt.compareSync(curpassword,user[0].hash))
				{
					knex('login')
					.where({email: req.user.email})
					.update({hash: bcrypt.hashSync(newpassword, 10)})
					.returning('*')
					.then(resp => {
						if(resp) {
							res.json({success: "updated"})
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
					res.status(400).json({failed: "error in password"});
				}
			}
			else {
				res.status(400).json({failed: "no user found"});
			}
		})
		.catch(err => res.status(400).json({failed: "error connecting data"}));
}

else {
	res.status(400).json({failed: "error in the data"});
}
}

module.exports = {
	updatePassword: updatePassword
}