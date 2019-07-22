import React from 'react';
import { createBarChart } from './helper';
import './bar.css';

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
			sequence,
			events,
			selectedPoint
		} = this.props;

		if(data && Object.keys(data).length){

			createBarChart(this.node, data, sequence, events, selectedPoint);
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