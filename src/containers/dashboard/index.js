import React from 'react';
import { dataLoader } from '../../utils';
import './budget-container.css';
import BudgetSummary from '../budget-summary';
import BudgetYOY from '../budget-yoy';
import BudgetDistribution from '../budget-dist';
import BudgetBreakDown from '../break-down';
import Header from '../header';
import { getBudgetYOYDataData, getBudgetDistData, getBudgetSummaryData, getBudgetBreakdown } from './data-loader';
import { hierarchy } from '../../enums';

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
					yearView: '2013-14',
					estimateView: 'Revised Estimates',
					deepDiveView: {
						name: 'Summary',
						value: ''
					}
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

	changeDeepDiveView (value, addDiff = 1) {
		const {
			deepDiveView
		} = this.state.views.budgetDist;
		const newHierarchyPos = hierarchy.indexOf(deepDiveView.name) + addDiff;
		const newHierarchy = hierarchy[newHierarchyPos];

		if(newHierarchyPos < hierarchy.length - 1){
			this.setState((prevState) => {
				const {
					budgetYoy,
					budgetDist,
					budgetSummary,
					budgetBreakdown
				} = prevState.views;

				budgetDist.deepDiveView = {
					name: newHierarchy,
					value
				};

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
					onDeepDive = {(...params) => this.changeDeepDiveView(...params)}
				  viewSettings = {budgetDist}
					dataset = {budgetDistData}></BudgetDistribution>

			</div>
		);
	}
}

export default DashboardContainer;