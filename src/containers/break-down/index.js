import React from 'react';
import './break-down.css';
import { Card } from '../../components';
import { toTitleCase, numberToMoney, camelCaseToWords } from '../../utils';
import { hierarchy, years } from '../../enums';
import sortButton from '../../images/sort-descending.png';

class BudgetBreakdown extends React.Component {

	render () {

		const {
			dataset,
			viewSettings,
			changeSortType
		} = this.props;
		const {
			type,
			estimateView,
			yearView,
			deepDiveView,
			financialView
		} = viewSettings;

		const hierarchyPos = hierarchy.indexOf(deepDiveView.name) + 1;
		const name = hierarchyPos === hierarchy.length ? hierarchy[hierarchyPos - 1] : hierarchy[hierarchyPos];

		const mainHeader = (<div>
			<div>
				{`${toTitleCase(type)} 10 ${estimateView} in
			${camelCaseToWords(financialView)} for 
			${yearView ? `the year ${yearView}` : `across all the years` }`}</div>
			<img
				onClick = {changeSortType}
				className = {type === 'top' ? 'sort' : 'sort inverted'} src = {sortButton} alt = {'sort'}></img>
		</div>);

		const yearEstimators = yearView ? [`${yearView} ${estimateView}`] : years.map(e => {
			return `${e} ${estimateView}`;
		});
		const body = dataset.map((e,i) => {
			let money = 0;

			yearEstimators.forEach(est => {
				const numberVal = +(e[est]);
				if(!isNaN(numberVal)){

					money += +(Math.round((+numberVal) * 100) / 100);
				}
			});

			return { money, ...e };

		}).sort((a,b) => {
			const diff = a.money - b.money;
			return type === 'top' ? -diff : diff;
		}).slice(0, 10).map((datum, i) => {
			const money = numberToMoney(datum.money.toFixed(2));
			return (<div key = {i} className = "break-down-row">
				<div className = 'break-down-key' title = {datum[name]}>{i + 1}) {datum[name]} </div>
				<div className = 'break-down-value'>Rs. {money} L</div>
			</div>);
		});

		return (
			<div className = "budget-break-down budget-analysis-section">
			 	<Card header= {mainHeader} body = {body} classPrefix = "budget"></Card>
			</div>
		);
	}
}

export default BudgetBreakdown;