function gcd(n1, n2) {
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
		return gcd(n2, n1 % n2);
	}
}