import React from 'react';
import './budget-dist.css';
import { BubbleChart, Card } from '../../components';

const applyGrouping = (hashMap, fn, nameKey, size) => {
	const groupedData = [];

	Object.keys(hashMap).forEach(key => {
		if(key.length){
			groupedData.push({
				key,
				values: [{
					[nameKey]: key,
					[size]: fn(hashMap[key])
				}]
			});
		}
	});
	return groupedData;
};

const procesDataForBubble = (data, nameKey, size, groupFn = (d) => d[0]) => {
	const dataHashMap = {};
	data.forEach(e => {
		if(!dataHashMap[e[nameKey]]){
			dataHashMap[e[nameKey]] = [];
		}
		dataHashMap[e[nameKey]].push(e[size]);
	});

	return applyGrouping(dataHashMap, groupFn, nameKey, size);
};

class BudgetDistribution extends React.Component {

	render () {
		const {
			dataset,
			viewSettings
		} = this.props;
		const {
			yearView
		} = viewSettings;

		const size = `${yearView} Revised Estimates`;
		const name = 'Function';

		let nestedData = [];
		if(dataset){
			const processedData = procesDataForBubble(dataset, name, size);
			nestedData = { key: 'data', values: processedData };
		}

		return (
			<div className = "budget-distribution budget-analysis-section">

				<Card header= "Budget Distribution" body = {
					(<div className = "budget-distribution-body">
						<div className = "budget-dist-selectors">
							<select>
								<option value = "sum"></option>
							</select>
						</div>
						<div className = "budget-dist-bubble-chart">
							<BubbleChart data = {nestedData} size = {size} nameKey = {name}>

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