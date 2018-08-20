/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////INSERÇÃO DOS REGISTROS DO ARQUIVO "usershash.txt" (JSON) NO BANCO DE DADOS POSTGRES//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
const express = require("express");
const app= express();
const bodyParser= require("body-parser"); // middleware para tratamento da entrada json
const bcrypt=require("bcrypt") // biblioteca para encriptação
const fs = require("fs"); // biblioteca de file system
const cors=require("cors"); // biblioteca para trabalhar com o CORS-HTTP
const knex=require("knex")({ //url da biblioteca knex => https://knexjs.org/
	client:'pg',// postgres
	connection:{
		host:'127.0.0.1',
		user: 'adm',
		password:'123',
		database:'facerecog'
	}
});
const db=knex;
/*this sintaxe of knew its the same to call a function after declaration

var db= knex({
	client:'pg',
	connection:{
		host:'127.0.0.1',
		user: 'adm',
		password:'123',
		database:'facerecog'
	}
});

*/



/*
var filejson;


fs.readFile("./usershash.txt", (err,data)=>
	{
		if(err){
			console.log('Read file error!', err);
			return err;
		}
		filejson=JSON.parse(data);
		let i=0;
		for(i=0; i<filejson.users.length; i++){

			db('users').insert(
				{ 	name:filejson.users[i].user, 
					password:filejson.users[i].password,
					email:filejson.users[i].email, 
					ingress:filejson.users[i].ingress,
					passwordhash:filejson.users[i].passwordhash
				}
			).then(console.log)
			
		}
	}
)
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//db('users').select('*').then(console.log);
//db('users').insert({name:"Ana", password:"ana123", email:"ana@gmail.com" , ingress:new Date(), passwordhash:bcrypt.hashSync("ana123", 2)}).then(console.log);

//db('users').select('*').where({name:'Ana', id:2, password:'ana123'}).then(data=>console.log(data));
//db('users').where('name','Ana').select('*').then(console.log);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////INICIALIZAÇÃO DO APP (EXPRESS SERVER)//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//################################################################################################
/*/////////////////// FULL THE DATABASE 'LOGIN' with DATABASE 'USERS'/////////////////////////////
//###############################################################################################

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////INSERCAO SEM TRANSACTION /////////////////////////////

/*db('users').select('passwordhash', 'email')
.then(emailpass=>{
	emailpass.forEach( (element)=> { 
		db('login')
		.insert({ passwordhash: element.passwordhash, email:element.email})
	.then(result=> console.log(result))
	})
}).catch(err => console.log(err))*/
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


////////////////////////////INSERCAO COM TRANSACTION /////////////////////////////
//OBS:. NÃO FUNCIONOU UTILIZANDO emailpass.map() ou emailpasss.forEach() e colocando a funcao
//no corpo da funcao de iteracao

	//################## versao 1 da function transactioning() - OK #####################################
	/*function transactioning(element){
		db.transaction(trx=> {
			return db('login').insert({ passwordhash: element.passwordhash, email:element.email})
			.transacting(trx)
			.then(trx.commit)
			.catch(trx.rollback)
		})
	}*/
////////////#####################////////////////////////////////////////////////////////////////

//###############versao 2 da function transactioning() - OK #######################################
/*function transactioning_login(element){
		db.transaction(trx=> {
			return trx('login').insert({ passwordhash: element.passwordhash, email:element.email})
		})
		.then(ret=>console.log(ret))
		.catch(err=>console.log('Erro! No bonus!', err))
}*/

//##################################################################################################

	//############################	CHAMADA PRINCIPAL DA TRANSICAO ###################### 
	/*
	db('users').select('passwordhash', 'email')
	.then(emailpass=> {
		return emailpass.map( (element)=> { 
			return transactioning_login(element);
		})	
	}).catch(err => console.log(err))
	*/

/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////		  
		 



app.use(bodyParser.json());// middleware that transform the frontend recept data in JSON format.
app.use(cors());

app.get("/", (req, resp)=>{
	//console.log("123")
	
	resp.json("This is working man!!!!!!");

})

	

app.post('/signin', (req, resp) =>{
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
})
	//bcrypt.compareSync(req.body.password, filejson.users[i].passwordhash)

	/////db('login').select('email').where({email: user_email, passwordhash: passhash})
	//////. then(loginuser=> { console.log(loginuser)
		/*if(loginuser===undefined){
			resp.json("No bonus.");
		}
		else{
			return db('users').select('id', 'name', 'entries').where({email:loginuser[0].email})	
		}
	})
	.then(data=>{
		if(data[0] !== undefined)
		{
			resp.json(data);
			
		}
		else
			resp.json("No bonus.");
	});
	*/
	/////	})

