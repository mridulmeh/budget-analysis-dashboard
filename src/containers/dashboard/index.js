import React from 'react';
import { dataLoader } from '../../utils';
import './budget-container.css';
import BudgetSummary from '../budget-summary';
import BudgetYOY from '../budget-yoy';
import BudgetDistribution from '../budget-dist';
import TopBottom from '../top-bottom';
import Header from '../header';


class DashboardContainer extends React.Component {
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
			<div className = "budget-analysis-container">
				<Header></Header>
				<BudgetSummary></BudgetSummary>
				<div className = "budget-analysis-section-left">
					<BudgetYOY></BudgetYOY>
					<TopBottom></TopBottom>
				</div>
				
				<BudgetDistribution></BudgetDistribution>
				
			</div>
		);
	}
}

export default DashboardContainer;