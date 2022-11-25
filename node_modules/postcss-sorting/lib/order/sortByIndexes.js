module.exports = function sortByIndexes(a, b) {
	// If a and b have the same group index, and a's property index is
	// higher than b's property index, in a sorted list a appears after
	// b:
	if (a.position !== b.position) {
		return a.position - b.position;
	}

	// If a and b have the same group index and the same property index,
	// in a sorted list they appear in the same order they were in
	// original array:
	return a.initialIndex - b.initialIndex;
};
