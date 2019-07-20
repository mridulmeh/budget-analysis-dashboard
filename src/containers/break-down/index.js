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
			value,
			year,
			deepDiveView,
			view
		} = viewSettings;

		const mainHeader = `${toTitleCase(type)} 10 ${value} in ${camelCaseToWords(view)} for the year ${year}`;

		const body = dataset.map((e,i) => {
			const numberVal = e[`${year} ${value}`];

			const money = numberToMoney(Math.round(numberVal * 100) / 100);
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