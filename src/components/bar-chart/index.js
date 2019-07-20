import React from 'react';
import * as d3 from 'd3';
import { createBarChart } from './helper';

// const data = [[{
// 	name: "Revised",
// 	values:  {
// 		"2012-13": 100,
// 		"2013-14": 200
// 	},
// }],[{
// 	name: "Actuals",
// 	values: {
// 		"2012-13": 130,
// 		"2013-14": 210
// 	},
// }],[{
// 	name: "Estimates",
// 	values: {
// 		"2012-13": 150,
// 		"2013-14": 160
// 	}
// }];

class BarChart extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			expand: null
		};
	}

	componentDidUpdate (){
		this.createBar();
	}

	componentDidMount (){
		this.createBar();
	}

	createBar () {
		const {
			data,
			sequence
		} = this.props;

		if(Object.keys(data).length){
			var categoriesNames = Object.keys(data);
			var groupNames = [];
			let maxVal = 0;

			categoriesNames.forEach(e => {
				const values = Object.keys(data[e]);
				groupNames.push(...values);

				values.forEach(f => {
					maxVal = Math.max(data[e][f], maxVal);
				});
			});

			const actualGroupNames = sequence || [...new Set(groupNames)];

			createBarChart(this.node, data, sequence);
		}
	}

	render () {
		const styles = {
			width: "90%",
			height: "90%"
		};

		return (
			<svg ref = {node => this.node = node} height = {"90%"} width = {"90%"} style = {styles}>
			</svg>
		);
	}
}

export default BarChart;