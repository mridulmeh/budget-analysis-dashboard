import React from 'react';
import './break-down.css';
import { Card } from '../../components';
import { toTitleCase, numberToMoney, camelCaseToWords } from '../../utils';
import { hierarchy, years } from '../../enums';

class BudgetBreakdown extends React.Component {

	render () {

		const {
			dataset,
			viewSettings
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

		const mainHeader = `${toTitleCase(type)} 10 ${estimateView} in 
			${camelCaseToWords(financialView)} for ${yearView ? `the year ${yearView}` : `across all the years` }`;

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

			money = numberToMoney(money.toFixed(2));

			return (<div key = {i} className = "break-down-row">
				<div className = 'break-down-key' title = {e[name]}>{i + 1}) {e[name]} </div>
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