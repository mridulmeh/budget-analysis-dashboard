import React from 'react';
import './budget-dist.css';
import { BubbleChart, Card } from '../../components';
import { procesDataForBubble, groupFnMap } from './helper';
import { hierarchy, years } from '../../enums';

class BudgetDistribution extends React.Component {
	constructor (){
		super();
		this.state = {
			groupFn: "Sum",
			hierarchy: []
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

		const size = yearView ? [`${yearView} ${estimateView}`] : years.map(year => [`${year} ${estimateView}`]);
		const hierarchyPos = hierarchy.indexOf(deepDiveView.name) + 1;
		const name = hierarchyPos === hierarchy.length ? hierarchy[hierarchyPos - 1] : hierarchy[hierarchyPos];

		debugger;
		if(dataset){
			const { data: processedData, hasDataFlag } = procesDataForBubble(dataset, name, size, groupFn);
			nestedData = hasDataFlag === 0 ? { values: [] } : { key: 'data', values: processedData };
		}

		const groupFnOptions = Object.keys(groupFnMap).map(val => {
			return (
				<option key = {val} value = {val}>{val}</option>
			);
		});

		const events = {
			onBubbleClick: onDeepDive
		};

		const bubbleChartHtml = (<BubbleChart
			data = {nestedData}
			size = {'value'}
			events = {events}
			nameKey = {name}>
		</BubbleChart>);

		const noDataHtml = (<div>Nothing to show here</div>);

		const chartHtml = !nestedData.values.length ? noDataHtml : bubbleChartHtml;

		const historyHtml = (deepDiveView) =>
			deepDiveView.value ? (<div> for {deepDiveView.name}  : <b>{deepDiveView.value}</b></div>) : '';

		return (
			<div className = "budget-distribution budget-analysis-section">

				<Card header= "Budget Distribution" body = {
					(<div className = "budget-distribution-body">
						<div className = "budget-dist-selectors">
							{/* <div className = "budget-dist-button">
								{historyExists ? (<div onClick = {loadPreviousState}>
									<span>&#x3C; </span>Back</div>) : ''} */}
							{/* </div> */}
							<div className = "budget-dist-grouping" >
								<span className = "budget-dist-grouping-header"> Choose Grouping Types : </span>
								<select
									className = "budget-dist-grouping-select"
									value = {groupFn}
									onChange = {(e) => this.changeGrouping(e.target.value)}>
									{groupFnOptions}
								</select>
							</div>
						</div>
						<div className = "budget-dist-bubble-chart">
							{chartHtml}
						</div>
						<div className = "budget-dist-footer">
							<div className = "budget-dist-summary">
							Distribution of <b>{estimateView}</b> across
								<b>{yearView ? ` ${yearView}` : ' all the years '}</b>  <br/>
								{historyHtml(deepDiveView)}
							</div>
							<div className = "budget-dist-guide">
								<i><b>Note: </b>Click anywhere in the charts/summaries/axis labels to change view</i>
							</div>

						</div>
					</div>)} classPrefix = 'budget' ></Card>
			</div>
		);
	}
}

export default BudgetDistribution;