const handleProfile = (req,res,knex) => {
	const {id} = req.params;
	knex.select('*').from('users').where({id}).then(
		user => {
			if(user.length)
			{
				res.json(user[0]);
			}
			else {
				res.status(404).json("Id not found");
			}
		})
	.catch(err => res.status(404).json("Error in getting users"));
}


const updateProfile =  (req,res,knex) => {
	const {id} = req.params;
	const {name , age} = req.body;
	knex('users')
	.where({id})
	.update({name})
	.returning('*')
	.then(resp => {
		if(resp) {
			res.json({success: "updated", user: resp[0]})
		}
		else {
			res.status(400).json({failed: "unable to update"})
		}
	})
	.catch(err => {
		res.status(400).json({failed: "error updating data"})
	})
}

module.exports = {
	handleProfile: handleProfile,
	updateProfile: updateProfile
}