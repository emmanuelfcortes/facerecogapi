
//########REQUIRE CONTROLLERS#######################################
const signin = require('./controllers/signin');
const register=require('./controllers/register');
const entries=require('./controllers/entries');
const clarifai=require('./controllers/clarifai');
//#########END CONTROLLERS##########################################
const express = require("express"); // biblioteca para facilitar o trabalho de servidor
const app= express();// iniciar server express
const bodyParser= require("body-parser"); // middleware para tratamento da entrada json
const bcrypt=require("bcrypt") // biblioteca para encriptação
const fs = require("fs"); // biblioteca de file system
const cors=require("cors"); // biblioteca para trabalhar com o CORS-HTTP
const knex=require("knex")({ //url da biblioteca knex => https://knexjs.org/
	client:'pg',// postgres
	connection:{
		host:'ec2-23-23-216-40.compute-1.amazonaws.com',
		user:'spzihmynvtoqwn',
		password:'64eb6ba7eb62b2161d8f934d51d4395a1aa84b4a80c089ddcce4c102631c7802',
		database:'d23dcusqi7ib1a'
	}
});

/*
const knex=require("knex")({ //url da biblioteca knex => https://knexjs.org/
	client:'pg',// postgres
	connection:{
		host:'127.0.0.1',
		user:'adm',
		password:'123',
		database:'facerecog'
	}
});*/

const db=knex;
app.use(bodyParser.json());// middleware that transform the frontend recept data in JSON format.
app.use(cors());

// criando os bds USERS  e LOGIN =======================================

db.schema.createTable('users', users => {
	users.increments('id').primary().unique();
	users.string('name',100);
	users.string('password',30);
	users.string('email', 50).unique();
	users.biginteger('entries');
	users.string('ingress');
	users.string('passwordhash');

}).then(resp=>console.log("===============>>>>>>>USERS WAS CREATED<<<<<<================",resp))
  .catch(err => console.log(err));

db.schema.createTable('login', login=>{
	login.increments('id').primary().unique();
	login.string('email');
	login.string('passwordhash');
}).then(resp=>console.log("===============>>>>>>>LOGIN WAS CREATED<<<<<<================",resp))
  .catch(err => console.log(err));

//=====================================================================

app.get("/", (req, resp)=>{
	//console.log("123")
	
	resp.json("This is working man!!!!!!");

})
	
//utilizando modos diferentes de chamar os controllers
app.post('/signin', signin.handleSignin(db, bcrypt))
//req e resp são implicitos e não precisam ser declarados na chamada. Eles serão declarados apenas no próprio componente; 
	 
app.post("/register", (req, resp)=> { register.handleRegister(req, resp, db, bcrypt)})
app.post("/image", (req,resp)=>{clarifai.handleImageAsk(req,resp)})

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
app.put("/entries", (req, resp)=> { entries.handleEntries(req,resp,db)
	//const {id} = req.params;
	
})
	
app.listen(process.env.PORT || 3000, ()=>{
	console.log("Its working on port "+process.env.PORT+" ...");
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