/* global require, ss*/

require.include("weblib/ssnamespace");
require.include("weblib/core/Util");
require.include("weblib/liveparticles/updater/BaseParticleUpdater");

/*
* class RandomScaleInitializer
*	Initializes the state of bubble particles
* @param minScale:[Number] - Minimum scale of the particle
* @param maxScale:[Number] - Maximum scale of the particle
* @param minSpeed:[Number] - Minimum speed the bubbles should travel at
* @param maxSpeed:[Number] - Maximum speed the bubbles should travel at
*/
ss.BubbleParticleInitializer = function(minScale, maxScale, minSpeed, maxSpeed){
	"use strict";

	ss.BaseParticleUpdater.call(this);
	var _this = this;
	this.name = "BubbleParticleInitializer";
	this.exposedVariables = ["minScale", "maxScale", "minSpeed", "maxSpeed"];

	//[Number] - Minimum value for starting scale
	this.minScale = minScale;
	//[Number] - Maximum value for starting scale
	this.maxScale = maxScale;

	//[Number] - Minimum starting speed 
	this.minSpeed = minSpeed;

	//[Number] - Maximum starting speed
	this.maxSpeed = maxSpeed;

	/*
	* Initializes a set of particles for use by this updater
	* @param particles:Array[AbstractParticle] - List of particles to be updated
	* @param startIndex:int - The index to start updating at
	* @param endIndex:int - The index to end updating at
	*/
	_this.initParticles = function(particles, startIndex, endIndex){
		
		var randScale;
		var scaleRange = this.maxScale - this.minScale;
		var curSpeed;
		var targetSpeed;
		var velScale;

		//Initialize all new particles
		for(var i = startIndex; i <= endIndex; i++) {
			randScale = this.minScale + Math.random() * scaleRange;
			particles[i].scale.x = randScale;
			particles[i].scale.y = randScale;
					
			curSpeed = Math.sqrt((particles[i].velX * particles[i].velX) + (particles[i].velY * particles[i].velY));
			
			//If this particle has no speed yet, can't set the speed and maintain direction
			if(curSpeed == 0){
				return;
			}

			//Set the speed based on the scale (larger bubbles travel faster)	
			targetSpeed = minSpeed + (maxSpeed - minSpeed) * ((randScale - minScale) / scaleRange)
			velScale = targetSpeed / curSpeed;			

			particles[i].velX  = particles[i].velX * velScale;
			particles[i].velY  = particles[i].velY * velScale;
		}
	};
};

ss.BubbleParticleInitializer.prototype = new ss.BaseParticleUpdater ();
ss.BubbleParticleInitializer.prototype.constructor = ss.BubbleParticleInitializer;