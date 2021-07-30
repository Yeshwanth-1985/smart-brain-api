const handleSignout = (req,res) => {
  	res.json({signout: "success"});				
}

module.exports = {
	handleSignout: handleSignout
}