( function () {
	
	function BindedPosition ( data ) {

		this.$element = getDefault ( data.$element, $ ( "body" ) );
		this.original.width =
		this.original.height = this.$element.width ();
		this.width = 
		this.height = 
		this.left =
		this.right = 
		this.top = 
		this.bottom = 
	}

	PercentPosition.prototype.getPosition = function () {

	}

} ( ss ) )