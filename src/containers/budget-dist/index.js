import React from 'react';
import './budget-dist.css';
import { BubbleChart, Card } from '../../components';
import { procesDataForBubble, groupFnMap } from './helper';
import { hierarchy } from '../../enums';

class BudgetDistribution extends React.Component {
	constructor (){
		super();
		this.state = {
			groupFn: "Sum"
		};
	}

	changeGrouping (fnName) {
		this.setState({
			groupFn: fnName
		});
	}

	render () {
		let nestedData = [];
		const {
			dataset,
			viewSettings,
			onDeepDive
		} = this.props;
		const {
			yearView,
			estimateView,
			deepDiveView
		} = viewSettings;
		const {
			groupFn
		} = this.state;

		const size = `${yearView} ${estimateView}`;
		const name = hierarchy[hierarchy.indexOf(deepDiveView.name) + 1];

		if(dataset){
			const processedData = procesDataForBubble(dataset, name, size, groupFn);
			nestedData = { key: 'data', values: processedData };
		}

		const groupFnOptions = Object.keys(groupFnMap).map(val => {
			return (
				<option key = {val} value = {val}>{val}</option>
			);
		});

		const events = {
			onBubbleClick: onDeepDive
		};

		return (
			<div className = "budget-distribution budget-analysis-section">

				<Card header= "Budget Distribution" body = {
					(<div className = "budget-distribution-body">
						<div className = "budget-dist-selectors">
							<select
								value = {groupFn}
								onChange = {(e) => this.changeGrouping(e.target.value)}>
								{groupFnOptions}
							</select>
						</div>
						<div className = "budget-dist-bubble-chart">
							<BubbleChart
								data = {nestedData}
								size = {size}
								events = {events}
								nameKey = {name}>

							</BubbleChart>
						</div>
						<div className = "budget-dist-footer">

						</div>
					</div>)} classPrefix = 'budget' ></Card>
			</div>
		);
	}
}

export default BudgetDistribution;