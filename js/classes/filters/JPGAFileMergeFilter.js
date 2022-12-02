( function ( ns ) {
	
		// Just a note ns is PIXI but how bad ass is it to write the filter like this. BOYYAAAA
	function JPGAFileMergeFilter ( colourMap, alphaMap ) {

		PIXI.AbstractFilter.call ( this );

		this.passes = [ this ];
		texture.baseTexture._powerOf2 = true;

			// set the uniforms
	    this.uniforms = {
	        "colourMap" : { "type" : "sampler2D", "value" : colourMap },
	        "alphaMap" : { "type" : "sampler2D", "value" : alphaMap }
	    };

	    this.fragmentSrc = [
        'varying vec3 vTextureCoord;',
        //'varying vec4 vColor;',
        'uniform sampler2D colourMap;',
       	'uniform float alphaMap;',
 
        'void main(void) {',
        '	vec3 vColor = texture2D(colourMap, vTextureCoord);',
        '   float vAlpha = texture2D(alphaMap, vTextureCoord).r;',
        '	gl_FragColor = vec4 ( vColor, vAlpha.r )',
        //'   gl_FragColor = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);',
     //   '   gl_FragColor = gl_FragColor;',

        '}'
    ];
	}

} ( ss ) );


/* PIXI.GrayFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.GrayFilter.prototype.constructor = PIXI.GrayFilter;
 
/**
 * The strength of the gray. 1 will make the object black and white, 0 will make the object its normal color.
 * @property gray
 * @type Number
 * /
Object.defineProperty(PIXI.GrayFilter.prototype, 'gray', {
    get: function() {
        return this.uniforms.gray.value;
    },
    set: function(value) {
        this.uniforms.gray.value = value;
    }
}); */