var assert=require('assert');
var http = require('http');
var MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

function query1(db, res ){
	/* Find the name of the vessel with IMO 9306122, as a plain string. */
	
	res.writeHead(200, {'content-type': 'text/plain'});
	res.end('Nothing');

}
	

function query2(db, res ){
	/* Return the number of vessels in the collection, as a plain string. */

	res.writeHead(200, {'content-type': 'text/plain'});
	res.end('Nothing');

}

function query3(db, res){

	/* Return all vessels sailing under Japanese flag, with tonnage >= 150,000, as a JSON array of documents */

	res.writeHead(200, {'content-type': 'text/plain'});
	res.end('[]');

}
	

function query4(db, res){

	/* Find distinct countries with owners of ships sailing under Japanese flag and tonnage >= 150,000, as a JSON array of strings. */

	res.writeHead(200, {'content-type': 'text/plain'});
	res.end('[]');

}


function query5(db, res){

	/* Return the codes of those owners with total fleet tonnage >= 5,000,000, as a JSON array of codes. */

	res.writeHead(200, {'content-type': 'text/plain'});
	res.end('[]');
}
	



http.createServer( function (req, res){


	const client = new MongoClient(url, {'useNewUrlParser': true} );
	
	client.connect( function(err){

		if (err ){
			console.log(err);
		} else {
			const db = client.db('DenmarkTraffic') ;

			if (req.url == '/query1'){
				query1(db,  res );	
			} else if (req.url == '/query2'){
				query2( db, res );
			} else if (req.url == '/query3'){
				query3( db, res );
			} else if (req.url == '/query4'){
				query4( db, res );
			} else if (req.url == '/query5'){
				query5( db, res );
			} else {
				res.writeHead(400, {'Content-Type': 'text/plain'});
				res.write('Unknown query');
				res.end();
			}
		}
	});

}).listen( 8124 );

console.log("Server running on 8124.");

