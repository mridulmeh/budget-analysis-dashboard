import React from 'react';
import './budget-yoy.css';
import { BarChart, Card } from '../../components';

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

		const currData = mappedData[view];
		const barData = {};

		if(dataPresent){
			Object.keys(currData).forEach(key => {
				const splitKey = key.trim().split(' ');
				const yearKey = splitKey.shift();

				if(splitKey.length > 0) {
					const joinedKey = splitKey.join(' ').trim();
					// barData[joinedKey] = barData[joinedKey] || {};
					// barData[joinedKey][yearKey] = currData[key];
					barData[yearKey] = barData[yearKey] || {};
					barData[yearKey][joinedKey] = currData[key];
				}
			});
		}

		return (
			<div className = "budget-yoy budget-analysis-section">
				<Card body = {(<BarChart data = {barData}></BarChart>)} classPrefix = "budget">
				</Card>
			</div>
		);
	}
}

export default BudgetYOY;