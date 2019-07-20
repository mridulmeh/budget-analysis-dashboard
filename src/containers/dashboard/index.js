import React from 'react';
import { dataLoader } from '../../utils';
import './budget-container.css';
import BudgetSummary from '../budget-summary';
import BudgetYOY from '../budget-yoy';
import BudgetDistribution from '../budget-dist';
import BudgetBreakDown from '../break-down';
import Header from '../header';
import { getBudgetYOYDataData, getBudgetDistData, getBudgetSummaryData, getBudgetBreakdown } from './data-loader';

class DashboardContainer extends React.Component {
	constructor () {
		super();
		this.data = {};
		this.state = {
			dataPresent: false,
			views: {
				budgetYoy: 'BudgetSummaryStatement',
				budgetDist: 'CapitalExpenditure',
				budgetBreakdown: {
					type: 'top',
					value: 'Actuals',
					year: '2013-14',
					key: 'Detailed Account Code Description'
				}

			}

		};
	}

	// Loading the data from a fetch request
	loadData (){

		return dataLoader().then(allDataSets => {
			allDataSets.forEach(e => {
				const key = Object.keys(e);
				this.data[key] = e[key];
			});

			this.setState({
				dataPresent: true
			});

		});

	}

	componentDidMount () {
		this.loadData();
	}

	render () {
		const {
			views
		} = this.state;
		const {
			budgetYoy,
			budgetDist,
			budgetBreakdown
		} = views;

		const budgetYOYData = getBudgetYOYDataData(budgetYoy, this.data);

		const budgetDistData = getBudgetDistData(budgetDist, this.data);

		const budgetSummData = getBudgetSummaryData(this.data['BudgetSummaryStatement']);
		console.log(this.data);
		const budgetBreakdownData = getBudgetBreakdown(this.data['CapitalExpenditure'], budgetBreakdown);

		return (
			<div className = "budget-analysis-container">
				<Header></Header>
				<BudgetSummary dataset = {budgetSummData}></BudgetSummary>
				<div className = "budget-analysis-section-left">
					<BudgetYOY dataset = {budgetYOYData}></BudgetYOY>
					<BudgetBreakDown dataset = {budgetBreakdownData} viewSettings = {budgetBreakdown}></BudgetBreakDown>
				</div>

				<BudgetDistribution dataset = {budgetDistData}></BudgetDistribution>

			</div>
		);
	}
}

export default DashboardContainer;