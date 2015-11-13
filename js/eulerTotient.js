function eulerTotient(n, log) {
	if (typeof (n) === 'string') {
		n = parseInt(n, 10);
	}
	log = log || (function () { });

	var maxI = Math.floor(Math.sqrt(n));
	var sieve = new Array(maxI + 1);
	var totient = n;

	for (var i = 2; i <= maxI; ++i) {
		if (!sieve[i]) {
			if (n % i == 0) {
				var newTotient = totient * (i - 1) / i;
				log('' + n + ' is divisible by ' + i + ', so Totient now equals ' + totient + '(' + (i - 1) + ')/' + i + ' = ' + newTotient);
				totient = newTotient;
				while (n % i == 0) {
					n = n / i;
				}
				log('n now equals ' + n);
				maxI = Math.sqrt(n);
			}
			for (var j = i * 2; j < maxI; j += i) {
				sieve[j] = true;
			}
		}
	}
	if (n != 1) {
		log('' + n + ' is prime, so totient = ' + totient + ' * ' + (n - 1) + '/' + n + ' = ' + totient * (n - 1) / n);
		totient = totient * (n - 1) / n;
	}
	return totient;
}