import * as d3 from 'd3';
import BudgetSummaryStatement from './cleaned-data/Budget Summary Statement.csv';
import CapitalExpenditure from './cleaned-data/Capital Expenditure.csv';
import CapitalReceipts from './cleaned-data/Capital Receipts.csv';
import RevenueExpenditure from './cleaned-data/Revenue Receipts.csv';
import RevenueReceipts from './cleaned-data/Capital Receipts.csv';

const datasets = [{
	name: 'BudgetSummaryStatement',
	data: BudgetSummaryStatement
},{
	name: 'CapitalExpenditure',
	data: CapitalExpenditure
},{
	name: 'CapitalReceipts',
	data: CapitalReceipts
},{
	name: 'RevenueExpenditure',
	data: RevenueExpenditure
},{
	name: 'RevenueReceipts',
	data: RevenueReceipts
}];

const csvReader = (resolve, reject, dataset) => {
	return d3.csv(dataset.data).then((res) => {
		resolve({ [dataset.name]: res });
	});
};

export const dataLoader = () => {
	const allPromises = [];
	datasets.forEach(dataset => {
		const promise = new Promise(function (resolve, reject){
			return csvReader(resolve, reject, dataset);
		});
		allPromises.push(promise);
	});

	return Promise.all(allPromises);
};

export const separateDataKeys = (data) => {
	const barData = [];
	Object.keys(data).forEach(key => {
		const splitKey = key.trim().split(' ');
		const yearKey = splitKey.shift();

		if(splitKey.length > 0) {
			const joinedKey = splitKey.join(' ').trim();
			barData[yearKey] = barData[yearKey] || {};
			barData[yearKey][joinedKey] = data[key];
		}
	});
	return barData;
};

export const numberToMoney = (originalString, breakPointer = 2) => {
	const splitString = originalString.split('.');
	const str = splitString[0];

	const stringLength = str.length;

	let returnedStr = str.slice(stringLength - 3, stringLength);

	for(let i = stringLength - 4; i >= 0; i = i - breakPointer){
		returnedStr = (str[i - 1] || '') + str[i] + ',' + returnedStr;
	}
	console.log(returnedStr, splitString);
	return returnedStr + (splitString[1] ? `.${splitString[1]}` : '');

};
