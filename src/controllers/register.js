const  handleRegister = (req, resp, db, bcrypt) =>
{
	
	if(req.body.user==='' || req.body.email==='' || req.body.password==='')
		{	console.log("Empty fields!!!!")
			resp.status(400).json("No bonus. Empty field");
			return false;
		}	

	db('users').select('id').where({name:req.body.user})
	.then(data=> {
		if(data[0] !== undefined)
		{
			console.log("No bonus. Name already exists. ID: "+data[0].id);
			resp.json("No bonus. Name already exists. ID: "+data[0].id);
			return false;
		}

		else
		{
			db('users').select('id').where({email:req.body.email})
			.then(ret_email=>{
				if(ret_email[0]!==undefined){
					console.log("No bonus.Email already exists. ID: "+ret_email[0].id);
					resp.json("No bonus. Email already exists. ID: "+ret_email[0].id);
					return false;
				}
				else
				{
						db.transaction( trx =>{
					//############################ START MODE 1 ################################################				
						/*return db('users').insert({
							name:req.body.user, 
							password:req.body.password, 
							email:req.body.email,
							ingress:new Date(),
							entries:0, 
							passwordhash:bcrypt.hashSync(req.body.password,2)
						}).returning(['email','passwordhash']).transacting(trx)
						.then(userlogin=>{
							return db('login').insert({
								email: req.body.email,
								passwordhash:bcrypt.hashSync(req.body.password,2)
							}).transacting(trx)
						})*/
					//############################# END MODE 1 ##################################################
					//############################# START MODE 2 ################################################
						return trx('users').insert({
							name:req.body.user, 
							password:req.body.password, 
							email:req.body.email,
							ingress:new Date(),
							entries:0, 
							passwordhash:bcrypt.hashSync(req.body.password,2)
						}).returning(['email','passwordhash'])
						.then(userlogin=>{
							return trx('login').insert({
								email: req.body.email,
								passwordhash:bcrypt.hashSync(req.body.password,2)
							})
						})
		//########################### END MODE 2 ##################################################
						.then(trx.commit)
						.catch(trx.rollback)
						.then((commit)=> {
							
							//else if(commit.sql==='ROLLBACK') console.log("DEU ROLLBACK!!!!!!!!!!!");
							if(commit.sql ==='COMMIT;') 
							{
								console.log("DEU COMMIT!!!!!!!!!!!!!!!!!");
								return db('users').select('name').where({name:req.body.user}).returning('*')
								.then((user)=> {
									if(user[0]!== undefined){ 
										console.log('user:::::::::::::::',user[0].name)
										resp.json("Sucess.Included");	
									}
									else{
										console.log('O nome nao foi validado na base');
										resp.status(400).json("No bonus");
										throw "IMPOSSIBLE VALIDATE";
									}
								})		 
							}
							else if(commit.sql==='ROLLBACK'){console.log("DEU ROLLBACK!!!!!!!!!!!!!")}	
						})				
						.catch((err)=>{
							console.log('Erro! Catch Msg:::::::',err);
						})
					})											
					.catch(err=> {
						console.log(err);
						resp.status(400).json("No bonus!Error! ");
					})	

				}
			})

				
		}		
	})
	.catch( err=> {
				console.log(err);
				resp.status(400).json("No bonus!Error2! ");
	})		
}
// exportando módulo
module.exports={
	handleRegister: handleRegister
}