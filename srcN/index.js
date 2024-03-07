var MongoClient= require('mongodb').MongoClient;
var assert=require('assert');
var ObjectId= require('mongodb').ObjectId;
var bodyParser= require('body-parser');	
var express = require('express'),
 	app=express();
 	server=require('http').createServer(app),
 	io= require('socket.io').listen(server),
 	app.use(bodyParser.urlencoded({extended:false}));
 	var mongo=require('mongodb');
 	books = {};
 	url='mongodb+srv://arti:arti1234@cluster0.yj4az.mongodb.net/?retryWrites=true&w=majority';

server.listen(9000, function(){
	var host= server.address().address;
	var port=server.address().port;

	console.log("save app listen on http://%s:%s", host , port);
});



app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection', function(socket){
	socket.on('new book', function(data , callback){
		if(data in users){
				callback(false);
		}else{
			callback(true);
			socket.bookname= data;
			books[socket.bookname]= socket;
			updatenames();
		}
	});
	
	io.sockets.on('send request', function(data , callback){
			var name=data;
			console.log(data);
	});


	socket.on('send message', function(data , callback){
		var msg=data.trim();
		if(msg.substr(0,3) === '/w '){
				msg = msg.substr(3);
				var	 ind = msg.indexOf(' ');
				console.log(ind);
				console.log("got it after ind ");
				if(ind !== -1)
				{
					var  name=msg.substr(0, ind);
					var msg=msg.substring(ind + 1);
					console.log(name);
					console.log(msg);
					if(name in users){
						console.log("got it in if name condition");
						users[name].emit('wishper', {msg: msg , nick: socket.nickname} );
					console.log('whisper..!	');
					} else
					{
						callback("enter a vlid user");
					}
				} else{
						callback('please enter message for your wishper');
				}
		}else {
		insertData(data);
		io.sockets.emit('new message', {msg: msg , nick: socket.nickname} );
		}	
	});	

	function updatenames(){
			io.sockets.emit('usernames', Object.keys(books));
	}

	function insertData(data)
	{	
	
			MongoClient.connect(url, function(err, db){
			console.log(data);
			db.collection('chat').save(data.msg , (err,result)=>{
				if(err){
					console.log("not inserted");
				}else {
					console.log("inserted");
				}
			});
		});
		
	}
	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		delete users[socket.nickname];
		updatenicknames();
	});
});