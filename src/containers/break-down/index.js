import React from 'react';
import './break-down.css';
import { Card } from '../../components';
import { toTitleCase, numberToMoney, camelCaseToWords } from '../../utils';

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

		const mainHeader = `${toTitleCase(type)} 10 ${estimateView} in 
			${camelCaseToWords(financialView)} for the year ${yearView}`;

		const body = dataset.map((e,i) => {
			const numberVal = e[`${yearView} ${estimateView}`];
			const money = numberToMoney(Math.round((numberVal || 0) * 100) / 100);
			return (<div key = {i} className = "break-down-row">
				<div className = 'break-down-key'>{i + 1}) {e[deepDiveView]} </div>
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