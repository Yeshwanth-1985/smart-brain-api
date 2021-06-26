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

module.exports = {
	handleProfile: handleProfile
}