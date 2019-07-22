export const changeMetric = (prevViewState, newViewState) => {

	const freshViewState = {};

	Object.keys(prevViewState).forEach(e => {
		freshViewState[e] = Object.assign(prevViewState[e], newViewState[e] || {});
	});

	return {
		views: freshViewState
	};

};