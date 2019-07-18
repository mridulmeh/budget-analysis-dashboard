import React from 'react';
import './budget-dist.css';
import { BubbleChart, Card } from '../../components';
import * as d3 from 'd3';

class BudgetDistribution extends React.Component {

	render () {
		const {
			dataset
		} = this.props;

		let nestedData = [];
		if(dataset){
			 nestedData = 	d3.nest()
				.key(d => d['Major Account Code']).entries(dataset)
				.filter(d => d.key.length > 0);

			nestedData = { key: 'data', values: nestedData };
		}

		const size = '2014-15 Revised Estimates';
		const name = 'Major Account Head Description';

		return (
			<div className = "budget-distribution budget-analysis-section">
				<Card header= "Budget Distribution" body = {
					(<BubbleChart data = {nestedData} size = {size} nameKey = {name}>

					</BubbleChart>)} classPrefix = 'budget' ></Card>
			</div>
		);
	}
}

export default BudgetDistribution;