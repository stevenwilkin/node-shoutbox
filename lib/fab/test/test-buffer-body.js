var
  PORT = 0xFAB,

  fab = require( "../" ),
  http = require( "http" ),
  assert = require( "assert" ),
  
  handler = function( respond ) {
    respond( "one" );
    respond( "two" );
    respond( "three" );
    respond( null );
  },
  
  unbufferedCount = 3,
  bufferedCount = 1,
  
  client = http.createClient( PORT ),
  server = http.createServer( 
  
    ( fab )
      ( "/unbuffered" )
        [ "GET" ]( handler )
      ()
      ( "/buffered" )
        ( require( "../middleware/buffer" ) )
        [ "GET" ]( handler )
      ()
    ( fab )
  
  );
  
server.listen( PORT );

client
  .request( "/unbuffered" )
  .addListener( "response", function( response ) {
    response
      .addListener( "data", function(){ unbufferedCount-- } )
      .addListener( "end", function() {
        assert.equal( unbufferedCount, 0 );

        client
          .request( "/buffered" )
          .addListener( "response", function( response ) {
            response
              .addListener( "data", function(){ bufferedCount-- } )
              .addListener( "end", function() {
                assert.equal( bufferedCount, 0 );
                server.close();
              });
          })
          .close();
      });
  })
  .close();
