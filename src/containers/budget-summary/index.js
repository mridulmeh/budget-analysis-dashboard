import React from 'react';
import { dataLoader } from '../../utils';
import './budget-summary.css';


class BudgetSummary extends React.Component {
	constructor () {
		super(); 
		this.data = {};
		this.state = {
			dataPresent: false
		};
	}

	// Loading the data from a fetch request
	loadData (){

		return dataLoader().then(allDataSets => {
			allDataSets.forEach(e=>{
				const key = Object.keys(e)
				this.data[key] = e[key]
			})
	
			this.setState({
				dataPresent: true
			});

		});
		

	}

	componentDidMount () {
		this.loadData();
	}
	
	render () {

		return (
			<div className = "budget-summary budget-analysis-section">
			 
			</div>
		);
	}
}

export default BudgetSummary;