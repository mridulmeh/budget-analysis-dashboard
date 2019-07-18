import React from 'react';
import './budget-summary.css';
import { Card } from '../../components';

class BudgetSummary extends React.Component {

	render () {

		const cardHtml = ['Capital Expenditure','Revenue Expenditure', 'Capital Receipts','Revenue Receipts'].map(e => {
			return (
				<Card body = {e} classPrefix = 'budget-summary'></Card>
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