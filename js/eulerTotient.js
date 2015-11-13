function eulerTotient(n, log) {
	var total = 0;
	for (var i = 1; i < n; ++i) {
		if (gcd(i, n) === 1) {
			++total;
		}
	}
	return total;
}