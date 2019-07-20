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

export const getBudgetYOYDataData = (view, allData) => {
	return allData[view];
};

export const getBudgetDistData = (view, allData) => {
	return allData[view];
};

export const getBudgetBreakdown = (data = [], state) => {
	const {
		type,
		value,
		year,
		deepDiveView,
		view
	} = state;

	const sortedData = (data[view] || []).sort((a,b) => {
		const sortval = +a[`${year} ${value}`] - +b[`${year} ${value}`];
		return type === 'top' ? -sortval : sortval;
	}).filter(e => e[deepDiveView].length > 0 && e[deepDiveView].split(' ')[0] !== 'Total');

	return sortedData.slice(0, 10) ;
};
