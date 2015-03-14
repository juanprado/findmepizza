var IM_PROTO = IM_PROTO || {};


IM_PROTO.getPizza = (function() {

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
	}

	function getPizzaArea(diameter) {
		var z = diameter / 2,
				pi = Math.PI,
				a = 1;

		return pi * (z * z) * a; // get it?
	}

	return {
		play: playSound
	};

})();

