var IM_PROTO = IM_PROTO || {};


IM_PROTO.bufferLoader = (function() {

	var bufferService = this;

	/**
     * Returns an array of sample paths from a sample object
     *
     * @param {Object} samples
 	 *
     * @private
     */

	function getUrlList(samples) {
		var urlList = [];

		var i = 0,
			n = samples.length;

		for (; i < n; i++) {
			urlList.push(samples[i].sample);
		}

		return urlList;
	}

	/**
     * Constructor for the audio loader
     *
     * @param {Object} audio context
 	 * @param {Array} list of sample urls
 	 * @param {function} callback after buffer load success 
 	 *
     * @public
     */

	this.loader = function(context, samples, callback) {
		this.context = context;
	    this.urlList = getUrlList(samples);
	    this.onload = callback;
	    this.bufferList = [];
	    this.loadCount = 0;
	};

	/**
     * Loops through loader.urlList and fires loadbuffer
 	 *
     * @public
     */

	this.loader.prototype.load = function() {
	    var i = 0,
	    	n = this.urlList.length;

	    for (; i < n; i++){
	        this.loadBuffer(this.urlList[i], i);
	    }
	};

	/**
     * Requests file, and sets an audio buffer to call on later
     *
     * @param {String} url
 	 * @param {Number} index
 	 *
     * @public
     */

	this.loader.prototype.loadBuffer = function(url, index) {
	    // Load buffer asynchronously
	    var request = new XMLHttpRequest();
	    request.open("GET", url, true);
	    request.responseType = "arraybuffer";

	    var loader = this;

	    request.onload = function() {
	        // Asynchronously decode the audio file data in request.response
	        loader.context.decodeAudioData(
	        request.response,
	        function(buffer) {
	            if (!buffer) {
	                alert('error decoding file data: ' + url);
	                return;
	            }

	            loader.bufferList[index] = buffer;
	            if (++loader.loadCount === loader.urlList.length)
	                loader.onload(loader.bufferList);
	            },
	            function(error) {
	                console.error('decodeAudioData error', error);
	            }
	        );
	    };

		request.onerror = function() {
			alert('BufferLoader: XHR error');
	    };

	    request.send();
	};

	this.updateBuffers = function(buffers) {
		console.log('update?');
		bufferService.buffers = buffers;
	};

	this.getBuffers = function() {
		// console.log('return!', bufferService.buffers);
		return bufferService.buffers;
	};

	return {
		loader: this.loader,
		updateBuffers: this.updateBuffers,
		buffers : bufferService.buffers
	};

})();

IM_PROTO.soundEffects = (function() {

	var self = this;
	this.context = undefined;
	this.buffers = [];
	this.samples = [
        {
            "type": "sample",
            "sample": "/assets/samples/pizza.wav"
        }
    ];

	function init() {
		createContext();
		bufferLoad();
		console.log(IM_PROTO.bufferLoader.buffers);

	}

	function createContext() {
		var contextClass = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext;

		if (contextClass) {
			// Web Audio API is available.
			self.context = new contextClass();
		}
	}

	function bufferLoad() {
		var bufferLoader = new IM_PROTO.bufferLoader.loader(
             self.context,
             self.samples,
             loadCallback
        );

        bufferLoader.load();
	}
	
	function loadCallback(buffers) {
        IM_PROTO.bufferLoader.updateBuffers(buffers);

        console.log(buffers, 'buufeeeerrr?!?');
        self.buffers = buffers;
    }

	function playSound() {
		var time = 0,
			asset = self.buffers[0];

		console.log(asset, 'asset');

	    var source = context.createBufferSource();
	    source.buffer = asset;

	    /** SAMPLE COMPRESSOR **/
	    sampleCompressor = context.createDynamicsCompressor();
	    sampleCompressor.ratio.value = 30;
	    sampleCompressor.threshold.value = 500;
	    source.connect(sampleCompressor);
	    sampleCompressor.connect(context.destination);

	    source.start(time);

	}

	init();

	return {
		play: playSound
	};
})();

console.log(IM_PROTO, 'loader?');


