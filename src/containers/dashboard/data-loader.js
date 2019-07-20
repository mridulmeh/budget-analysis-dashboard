import { separateDataKeys } from "../../utils";
import { hierarchy } from "../../enums";

export const getBudgetSummaryData = (allData = []) => {
	const data = {
		'Capital Expenditure': {},
		'Revenue Expenditure': {},
		'Revenue Receipts': {},
		'Capital Receipts': {}
	};
	allData.forEach(d => {
		if(data[d.Particulars]){
			data[d.Particulars] = d;
		}
	});

	return Object.keys(data).map(e => {
		return { name: e, values: separateDataKeys(data[e]) };
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
	console.log(data);
	return data;
};

export const getBudgetBreakdown = (data = [], state) => {
	const {
		type,
		value,
		yearView,
		deepDiveView,
		financialView
	} = state;

	const sortedData = (data[financialView] || []).sort((a,b) => {
		const sortval = +a[`${yearView} ${value}`] - +b[`${yearView} ${value}`];
		return type === 'top' ? -sortval : sortval;
	})
		.filter(e => e[deepDiveView].length > 0 && e[deepDiveView].split(' ')[0] !== 'Total');

	return sortedData.slice(0, 10) ;
};
