export const groupFnMap = {
	Sum: (arr) => arr.reduce((t,n) => +t + +n),
	Maximum: (arr) => arr.reduce((t,n) => Math.max(+t,+n), Number.NEGATIVE_INFINITY),
	Minimum: (arr) => arr.reduce((t,n) => Math.min(+t,+n), Number.POSITIVE_INFINITY)
};

const applyGrouping = (hashMap, nameKey, size, fn = (d) => d[0]) => {
	const groupedData = [];

	Object.keys(hashMap).forEach(key => {
		if(key.length){
			groupedData.push({
				key,
				values: [{
					[nameKey]: key,
					value: fn(hashMap[key])
				}]
			});
		}
	});
	return groupedData;
};

export const procesDataForBubble = (data, nameKey, size, groupFnName) => {
	const dataHashMap = {};
	let hasDataFlag = 0;
	data.forEach(datum => {
		if(!dataHashMap[datum[nameKey]]){
			dataHashMap[datum[nameKey]] = [];
		}
		const reducedSize = size.reduce((t,n) => {
			t += (+datum[n] || 0);
			return t;
		}, 0);
		if(reducedSize > 0){
			hasDataFlag = 1;
		}
		dataHashMap[datum[nameKey]].push(reducedSize);
	});

	return {
		data: applyGrouping(dataHashMap, nameKey, size, groupFnMap[groupFnName]),
		hasDataFlag
	};
};
