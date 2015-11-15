// This requires an array of pairs
// Each pair consists of two fields, 'm' and 'c'
function chineseRemainder(pairs, log) {
	//	http://mathworld.wolfram.com/ChineseRemainderTheorem.html
	
	log = log || function () { };
	// fit this into the pattern in the documentation
	pairs = pairs.map(function (p) {
		return {
			a: p.m,
			m: p.c
		};
	});

	var M = pairs.reduce(function (l, r) { return l * r.m; }, 1);
	log('M = ' + M);
	
	// now to add b
	pairs = pairs.map(function (p, i) {
		var d = M / p.m;
		var b = powerMod(d, eulerTotient(p.m) - 1, p.m);
		p.b = b;
		log('' + i + ': a=' + p.a + ', b=' + p.b + ', m=' + p.m);
		return p;
	});
	 
	var products = pairs.map(function (p) {
		return p.a * p.b * M / p.m;
	});

	var sum = products.reduce(function (l, r) { return l + r; }, 0);

	var x = sum % M;
	return {
		m: M,
		c: x
	};
}