module.exports = {
	beforeNode,
	afterNode,
	beforeDeclaration,
	afterDeclaration,
};

// eslint-disable-next-line max-params
function beforeNode(comments, previousNode, node, currentInitialIndex) {
	if (!previousNode || previousNode.type !== 'comment') {
		return comments;
	}

	if (
		!previousNode.raws.before ||
		(!previousNode.raws.before.includes('\n') && previousNode.prev())
	) {
		return comments;
	}

	let initialIndex = currentInitialIndex || node.initialIndex;

	previousNode.position = node.position;
	previousNode.initialIndex = initialIndex - 0.0001;

	const newComments = [previousNode].concat(comments);

	return beforeNode(newComments, previousNode.prev(), node, previousNode.initialIndex);
}

// eslint-disable-next-line max-params
function afterNode(comments, nextNode, node, currentInitialIndex) {
	if (!nextNode || nextNode.type !== 'comment') {
		return comments;
	}

	if (!nextNode.raws.before || nextNode.raws.before.includes('\n')) {
		return comments;
	}

	let initialIndex = currentInitialIndex || node.initialIndex;

	nextNode.position = node.position;
	nextNode.initialIndex = initialIndex + 0.0001;

	return afterNode(comments.concat(nextNode), nextNode.next(), node, nextNode.initialIndex);
}

// eslint-disable-next-line max-params
function beforeDeclaration(comments, previousNode, nodeData, currentInitialIndex) {
	if (!previousNode || previousNode.type !== 'comment') {
		return comments;
	}

	if (!previousNode.raws.before || !previousNode.raws.before.includes('\n')) {
		return comments;
	}

	let initialIndex = currentInitialIndex || nodeData.initialIndex;

	const commentData = {
		orderData: nodeData.orderData,
		node: previousNode,
		unprefixedName: nodeData.unprefixedName, // related property name for alphabetical order
		unspecifiedPropertiesPosition: nodeData.unspecifiedPropertiesPosition,
	};

	commentData.initialIndex = initialIndex - 0.0001;

	// add a marker
	previousNode.sortProperty = true;

	const newComments = [commentData].concat(comments);

	return beforeDeclaration(newComments, previousNode.prev(), nodeData, commentData.initialIndex);
}

// eslint-disable-next-line max-params
function afterDeclaration(comments, nextNode, nodeData, currentInitialIndex) {
	if (!nextNode || nextNode.type !== 'comment') {
		return comments;
	}

	if (!nextNode.raws.before || nextNode.raws.before.includes('\n')) {
		return comments;
	}

	let initialIndex = currentInitialIndex || nodeData.initialIndex;

	const commentData = {
		orderData: nodeData.orderData,
		node: nextNode,
		unprefixedName: nodeData.unprefixedName, // related property name for alphabetical order
		unspecifiedPropertiesPosition: nodeData.unspecifiedPropertiesPosition,
	};

	commentData.initialIndex = initialIndex + 0.0001;

	// add a marker
	nextNode.sortProperty = true;

	return afterDeclaration(
		comments.concat(commentData),
		nextNode.next(),
		nodeData,
		commentData.initialIndex
	);
}
