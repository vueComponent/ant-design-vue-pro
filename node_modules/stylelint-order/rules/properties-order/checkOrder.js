const checkAlphabeticalOrder = require('../checkAlphabeticalOrder');
const { vendor } = require('../../utils');

// eslint-disable-next-line consistent-return
module.exports = function checkOrder({
	firstPropertyData,
	secondPropertyData,
	allPropertiesData,
	unspecified,
}) {
	function report(isCorrect, firstNode = firstPropertyData, secondNode = secondPropertyData) {
		return {
			isCorrect,
			firstNode,
			secondNode,
		};
	}

	if (firstPropertyData.unprefixedName === secondPropertyData.unprefixedName) {
		// If first property has no prefix and second property has prefix
		if (
			!vendor.prefix(firstPropertyData.name).length &&
			vendor.prefix(secondPropertyData.name).length
		) {
			return report(false);
		}

		return report(true);
	}

	const firstPropIsSpecified = Boolean(firstPropertyData.orderData);
	const secondPropIsSpecified = Boolean(secondPropertyData.orderData);

	// Check actual known properties
	if (firstPropIsSpecified && secondPropIsSpecified) {
		return report(
			firstPropertyData.orderData.expectedPosition <=
				secondPropertyData.orderData.expectedPosition
		);
	}

	if (!firstPropIsSpecified && secondPropIsSpecified) {
		// If first prop is unspecified, look for a specified prop before it to
		// compare to the current prop
		let priorSpecifiedPropData = allPropertiesData
			.slice(0, -1)
			.reverse()
			.find((declaration) => Boolean(declaration.orderData));

		if (
			priorSpecifiedPropData &&
			priorSpecifiedPropData.orderData &&
			priorSpecifiedPropData.orderData.expectedPosition >
				secondPropertyData.orderData.expectedPosition
		) {
			return report(false, priorSpecifiedPropData, secondPropertyData);
		}
	}

	// Now deal with unspecified props
	// Starting with bottomAlphabetical as it requires more specific conditionals
	if (unspecified === 'bottomAlphabetical' && firstPropIsSpecified && !secondPropIsSpecified) {
		return report(true);
	}

	if (unspecified === 'bottomAlphabetical' && !firstPropIsSpecified && !secondPropIsSpecified) {
		if (checkAlphabeticalOrder(firstPropertyData, secondPropertyData)) {
			return report(true);
		}

		return report(false);
	}

	if (unspecified === 'bottomAlphabetical' && !firstPropIsSpecified) {
		return report(false);
	}

	if (!firstPropIsSpecified && !secondPropIsSpecified) {
		return report(true);
	}

	if (unspecified === 'ignore' && (!firstPropIsSpecified || !secondPropIsSpecified)) {
		return report(true);
	}

	if (unspecified === 'top' && !firstPropIsSpecified) {
		return report(true);
	}

	if (unspecified === 'top' && !secondPropIsSpecified) {
		return report(false);
	}

	if (unspecified === 'bottom' && !secondPropIsSpecified) {
		return report(true);
	}

	if (unspecified === 'bottom' && !firstPropIsSpecified) {
		return report(false);
	}
};
