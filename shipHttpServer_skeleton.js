var assert=require('assert');
var http = require('http');
var MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

function query1(db, res ){
	/* Find the name of the vessel with IMO 9306122, as a plain string. */
	db.collection('vessels').findOne({ IMO: 9306122 }, { _id: 0, Name: 1 }, function( err, ship ){
		if(err) console.log(err);
		else {
			res.writeHead(200, { 'content-type': 'text/plain' });
			res.end(ship.Name);
		}
	});
}
	

function query2(db, res ){
	/* Return the number of vessels in the collection, as a plain string. */
	db.collection('vessels').countDocuments( function (err, count) {
		if (err) console.log(err);
		else {
			res.writeHead(200, { 'content-type': 'text/plain' });
			res.end(count.toString());
		}
	});
}

function query3(db, res){

	/* Return all vessels sailing under Japanese flag, with tonnage >= 150,000, as a JSON array of documents */
	db.collection('vessels').find({ Flag: "Japan", Tonnage: { $gte: 150000 } }).toArray( function( err, shipDocs ){
		if (err) console.log(err);
		else {
			res.writeHead(200, { 'content-type': 'text/plain' });
			res.end(JSON.stringify( shipDocs ));
		}
	});
}
	
function query4(db, res){

	/* Find distinct countries with owners of ships sailing under Japanese flag and tonnage >= 150,000, as a JSON array of strings. */
	db.collection('vessels').aggregate([
		{$match: {Tonnage: {$gte: 150000}, Flag: "Japan", Owner: {$ne: null}}},
		{$lookup: {
			from: 'clients',
			localField: 'Owner',
			foreignField: 'code',
			as: 'embeddedOwner'
		}},
		{$project: {_id: 0, 'embeddedOwner.country': 1}},
		{$group: {_id: "$embeddedOwner.country"}}
	]).toArray( function(err, docs){
		if (err) console.log(err);
		else {
			var countries = [];
			docs.forEach(function(doc){
				countries.push( doc._id[0])
			});
			res.writeHead(200, { 'content-type': 'text/plain' });
			res.end( JSON.stringify( countries ));
		}
	});

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

