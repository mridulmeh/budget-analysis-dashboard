import React from 'react';
import { createBubbleChart } from './helper';

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
			nameKey
		} = this.props;

		if (data && data.key) {
			createBubbleChart(this.node, data, size, nameKey);
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