var IM_PROTO = IM_PROTO || {};


IM_PROTO.getPizza = (function($) {

	function getCounts() {
		var people = document.getElementById('personCount').value,
				slices = document.getElementById('sliceCount').value;

		howManyPizzas(slices, people, true);
	}

	function init() {
		var $button = document.getElementById('submitForm');

		$button.addEventListener('click', onGoClick);
	}

	function onGoClick() {
		event.preventDefault();
		getCounts();
		getPizzaPlaces();
	}

	function howManyPizzas(slices, people, isNYC) {
		var averagePizzaSlice = isNYC ? 31.75 : 15, //area measured in square inches
				num = slices * people, // get the number of slices
				requiredPizza = averagePizzaSlice * num, // area of required pizza
				mediumPizza = getPizzaArea(10), // diameter measured in inches
				largePizza = getPizzaArea(14), // diameter measured in inches
				extraLargePizza = getPizzaArea(18), // diameter measured in inches
				mediumPizzas = 0,
				largePizzas = 0,
				extraLargePizzas = 0;
				weNeedPizza = true;

		while(weNeedPizza) {
			if (requiredPizza <= mediumPizza) {
				mediumPizzas ++;
				weNeedPizza = false;
			} else if (requiredPizza <= largePizza) {
				largePizzas ++;
				weNeedPizza = false;
			} else if (requiredPizza <= extraLargePizza) {
				extraLargePizzas ++;
				weNeedPizza = false;
			} else {
				extraLargePizzas ++;
				requiredPizza = requiredPizza - extraLargePizza;
			}
		}

		$('.medium-pie span').text(mediumPizzas);
		$('.large-pie span').text(largePizzas);
		$('.xlarge-pie span').text(extraLargePizzas);
	}

	function getPizzaArea(diameter) {
		var z = diameter / 2,
				pi = Math.PI,
				a = 1;

		return pi * (z * z) * a; // get it?
	}

	function getPizzaPlaces() {
		$.ajax({
			type: 'GET',
			dataType: 'JSONP',
			url: 'http://piapi.herokuapp.com/api',
			success: function(resp) {
				IM_PROTO.soundEffects.play();
				$('form').hide();
				$('.results').show();
				populateList(resp.places);
			},
			error: function() {
				IM_PROTO.soundEffects.play(true);
				alert('NO PIZZA FOR YOU');
			}
		});
	}

	function populateList(data) {
		var $location = $('.location-list');
		for(var i  = 0; i< data.length; i++) {
			$location.append('<li><ul><li>'+data[i].name+'</li><li>'+data[i].address+'</li><li>'+'<a href="tel:' + data[i].phone+'">' + data[i].phone+'</a></li>');
		}
	}

	return {
		init: init
	};

})(jQuery);

IM_PROTO.getPizza.init();

