function powerMod(a, e, m) {
	// Doing this the simple way for now
	// This will not scale
	return Math.pow(a, e)%m;
}