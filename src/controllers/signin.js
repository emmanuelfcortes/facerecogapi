const  handleSignin = (db, bcrypt) => (req, resp) =>
{
	//O email e o password podem ser declarados desta forma 
	//const {email, password} = req.body;
	const user_email = req.body.user;
	const pass=req.body.password;
	console.log(user_email, pass);
	db('login').select('passwordhash', 'email').where({email: user_email})
	.then(hash=> {
		console.log(hash);
		if(hash[0]!==undefined)
			{
				if( bcrypt.compareSync(pass,hash[0].passwordhash) ) {
					db('users').select('id','name','entries').where({email:hash[0].email})
					.then(data=> {
						resp.json(data);
					})
				}
				else{
					resp.json('No bonus!');
				}
			}
		else{
			console.log('email or password not found.')
			resp.json('No bonus!');
		}	

	});
}
// exportando módulo
module.exports={
	handleSignin: handleSignin
}
