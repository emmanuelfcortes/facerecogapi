const handleImageAsk = (req,resp) => {
	const Clarifai = require('clarifai');

// initialize with your api key. This will also work in your browser via http://browserify.org/

	const app = new Clarifai.App({
 	apiKey: 'eb111d6da5ac4193857b3f0c9fa76aec' // its my count key  in Clarifai: www.clarifai.com
	});

	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.url).then((coordinates)=>{
		resp.json(coordinates);
	}).catch(err => {console.log("Error in Clarifai Img!", err)})

}
module.exports={
	handleImageAsk:handleImageAsk
}


