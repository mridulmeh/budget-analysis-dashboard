import React from 'react';
import './budget-dist.css';
import { BubbleChart } from '../../components';

class BudgetDistribution extends React.Component {

	render () {

		return (
			<div className = "budget-distribution budget-analysis-section">
                <div className = "budget-card">
                    <BubbleChart></BubbleChart>
                </div>
			</div>
		);
	}
}

export default BudgetDistribution;