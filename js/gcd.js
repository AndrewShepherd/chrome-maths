function gcd(n1, n2, f) {
	if (n2 > n1) {
		var temp = n1;
		n1 = n2;
		n2 = temp;
	}
	if (n2 === 0) {
		return n1;
	} else if (n2 === 1) {
		return 1;
	} else {
		if (f) {
			f('' + n1 + ' = ' + Math.floor(n1 / n2) + '*' + n2 + ' + ' + n1 % n2);
		}
		return gcd(n2, n1 % n2, f);
	}
}