import * as d3 from 'd3';
import { makeElement, getDimensionsFromMountPoint } from '../../utils';

const getDataInfo = (data, sequence) => {
	let maxVal = 0;
	const categories = Object.keys(data);
	const groupNames = [];

	categories.forEach(e => {
		const values = Object.keys(data[e]);
		groupNames.push(...values);

		values.forEach(f => {
			maxVal = Math.max(data[e][f], maxVal);
		});
	});

	const actualGroupNames = sequence || [...new Set(groupNames)];

	return {
		groupNames: actualGroupNames,
		categories,
		maxVal
	};
};

const getScales = (width, height) => {

	// The scale spacing the groups:
	const x0 = d3.scaleBand()
		.rangeRound([0, width - 100])
		.paddingInner(0.1);

	// The scale for spacing each group's bar:
	const x1 = d3.scaleBand()
		.padding(0.05);

	// The scale for y axis
	const y = d3.scaleLinear()
		.rangeRound([height, 0]);

	// The scale for colors
	const colorScale = d3.scaleOrdinal()
		.range(d3.schemeSet1);

	return {
		x0,
		x1,
		y,
		colorScale
	};
};

const createBars = (data, mountPoint, x0Scale, events, selectedPoint) => {
	const rectGroupContainer = makeElement(mountPoint, 'g', Object.keys(data), 'bar-group-container');

	rectGroupContainer.attr("transform", d => "translate(" + x0Scale(d) + ",0)");

	const rectGroup = makeElement(rectGroupContainer, 'g', d => [d], 'bar-group');

	const rect = makeElement(rectGroup, 'rect', (d) => {

		return	Object.keys(data[d]).map(key => ({
			key: key,
			value: +data[d][key]
		})
		) ; }, 'bar')
		.classed('selected', (d) => {
			return	d.key === selectedPoint.bar ? true : false;
		});

	rect.on('click', function (...params) {
		events.onBarClick && events.onBarClick(...params);
	});

	return rect ;

};

const createLegend = (mountPoint, groupNames, width, colorScale, events) => {

	const legendGroupOuter = makeElement(mountPoint, 'g', [1], 'legend-outer');

	legendGroupOuter.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("text-anchor", "end");

	const legendGroup = makeElement(legendGroupOuter, 'g',
		groupNames.slice().reverse().map(e => ({ key: e })), 'legend-group')
		.attr("transform", (d, i) => "translate(0," + i * 20 + ")" );

	legendGroup.on('click',(...params) => {
		events.onBarClick && events.onBarClick(...params);
	});

	makeElement(legendGroup, 'rect', d => [d], 'legend-rect')

		.attr("x", width - 17)
		.attr("width", 15)
		.attr("height", 15)
		.attr("fill", d => colorScale(d.key))
		.attr("stroke", d => colorScale(d.key))
		.attr("stroke-width",2);

	makeElement(legendGroup, 'text', d => [d], 'legend-text')
		.attr("x", width - 24)
		.attr("y", 9.5)
		.attr("dy", "0.32em")
		.text(d => d.key);
};

export const createBarChart = (mountPoint, data, sequence, events = {}, selectedPoint = {}) => {
	const {
		onXAxisClick
	} = events;

	const {
		categories,
		groupNames,
		maxVal
	} = getDataInfo(data, sequence);

	const {
		width,
		height,
		margin
	} = getDimensionsFromMountPoint(mountPoint);

	const {
		x0,
		x1,
		y,
		colorScale
	} = getScales(width, height);

	const svg = d3.select(mountPoint);
	const g = makeElement(svg, 'g', [1], 'svg-group');
	g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x0.domain(categories);
	x1.domain(groupNames).rangeRound([0, x0.bandwidth()]);
	y.domain([0, maxVal]).nice();

	let rect = createBars(data, g, x0, events, selectedPoint);

	rect = rect.attr("x", function (d) { return x1(d.key); })
		.attr("width", x1.bandwidth());

	if (!rect.attr('y')) {
		rect = rect.attr("y", function (d) {
			return height;
		}).attr("height", function (d) {
			return 0;
		});
	}

	rect.transition()
	  .duration(350)
	  .attr("height", function (d) {
			return height - y(d.value);
		})
	  .attr("y", function (d) {
		   return y(+d.value);
		 })

		.attr("fill", function (d) { return colorScale(d.key); });

	const xAxis = makeElement(g, 'g', [1], 'xAxis');
	xAxis.classed('x', true);
	xAxis.classed('axis', true);
	xAxis.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x0));

	d3.selectAll('.x.axis .tick')
		.classed('tick-selected', (d) => {
			return 	d === selectedPoint.xAxisTick ? true : false;
		})
		.on('click', function (...params) {
			onXAxisClick && onXAxisClick(...params);
		});

	const yAxis = makeElement(g, 'g', [1], 'yAxis');
	yAxis.classed('y', true);
	yAxis.classed('axis', true);
	yAxis
		.call(d3.axisLeft(y).ticks(null, "s"));

	const yAxisLabel = makeElement(yAxis, 'text', [1], 'axis-label');

	yAxisLabel
	  .attr("x", 2)
	  .attr("y", y(y.ticks().pop()) + 0.5)
	  .attr("dy", "0.32em")
	  .attr("fill", "#000")
	  .attr("font-weight", "bold")
	  .attr("text-anchor", "start")
		.text("in Lakhs");

	createLegend(g, groupNames, width, colorScale, events);

};