require.include("weblib/ssnamespace");
require.include("weblib/core/Util");
require.include("weblib/liveparticles/updater/BaseParticleUpdater");

/**
* Modifies the value of a particular property from its current value at a randomly selected rate.
*	NOTE: This is intended to be used only when another updater is already setting a calculated value for a property,
*		but additional modifications are desired to that same property
*/
ss.RandomPropertyModifyUpdater = function(propertyName, minChangeRate, maxChangeRate, subProperty){
	"use strict";

	//Call base class constructor
	ss.BaseParticleUpdater.call(this);

	var _this = this;
	this.name = "RandomPropertyOffsetUpdater";
	this.exposedVariables = ["propertyName", "minChangeRate", "maxChangeRate", "subProperty"];

	//[String] - Name of the property to modify
	this.propName = propertyName;

	//[String] - An optional sub-property name 
	this.subPropName = isEmpty(subProperty) ? undefined : subProperty;

	//[Number] - Minimum rate of change to apply
	this.minChange = minChangeRate;

	//[Number] - Maximum rate of change to apply
	this.maxChange = maxChangeRate;

	/*
	* Initializes a set of particles for use by this updater
	* @param particles:Array[AbstractParticle] - List of particles to be updated
	* @param startIndex:int - The index to start updating at
	* @param endIndex:int - The index to end updating at
	*/
	_this.initParticles = function(particles, startIndex, endIndex){
		var randRate;
		//var _range = this.maxScale - this.minScale;

		//Select a randomized rate of change for each particle and store it on the particle
		for(var i = startIndex; i <= endIndex; i++) {
			randRate = this.minChange + Math.random() * (this.maxChange - this.minChange);
			particles[i].rpou_rate = randRate;
		}
	}

	/*
	* [PROTECTED OVERRIDE]
	* Perform updates on all particles in a list
	* @param particles:Array[AbstractParticle] - List of particles to be updated
	* @param delta:Number - Time elapsed since last update (in seconds)
	*/
	_this.updateParticles = function(particles, delta){
		var i;

		if(this.subPropName === undefined){
			for(i = 0; i < particles.length; i++){
				particles[i][this.propName] += particles[i].curLife * particles[i].rpou_rate;
			}
		}else{
			for(i = 0; i < particles.length; i++){
				particles[i][this.propName][this.subPropName] += particles[i].curLife * particles[i].rpou_rate;
			}
		}
	};
}

ss.RandomPropertyModifyUpdater.prototype = new ss.BaseParticleUpdater();
ss.RandomPropertyModifyUpdater.prototype.constructor = ss.RandomPropertyModifyUpdater;