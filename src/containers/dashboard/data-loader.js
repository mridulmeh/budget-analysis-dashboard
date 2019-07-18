import { separateDataKeys } from "../../utils";

const required = ['Capital Expenditure','Revenue Expenditure','Revenue Receipts','Capital Receipts'];

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
		return { name: [e], values: separateDataKeys(data[e]) };
	});

};

export const getBudgetYOYDataData = (view, allData) => {
	return allData[view];
};

export const getBudgetDistData = (view, allData) => {
	return allData[view];
};
