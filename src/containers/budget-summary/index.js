import React from 'react';
import './budget-summary.css';


class BudgetSummary extends React.Component {

	render () {

		return (
			<div className = "budget-summary budget-analysis-section">
				<div className = "budget-card"></div>
				<div className = "budget-card"></div>
				<div className = "budget-card"></div>
				<div className = "budget-card"></div>
			</div>
		);
	}
}

export default BudgetSummary;