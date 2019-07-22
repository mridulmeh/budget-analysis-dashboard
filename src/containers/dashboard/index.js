import React from 'react';
import { dataLoader, mergeRecursive } from '../../utils';
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
		this.history = [];
		this.state = {
			dataPresent: false,
			views: {
				budgetYoy: 'BudgetSummaryStatement',
				budgetDist: {
					financialView: 'CapitalExpenditure',
					yearView: '',
					estimateView: 'Actuals',
					deepDiveView: {
						name: 'Summary',
						value: ''
					}
				},
				budgetBreakdown: {
					type: 'top',
					estimateView: 'Actuals',
					yearView: '',
					deepDiveView: {
						name: 'Summary',
						value: ''
					},
					financialView: 'CapitalExpenditure'
				},
				budgetSummary: {
					financialView: 'CapitalExpenditure',
					yearView: '2012-13',
					deepDiveView: {
						name: 'Summary',
						value: ''
					}
				}

			}

		};
	}

	backToPreviousState () {
		const lastState = this.history.pop();
		this.setState(lastState);
	}

	updateHistory (state) {
		this.history.push(state);
	}

	// Loading the data from a fetch request
	loadData (){

		return dataLoader().then(allDataSets => {
			allDataSets.forEach(e => {
				const key = Object.keys(e);
				this.data[key] = e[key];
			});
			this.updateHistory(this.state);
			this.setState({
				dataPresent: true
			});

		});

	}

	changeSortType () {

		this.setState((prevState) => {
			this.updateHistory(prevState);
			const newView = mergeRecursive({}, prevState.views);
			const {
				budgetYoy,
				budgetDist,
				budgetSummary,
				budgetBreakdown
			} = newView;

			budgetBreakdown.type = budgetBreakdown.type === 'top' ? 'bottom' : 'top';

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

	changeDeepDiveView (value, addDiff = 1) {
		const {
			deepDiveView
		} = this.state.views.budgetDist;
		const newHierarchyPos = hierarchy.indexOf(deepDiveView.name) + addDiff;
		const newHierarchy = hierarchy[newHierarchyPos];

		if(newHierarchyPos < hierarchy.length){
			this.setState((prevState) => {
				this.updateHistory(prevState);
				const newView = mergeRecursive({}, prevState.views);
				const {
					budgetYoy,
					budgetDist,
					budgetSummary,
					budgetBreakdown
				} = newView;

				budgetDist.deepDiveView = {
					name: newHierarchy,
					value
				};
				budgetSummary.deepDiveView = {
					name: newHierarchy,
					value
				};
				budgetBreakdown.deepDiveView = {
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

	changeEstimateMetric (metricChosen) {

		this.setState ((prevState) => {
			this.updateHistory(prevState);
			const newView = mergeRecursive({}, prevState.views);
			const {
				budgetYoy,
				budgetDist,
				budgetSummary,
				budgetBreakdown
			} = newView;

			budgetBreakdown.estimateView = metricChosen;
			budgetDist.estimateView = metricChosen;

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

	changeYearMetric (year) {
		this.setState ((prevState) => {
			this.updateHistory(prevState);
			const newView = mergeRecursive({}, prevState.views);
			const {
				budgetYoy,
				budgetDist,
				budgetSummary,
				budgetBreakdown
			} = newView;

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
			this.updateHistory(prevState);
			const newView = mergeRecursive({}, prevState.views);
			const {
				budgetYoy,
				budgetDist,
				budgetSummary,
				budgetBreakdown
			} = newView;

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

		const budgetSummData = getBudgetSummaryData(this.data, budgetSummary);

		const budgetBreakdownData = getBudgetBreakdown(this.data, budgetBreakdown);

		return (
			<div className = "budget-analysis-container">
				<Header
					historyExists = {this.history.length > 1 ? true : false}
					loadPreviousState = {(...params) => this.backToPreviousState(...params)}
				></Header>
				<BudgetSummary
					onSelect = {(...params) => this.changeFinancialMetric(...params)}
					dataset = {budgetSummData}
					selected = {budgetSummary.financialView}></BudgetSummary>
				<div className = "budget-analysis-section-left">
					<BudgetYOY
						estimateView = {budgetDist.estimateView}
						yearView = {budgetDist.yearView}
						onYearChage = {(...params) => this.changeYearMetric(...params)}
						onEstimateChange = {(...params) => this.changeEstimateMetric(...params)}
						dataset = {budgetYOYData}></BudgetYOY>
					<BudgetBreakDown
						changeSortType= {(...params) => this.changeSortType(...params)}
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