//###############################REGISTER WITH TRANSACTION##################################
//###############versao 2 da function transactioning() - OK #######################################
/*function transactioning_login(element){
		db.transaction(trx=> {
			return trx('login').insert({ passwordhash: element.passwordhash, email:element.email})
		})
		.then(ret=>console.log(ret))
		.catch(err=>console.log('Erro! No bonus!', err))
}*/

//##################################################################################################

	//############################	CHAMADA PRINCIPAL DA TRANSICAO ###################### 
app.post("/register", (req, resp)=> {
	
	db('users').select('id').where({name:req.body.user})
	.then(data=>{
		if(data[0] !== undefined)
		{
			resp.json("No bonus. Login already exists. ID: "+data[0].id);
		}
		else
		{
			db.transaction( trx=> { 
				trx('users').insert({	

					name:req.body.user, 
					password:req.body.password, 
					email:req.body.email,
					ingress:new Date(),
					entries:0, 
					passwordhash:bcrypt.hashSync(req.body.password, 2)
				})
				.then(trx.commit)
				.catch(trx.rollback)
				.then((commit)=> {
					
					//else if(commit.sql==='ROLLBACK') console.log("DEU ROLLBACK!!!!!!!!!!!");
					//console.log('commit',commit); 
					//console.log('commit',commit); 
					
					if(commit.sql ==='COMMIT;') 
					{
						console.log("DEU COMMIT!!!!!!!!!!!!!!!!!");
						return db('users').select('name').where({name:req.body.user}).returning('*')
						.then((user)=> {
							if(user!== undefined){ 
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
	.catch( err=> {
				console.log(err);
				resp.status(400).json("No bonus!Error2! ");
	})		
	
})
	
/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//###########################################################################################

//##############################REGISTER WITHOUT DB.TRANSACTION######################################



/*app.post("/register", (req, resp)=> {
	
	db('users').select('id').where({name:req.body.user})
	.then(data=>{
		if(data[0] !== undefined)
		{
			resp.json("No bonus. Login already exists. ID: "+data[0].id);
		}
		else
		{
			 cool write:
				db('users') // table 'users' in database 'facerecog'
				.returning('*') // retorna todas as colunas apos a insercao
				.insert({
					email:email,
					name:name,
					password: req.body.password,
					passwordhash: bcrypt.hashSync(req.body.password, 2)
					ingress: new Date()
				})
				.then(insertedUser =>{
					res.json(insertedUser);
				}).catch(error => res.status(400).json(error));
			



			db('users').insert(
				{	name:req.body.user, 
					password:req.body.password, 
					email:req.body.email,
					ingress:new Date(),
					entries:0, 
					passwordhash:bcrypt.hashSync(req.body.password, 2)
				}
			).then(	data=>{ 
				if(data.rowCount===1){
					resp.json("Sucess.Included");	
				}
				
				
			}).catch(err=> {
				console.log(err);
				resp.json("No bonus!Error! "+err);
			})
		}		
			

	});
	
})
*/
//#################################################################################################

app.get("/profile:id", (req, resp)=>{
	
	const {id} = req.params;
	//resp.json(id);
	fs.readFile("./usershash.txt", (err,data)=>
	{
		if(err) {
			console.log('Read file error!', err);
			return err;
		}

		filejson=JSON.parse(data);
		let i=0;
		let login="fail";
		for(i=0; i<filejson.users.length; i++){
			//resp.json('id:'+params.id+' idback:'+filejson.users[i].id);
			if(JSON.parse(id) === filejson.users[i].id) {
					login="ok";
					resp.json(filejson.users[i]);
				}
		}
		if(login==="fail") {
			
			resp.status(400).json('No ID found!');
		}
			
	});
});

//app.put("/entries:id", (req, resp)=> {
app.put("/entries", (req, resp)=> {
	//const {id} = req.params;
	let exists="nao";

	//db('users').where({id: {id}}).update({entries:req.body.entries})
	/*-------------- E POSSIVEL FAZER O INCREMENTO DIRETO AQUI PELO SERVER-SIDE
	---> 	db('users').where('id','=',id)
	--->	.increment('entries',1).returning('entries')
	--->	.then(entries=> {console.log('Entries:', entries)})
	--->	.catch(err => res.status(400).json('unable to get entries', err))
	--->
	--->
	*/

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
})
	
app.listen(3000, ()=>{
	console.log("Its working on port 3000...");
});

/*
SERVER PLANE:
1 -'/' --> GET --> resp = 'This is working'
2 -'/signin' --> POST --> resp= sucess / fail
3 -'/register' --> POST --> resp = user (POST is used to create a new register)
4 -'/profile' --> GET --> resp= user (GET is used to acess an existed register)
5 -'/photo --> PUT --> resp=user (PUT is used to update a register)
OBS: GET, POST, PUT and DELETE are methods in HTTP Protocol. 
An API RESTful use this to communicate between client and server.

	*/