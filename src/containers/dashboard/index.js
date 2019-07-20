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
					deepDiveView: 'Detailed Account Code Description',
					view: 'CapitalExpenditure'
				},
				budgetSummary: {
					selectedView: 'CapitalExpenditure',
					deepDiveView: 'BudgetSummaryStatement'
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

	changeFinancialMetric (metricChosen) {
		this.setState ({
			views: {
				budgetDist: metricChosen,
				budgetBreakdown: {
					type: 'top',
					value: 'Actuals',
					year: '2013-14',
					deepDiveView: 'Detailed Account Code Description',
					view: metricChosen
				},
				budgetSummary: {
					selectedView: metricChosen,
					deepDiveView: 'BudgetSummaryStatement'
				}
			}
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
			budgetBreakdown,
			budgetSummary
		} = views;

		const budgetYOYData = getBudgetYOYDataData(budgetYoy, this.data);

		const budgetDistData = getBudgetDistData(budgetDist, this.data);

		const budgetSummData = getBudgetSummaryData(this.data[budgetSummary.deepDiveView]);

		const budgetBreakdownData = getBudgetBreakdown(this.data, budgetBreakdown);

		return (
			<div className = "budget-analysis-container">
				<Header></Header>
				<BudgetSummary
					onSelect = {(...params) => this.changeFinancialMetric(...params)}
					dataset = {budgetSummData}
					selected = {budgetSummary.selectedView}></BudgetSummary>
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