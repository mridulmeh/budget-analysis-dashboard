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
	const splitString = `${originalString}`.split('.');
	const str = splitString[0];

	const stringLength = str.length;

	let returnedStr = str.slice(stringLength - 3, stringLength);

	for(let i = stringLength - 4; i >= 0; i = i - breakPointer){
		returnedStr = (str[i - 1] || '') + str[i] + ',' + returnedStr;
	}
	return returnedStr + (splitString[1] ? `.${splitString[1]}` : '');

};

export const toTitleCase = (str) => {
	return str.replace(
		/\w\S*/g,
		function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}
	);
};

export const camelCaseToWords = (camelCasedWord) => camelCasedWord.replace(/([A-Z])/g, ' $1')
	.replace(/^./, (str) => str.toUpperCase());

/**
 * This function takes a raw DOM element or
 * a string and returns a d3 selection of that element.
 *
 * @param {HTMLElement | string} element The element to wrap in d3 selection.
 * @return {Selection} Instance of d3 selection.
 */
export const selectElement = element => d3.select(element);

export const selectAllElements = element => d3.selectAll(element);

export const makeElement = (parent, elemType, data, selector, callbacks = {}, keyFn) => {
	if ((parent instanceof HTMLElement || parent instanceof SVGElement)) {
		parent = selectElement(parent);
	}

	const selectorVal = selector ? selector[0] : null;
	let selectorType = null;
	let actualSelector = null;
	let element = null;
	let enterSel = null;
	let mergeSel = null;
	let filter;
	if (selectorVal) {
		if (selectorVal === '#') {
			selectorType = 'id';
			actualSelector = selector;
		} else {
			selectorType = 'class';
			actualSelector = selector[0] === '.' ? selector : `.${selector}`;
		}
	} else {
		actualSelector = elemType;
		filter = true;
	}
	element = parent.selectAll(actualSelector);

	filter && (element = element.filter(function () {
		return this.parentNode === parent.node();
	}));
	element = element.data(data, keyFn);

	enterSel = element.enter()
		.append(elemType || 'div');
	callbacks.enter && enterSel.each(function (...params) {
		callbacks.enter(selectElement(this), ...params);
	});

	mergeSel = enterSel.merge(element);
	callbacks.update && mergeSel.each(function (...params) {
		callbacks.update(selectElement(this), ...params);
	});
	if (selectorType === 'class') {
		mergeSel.classed(selectorVal === '.' ? selector.substring(1, selector.length) : selector, true);
	} else if (selectorType === 'id') {
		mergeSel.attr('id', selector.substring(1, selector.length));
	}
	const exitSel = element.exit();

	if (callbacks.exit) {
		exitSel.each(function (...params) {
			callbacks.exit(selectElement(this), ...params);
		});
	} else {
		exitSel.remove();
	}
	return mergeSel;
};
