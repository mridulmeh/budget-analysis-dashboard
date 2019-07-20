import { separateDataKeys } from "../../utils";

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
		financialView
	} = view;
	// procesDataForBubble
	return allData[financialView];
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
	}).filter(e => e[deepDiveView].length > 0 && e[deepDiveView].split(' ')[0] !== 'Total');

	return sortedData.slice(0, 10) ;
};
