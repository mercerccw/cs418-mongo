var http=require('http');
var assert=require('assert');


var options = {
	hostname: 'localhost',
	port: 8124,
	path: '',
	method: 'GET',
	headers: {
		'Content-Type': 'text/plain'
	}

}


function query( path, test ){
	
	options['path']=path;

	http.request( options, function(resp ){

		console.log(resp.statusCode);
		resp.setEncoding('utf8');
		resp.on('data', function( chunk ){
			test(chunk);
		});
	}).end();
}


describe('Vessels', function(){


	describe("One vessel: Name from IMO", function(){
		it('query1', function(done){
			query( '/query1', function( name ){

				assert.equal( name, 'Tanzanite');
				done();
			});
		});
	});


	describe("Count vessels", function(){
		it('query2', function(done){
			query( '/query2', function(data){
				assert.equal( data, 57544);
				done();
			});
		});
	});



	describe("Vessels under Japanese flag with Tonnage >= 150,000", function(){
		it('query3', function(done){
			query( '/query3', function(data){
				var ships =  JSON.parse(data) ;	
				assert( Array.isArray( ships ));
				var IMOs = [];
				ships.forEach( function (s){
					IMOs.push(s.IMO);
				});
				console.log(IMOs);
				assert.deepEqual( IMOs,
				[9568809, 9689615, 9320831, 9321213, 9321304, 9322023, 9454486,
				 9454498, 9323572, 9567659, 9325295, 9329863, 9398151, 9334894,
				 9339997, 9343388, 9607875, 9478664, 9478676, 9313137, 9562685,
				 9503249, 9376878, 9251951, 9259367, 9391751, 9264893, 9662875,
				 9662887, 9294240, 9689603]);

				done();
			});
		});
	});



	
	describe("All distinct countries of owners of Japanese vessels with tonnage >= 150000", function(){
		it('query4', function(done){
			query( '/query4', function(data){
				console.log(data);
				var owners =  JSON.parse(data) ;	
				assert.deepEqual( owners, ['Denmark', 'Singapore', 'Japan']);

				done();
			});
		});
	});

	describe("Codes of those owners have a total fleet tonnage >= 5000000", function(){
		it('query5', function(done){
			query( '/query5', function(data){
				console.log(data);
				var owners =  JSON.parse(data) ;	

				assert.deepEqual( owners, [900, 1103, 974, 1727, 1175, 4727,
						 1248, 901, 387, 766, 299, 1113, 4715, 940, 884]);

				done();
			});
		});
	});

});
