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
				budgetDist: {
					financialView: 'CapitalExpenditure',
					yearView: '2013-14'
				},
				budgetBreakdown: {
					type: 'top',
					value: 'Actuals',
					yearView: '2013-14',
					deepDiveView: 'Detailed Account Code Description',
					financialView: 'CapitalExpenditure'
				},
				budgetSummary: {
					financialView: 'CapitalExpenditure',
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

	changeYearMetric (year) {
		this.setState ((prevState) => {
			const {
				budgetYoy,
				budgetDist,
				budgetSummary,
				budgetBreakdown
			} = prevState.views;

			budgetBreakdown.yearView = year;
			budgetDist.yearView = year;
			return {
				views: {
					budgetYoy,
					budgetDist,
					budgetSummary,
					budgetBreakdown
				}
			};
		});
	}

	changeFinancialMetric (metricChosen) {
		this.setState ((prevState) => {
			const {
				budgetBreakdown,
				budgetSummary,
				budgetYoy,
				budgetDist
			} = prevState.views;

			budgetBreakdown.financialView = metricChosen;
			budgetSummary.financialView = metricChosen;
			budgetDist.financialView = metricChosen;
			return {
				views: {
					budgetYoy,
					budgetDist,
					budgetBreakdown,
					budgetSummary
				}
			};
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

		const budgetYOYData = getBudgetYOYDataData(this.data, budgetYoy);

		const budgetDistData = getBudgetDistData(this.data, budgetDist);

		const budgetSummData = getBudgetSummaryData(this.data[budgetSummary.deepDiveView]);

		const budgetBreakdownData = getBudgetBreakdown(this.data, budgetBreakdown);

		return (
			<div className = "budget-analysis-container">
				<Header></Header>
				<BudgetSummary
					onSelect = {(...params) => this.changeFinancialMetric(...params)}
					dataset = {budgetSummData}
					selected = {budgetSummary.financialView}></BudgetSummary>
				<div className = "budget-analysis-section-left">
					<BudgetYOY
						onYearChage = {(...params) => this.changeYearMetric(...params)}
						dataset = {budgetYOYData}></BudgetYOY>
					<BudgetBreakDown
					  dataset = {budgetBreakdownData}
					  viewSettings = {budgetBreakdown}
					  ></BudgetBreakDown>
				</div>

				<BudgetDistribution
				  viewSettings = {budgetDist}
					dataset = {budgetDistData}></BudgetDistribution>

			</div>
		);
	}
}

export default DashboardContainer;