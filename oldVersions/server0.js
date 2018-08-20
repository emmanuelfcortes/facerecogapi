const express = require("express");
const app= express();
const bodyParser= require("body-parser");
const bcrypt=require("bcrypt")
const fs = require("fs");
const cors=require("cors");

/*this sintaxe of knew its the same to call a function after declaration

var postgres= knex({
	client:'pg',
	connection:{
		host:'127.0.0.1',
		user: 'adm',
		password:'123',
		database:'facerecog'
	}
});

*/
var filejson;



//Add or delete parameters in JSON file userhash.txt//
/*fs.readFile("./users.txt", (err,data)=>
	{
		if(err){
			console.log('Read file error!', err);
			return err;
		}
		filejson=JSON.parse(data);
		let i=0;
		//let register="new";
		
		for(i=0; i<filejson.users.length; i++){

			
			filejson.users[i].passwordhash=bcrypt.hashSync(filejson.users[i].password, 2);
			//filejson.users[i].id=i;
			//filejson.users[i].ingress=new Date();

		}
			
			fs.writeFile("./usershash.txt", JSON.stringify(filejson), (err) => {
				if(err)
				{
					console.log('Error in store the hash.',err);
				}
				else
				{
					console.log("Sucess in register the hashs");
				}
			});
			
		
			
	});*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////UTILIZANDO ARQUIVOS TXT E JSON PARA MANIPULAR AS INFORMACOES///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(bodyParser.json());// middleware that transform the frontend recept data in JSON format.
app.use(cors());

app.get("/", (req, resp)=>{
	//console.log("123")
	
	resp.json("This is working man!!!!!!");

})

	

app.post('/signin', (req, resp) =>{
	
	fs.readFile("./usershash.txt", (err,data)=>
	{
		if(err){
			console.log('Read file error!', err);
			return err;
		}
		filejson=JSON.parse(data);
		let i=0;
		let login="fail";
		
		for(i=0; i<filejson.users.length; i++){

			if(req.body.user === filejson.users[i].user && bcrypt.compareSync(req.body.password, filejson.users[i].passwordhash)) //&& req.body.password === filejson.users[i].password)
				{
					resp.json('Sucess! Welcome '+ req.body.user);
					i=filejson.users.length;
					login="sucess";
				}
		}
		if(login==="fail") {
			resp.status(400).json('No bonus signin! '+req.body.user+' e '+ req.body.password);
		}
			
	});
	
})



app.post("/register", (req, resp)=> {
	//resp.send(resp.json("Registering!"));// Response in no JSON format
	//resp.json('Json!!!! Json');// Response in JSON format.
	fs.readFile("./usershash.txt", (err,data)=>
	{
		if(err){
			console.log('Read file error!', err);
			return err;
		}
		filejson=JSON.parse(data);
		let i=0;
		let register="new";
		
		for(i=0; i<filejson.users.length; i++){

			if(req.body.user === filejson.users[i].user)
				{
					resp.status(400).json('No bonus. The name of user already exists!('+ req.body.user+')');
					i=filejson.users.length;
					register="exists";
				}
		}
		if(register==="new") {
			//const newuser='{ "user": "'+ req.body.user+'","password": "'+req.body.password+'"}';
			const newuser={ user: req.body.user, 
							password: req.body.password,
							email:req.body.email,
							passwordhash: bcrypt.hashSync(req.body.password, 2),
							id:filejson.users.length,
							entries:0,
							ingress:new Date()
			};
			filejson.users.push(newuser);
			
			//filejson.users[filejson.users.length].password=req.body.password;
			fs.writeFile("./usershash.txt", JSON.stringify(filejson), (err) => {
				if(err)
				{
					resp.status(400).json('Error in store the register.',err);
				}
				else
				{
					resp.json("Sucess in register the user: "+req.body.user);
				}
			});
			
		}
			
	});
});


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


app.put("/photo:id", (req, resp)=> {
	const {id} = req.params;
	let exists="nao";
	fs.readFile("./usershash.txt", (err,data)=>
	{
		if(err){
			console.log('Read file error!', err);
			return err;
		}
		filejson=JSON.parse(data);
		var i=0;
				
		for(i=0; i<filejson.users.length; i++){

			if(JSON.parse(id) === filejson.users[i].id)
				{
					
					exists="sim";
					let current_entrie= ++filejson.users[i].entries;
					let current_user = filejson.users[i];
					fs.writeFile("./usershash.txt", JSON.stringify(filejson), (err) => {
						if(err)
						{
							return resp.status(400).json('Error in store the register.',err);
						}
						else
						{
							return resp.json( current_user);
						}
					});
					//i=filejson.users.length;
				}
		}
		if(exists==="nao") {
			resp.status(400).json('No bonus. The Id not exists!('+ req.body.user+')');
					i=filejson.users.length;
					register="exists";
			
		}
			
	});
});

//console.log("Its working...");


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