var IM_PROTO = IM_PROTO || {};


IM_PROTO.soundEffects = (function() {

	function init() {
		console.log('hi!');
	}

	function playSound() {
		alert('play');
	}

	init();

	return {
		play: playSound
	};
})();

IM_PROTO.soundEffects.play();
