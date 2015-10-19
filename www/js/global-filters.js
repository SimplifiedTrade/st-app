( function( ng, undefined ) {
	
	var module = ng.module( "strade.global.filters", [ ] );

	/**
	* Filter for Lodash Functions
	* USE: {{ item.name | lodash:'capitalize' }}
	* 'capitalize' is a reference to Lodash's String function, functions that require more params can be used like this:
	* You should be able to pass more params like this: {{ 5 | lodash:'add':3 }}
	* NOTE: This should work for at least some (or even most) of Lodash's functions
	*/
	module.filter( "lodash", [ "lodash", function( lodash ) {
		return function( input, fn ) {
			if ( !fn in lodash ) { console.error( "Filter Error: lodash: function not found." ); }
			var args = lodash.args2Arr( arguments );
			lodash.pullAt( args, 1 );
			return lodash[ fn ].apply( this, args );
		};
	}]);
	

})( angular );
