import React from 'react';
import { createBubbleChart } from './helper';
import './bubble-chart.css';

class BubbleChart extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			expand: null
		};
	}

	componentDidUpdate () {
		this.createBubble();
	}

	componentDidMount () {
		this.createBubble();
	}

	createBubble () {

		let {
			data,
			size,
			nameKey,
			events
		} = this.props;

		if (data && data.key) {
			createBubbleChart(this.node, data, size, nameKey, events);
		}
	}

	render () {

		return (
			<svg ref={node => this.node = node} height={"100%"} width={"100%"}>
			</svg>
		);
	}
}

export default BubbleChart;