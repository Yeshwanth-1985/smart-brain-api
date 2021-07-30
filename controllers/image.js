const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: process.env.Clarifai_key
});

const handleApiCall = (req,res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json("unable to work with API"));
}

const handleImage = (req,res,knex) => {
	const {id} = req.body;
	knex('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(data => {
  	if(data.length){
  	res.json(data);
  	}
  	else {
  	res.status(404).json("Id not found");	
  	}
  })
  .catch(err => res.status(404).json("Error in setting entries"));
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}
