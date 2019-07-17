import React from 'react';
import './budget-yoy.css';
import { BarChart } from '../../components';


class BudgetYOY extends React.Component {
	render () {

		return (
			<div className = "budget-yoy budget-analysis-section">
				<div className = "budget-card">
					<BarChart></BarChart>
				</div>
			</div>
		);
	}
}

export default BudgetYOY;