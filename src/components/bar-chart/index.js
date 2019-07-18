import React from 'react';
import * as d3 from 'd3';

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
			data
		} = this.props;

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

		const actualGroupNames = [...new Set(groupNames)];

		var svg = d3.select(this.node);
		const bBox = this.node.getBoundingClientRect();
		var margin = { top: 20, right: 20, bottom: 30, left: 40 };

		var width = bBox.width - margin.left - margin.right;
		// +svg.attr("width") - margin.left - margin.right,
		var height = bBox.height - margin.top - margin.bottom;
		//+svg.attr("height") - margin.top - margin.bottom,
		var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// The scale spacing the groups:
		var x0 = d3.scaleBand()
			.rangeRound([0, width - 100])
			.paddingInner(0.1);

		// The scale for spacing each group's bar:
		var x1 = d3.scaleBand()
			.padding(0.05);

		var y = d3.scaleLinear()
			.rangeRound([height, 0]);

		var z = d3.scaleOrdinal()
			.range(["blue", "green", "red"]);

		x0.domain(categoriesNames);
		x1.domain(actualGroupNames).rangeRound([0, x0.bandwidth()]);
		y.domain([0, maxVal]).nice();

		g.append("g")
	  .selectAll("g")
	  .data(Object.keys(data))
	  .enter().append("g")
	  .attr("class","bar")
	  .attr("transform", function (d) { return "translate(" + x0(d) + ",0)"; })
	  .selectAll("rect")
	  .data(function (d) {
		  return Object.keys(data[d]).map(function (key) { return { key: key, value: data[d][key] }; });
			})
	  .enter().append("rect")
	  .attr("x", function (d) { return x1(d.key); })
	  .attr("y", function (d) { return y(d.value); })
	  .attr("width", x1.bandwidth())
	  .attr("height", function (d) {
		  return height - y(d.value);
			})
	  .attr("fill", function (d) { return z(d.key); });

		g.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x0));

		g.append("g")
	  .attr("class", "y axis")
	  .call(d3.axisLeft(y).ticks(null, "s"))
	  .append("text")
	  .attr("x", 2)
	  .attr("y", y(y.ticks().pop()) + 0.5)
	  .attr("dy", "0.32em")
	  .attr("fill", "#000")
	  .attr("font-weight", "bold")
	  .attr("text-anchor", "start")
	  .text("in Lakhs");

	  var legend = g.append("g")
			.attr("font-family", "sans-serif")
			.attr("font-size", 10)
			.attr("text-anchor", "end")
			.selectAll("g")
			.data(actualGroupNames.slice().reverse())
			.enter().append("g")
			.attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
			.attr("x", width - 17)
			.attr("width", 15)
			.attr("height", 15)
			.attr("fill", z)
			.attr("stroke", z)
			.attr("stroke-width",2);
		// .on("click",function (d) { update(d); });

		legend.append("text")
			.attr("x", width - 24)
			.attr("y", 9.5)
			.attr("dy", "0.32em")
			.text(function (d) { return d; });

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