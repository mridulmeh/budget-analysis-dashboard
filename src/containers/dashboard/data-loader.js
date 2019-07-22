import { separateDataKeys, removeSpaces } from "../../utils";
import { hierarchy, years } from "../../enums";

const addDatumToExistingData = (prevDatum, datum) => {
	Object.keys(datum).forEach(key => {
		if(datum[key] && !isNaN(+datum[key])){
			prevDatum[key] = prevDatum[key] || 0;
			prevDatum[key] += +datum[key];
		}
	});

	return prevDatum;
};

export const getBudgetSummaryData = (allData = [], view) => {
	const {
		name,
		value
	} = view.deepDiveView;
	const data = {
		'Capital Expenditure': {},
		'Revenue Expenditure': {},
		'Revenue Receipts': {},
		'Capital Receipts': {}
	};

	switch(name){
	case 'Summary':

		(allData['BudgetSummaryStatement'] || []).forEach(d => {
			if(data[d.Particulars]){
				data[d.Particulars] = d;
			}
		});
		break;

	default: {
		Object.keys(data).forEach(key => {
			const dataset = allData[removeSpaces(key)];
			dataset.forEach(datum => {
				if(datum[name] === value){
					data[key] =	addDatumToExistingData(data[key], datum);

				}
			});
		});
	}
	}

	return Object.keys(data).map(e => {
		return {
			name: e,
			values: separateDataKeys(data[e])
		};
	});

};

export const getBudgetYOYDataData = (allData, view ) => {
	return allData[view];
};

export const getBudgetDistData = (allData, view ) => {
	const {
		financialView,
		deepDiveView
	} = view;
	const {
		value,
		name
	} = deepDiveView;

	// procesDataForBubble
	let data = allData[financialView];

	const deepDiveName = hierarchy[hierarchy.indexOf(deepDiveView.name) + 1];

	if(data){
		data = data.filter(e => {
			if(!e[deepDiveName]){
				return true;
			}
			 return e[deepDiveName].split(' ')[0] !== 'Total';
		});
	}
	if(value.length){
		data = data.filter(e => e[name] === value);
	}
	return data;
};

export const getBudgetBreakdown = (data = [], state) => {
	const {
		yearView,
		deepDiveView,
		estimateView,
		financialView
	} = state;
	const {
		name,
		value: deepDiveVal
	} = deepDiveView;

	const deepDiveName = hierarchy[hierarchy.indexOf(name) + 1];

	let sortedData = data[financialView] || [];
	// (data[financialView] || []).sort((a,b) => {
	// 	const sortval = +a[`${yearView} ${value}`] - +b[`${yearView} ${value}`];
	// 	return type === 'top' ? -sortval : sortval;
	// });

	sortedData = sortedData.filter(e => {
		if(e[deepDiveName] && e[deepDiveName].length > 0 && e[deepDiveName].split(' ')[0] !== 'Total'){
			if(deepDiveVal && e[name] !== deepDiveVal){
				return false;
			} return true;

		} return false;
	});

	const yearEstimators = yearView ? [`${yearView} ${estimateView}`] : years.map(e => {
		return `${e} ${estimateView}`;
	});
	const reducedData = sortedData.reduce((t = {}, n) => {

		const sepVal = n[deepDiveName];
		t[sepVal] = t[sepVal] || {};
		yearEstimators.forEach(y => {
			t[sepVal][y] = t[sepVal][y] || 0;
			t[sepVal][y] += +n[y];
		});

		return t;
	}, {}) ;

	return Object.keys(reducedData).map(e => ({
		[deepDiveName]: e,
		...reducedData[e]
	})) || [];
};
