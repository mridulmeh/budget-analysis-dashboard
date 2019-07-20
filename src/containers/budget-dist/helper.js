export const groupFnMap = {
	Sum: (arr) => arr.reduce((t,n) => t + n),
	Maximum: (arr) => arr.reduce((t,n) => Math.max(t,n), Number.NEGATIVE_INFINITY),
	Minimum: (arr) => arr.reduce((t,n) => Math.min(t,n), Number.POSITIVE_INFINITY)
};

const applyGrouping = (hashMap, nameKey, size, fn = (d) => d[0]) => {
	const groupedData = [];

	Object.keys(hashMap).forEach(key => {
		if(key.length){
			groupedData.push({
				key,
				values: [{
					[nameKey]: key,
					[size]: fn(hashMap[key])
				}]
			});
		}
	});
	return groupedData;
};

export const procesDataForBubble = (data, nameKey, size, groupFnName) => {
	const dataHashMap = {};
	data.forEach(e => {
		if(!dataHashMap[e[nameKey]]){
			dataHashMap[e[nameKey]] = [];
		}
		dataHashMap[e[nameKey]].push(e[size]);
	});

	return applyGrouping(dataHashMap, nameKey, size, groupFnMap[groupFnName]);
};
