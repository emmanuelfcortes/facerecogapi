const  handleEntries = (req, resp, db) =>
{
	let exists="nao";

	db('users').where({name: req.body.user}).update({entries:req.body.entries})
	.then(update_resp=>{
		if(update_resp.rowCount===1){
			resp.json("Sucess.Included");	
		}
		/*else
		{
			resp.json("No bonus! Not Included");			
		}*/		
	}).catch(err=> {
		console.log(err);
		resp.json("No bonus!Error! "+err);
	});
}
// exportando módulo
module.exports={
	handleEntries: handleEntries
}