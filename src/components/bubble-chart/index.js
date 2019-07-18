import React from 'react';
import * as d3 from 'd3';

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
			var svg = d3.select(this.node).attr("class", "bubble");

			const bBox = this.node.getBoundingClientRect();
			var margin = { top: 20, right: 20, bottom: 30, left: 40 };

			var width = bBox.width - margin.left - margin.right;

			var height = bBox.height - margin.top - margin.bottom;

			var diameter = Math.min(width, height);
			var format = d3.format(",d");
			var color = d3.scaleOrdinal(d3.schemeAccent);

			var bubble = d3.pack()
				.size([diameter, diameter])
				.padding(1.5);

			var root = d3.hierarchy(classes(data))
				.sum(function (d) { return d.value; })
				.sort(function (a, b) { return b.value - a.value; });

			bubble(root);

			var node = svg.selectAll(".node")
				.data(root.children)
				.enter().append("g")
				.attr("class", "node")
				.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

			node.append("title")
				.text(function (d) { return d.data.className + ": " + format(d.value); });

			node.append("circle")
				.attr("r", function (d) { return d.r; })
				.style("fill", function (d) {
					return color(d.data.packageName);
				});

			node.append("text")
				.attr("dy", ".3em")
				.style("text-anchor", "middle")
				.text(function (d) { return d.data.className.substring(0, d.r / 3); });

			// Returns a flattened hierarchy containing all leaf nodes under the root.
			function classes (root) {

				var classes = [];

				function recurse (name, node) {
					if (node.values) {
						node.values.forEach(function (child) {
							recurse(node.key, child);
						});
					} else {
						classes.push({ packageName: name, className: node.key || node[nameKey], value: node[size] });
					}

				}

				recurse(null, root);
				return { children: classes };
			}

			// d3.select(self.frameElement).style("height", diameter + "px");
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