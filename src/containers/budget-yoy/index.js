import React from 'react';
import './budget-yoy.css';
import { BarChart, Card } from '../../components';
import { separateDataKeys } from '../../utils';

class BudgetYOY extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			view: 'Revenue Receipts',
			dataPresent: false
		};
	}

	static getDerivedStateFromProps (props, state){
		const {
			dataset
		} = props;

		const mappedData = {};
		const allTypes = [];

		dataset && dataset.forEach(e => {
			mappedData[e.Particulars] = e;
			allTypes.push(e.Particulars.trim());
		});

		state.mappedData = mappedData;
		state.allTypes = allTypes;

		state.dataPresent = (dataset && dataset.length) ? true : false;
		return state;
	}

	render () {
		const {
			mappedData,
			view,
			dataPresent
		} = this.state;
		const {
			onYearChage
		} = this.props;

		const currData = mappedData[view];
		let barData = {};

		if(dataPresent){
			barData = separateDataKeys(currData);
		}

		const sequence = ['Budget Estimates', 'Revised Estimates', 'Actuals'];

		return (
			<div className = "budget-yoy budget-analysis-section">
				<Card header= "Year on Year"
					body = {(<BarChart
						events = {{
							onXAxisClick: onYearChage
						}}
						data = {barData}
						sequence = {sequence}></BarChart>)}
					classPrefix = "budget">
				</Card>
			</div>
		);
	}
}

export default BudgetYOY;