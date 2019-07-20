import React from 'react';
import './budget-summary.css';
import { Card } from '../../components';
import { numberToMoney } from '../../utils';

class BudgetSummary extends React.Component {

	render () {
		const {
			dataset,
			selected,
			onSelect
		} = this.props;
		let data = [];

		dataset.forEach(d => {
			const obj = {
				name: d.name,
				values: {}
			};

			Object.keys(d.values).forEach(value => {
				Object.keys(d.values[value]).forEach(type => {
					obj.values[type] = obj.values[type] || 0;
					obj.values[type] += +d.values[value][type];
				});
			});
			data.push(obj);
		});

		const bodyHtml = (datapoint) => (<div className = "summary-section" key = {datapoint[0]}>
			<div className = "summary-name">{datapoint[0]} </div>
			<div className = "summary-value">Rs. {numberToMoney(datapoint[1].toFixed(2))}</div>
		</div>);
		const bodyHtmlMaker = (datapoints) => Object.entries(datapoints).map(e => bodyHtml(e));

		const cardHtml = data.map(e => {
			const viewWord = e.name.replace(/ +/g, "");
			return (
				<div
					key = {e.name}
					onClick = {() => onSelect(viewWord)}
					className = { viewWord === selected ? 'summary-card-container selected' : 'summary-card-container'}>
					<Card
				 header = {e.name}
				 body = {bodyHtmlMaker(e.values)}
				 classPrefix = 'budget-summary'
					></Card>
				 </div>
			);
		});

		return (
			<div className = "budget-summary budget-analysis-section">
				{cardHtml}
			</div>
		);
	}
}

export default BudgetSummary;