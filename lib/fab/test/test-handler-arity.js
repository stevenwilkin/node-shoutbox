var
  PORT = 0xFAB,

  fab = require( "../" ),
  http = require( "http" ),
  assert = require( "assert" ),
  
  client = http.createClient( PORT ),
  server = http.createServer( 
  
    ( fab )
      ( "/onearg", function onearg( respond ) {
        assert.equal( onearg.length, 1 );
        assert.notEqual( this, respond );
        
        return this.url.pathname;
      } )
      ( "/twoargs", function twoarg( request, respond ) {
        assert.equal( twoarg.length, 2 );
        assert.equal( this, request );

        return this.url.pathname;
      } )
    ( fab )
  
  );
  
server.listen( PORT );

client
  .request( "/onearg" )
  .addListener( "response", function( response ) {
    response.addListener( "end", function(){
      client
        .request( "/twoargs" )
        .addListener( "response",  function() { server.close() })
        .close();
    })
  })
  .close();