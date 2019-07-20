import * as d3 from 'd3';
import { getDimensionsFromMountPoint, makeElement } from '../../utils';

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes (root, nameKey, size) {

	const classes = [];

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

const getBubbleParams = (width, height) => {
	const diameter = Math.min(width, height);
	const format = d3.format(",d");
	const color = d3.scaleOrdinal(d3.schemeCategory10);

	const bubble = d3.pack()
		.size([diameter, diameter])
		.padding(1.5);
	return {
		format,
		color,
		bubble
	};

};

export const createBubbleChart = (mountPoint, data, size, nameKey) => {
	const svg = d3.select(mountPoint).attr("class", "bubble");

	const {
		width,
		height
	} = getDimensionsFromMountPoint(mountPoint);

	const {
		format,
		color,
		bubble
	} = getBubbleParams(width, height);

	const root = d3.hierarchy(classes(data, nameKey, size))
		.sum(function (d) { return d.value; })
		.sort(function (a, b) { return b.value - a.value; });

	bubble(root);

	const nodeContainer = makeElement(svg, 'g', [1], 'node-container');

	nodeContainer.attr("transform", function (d) {
		let x = 0;
		let y = 0;
		if(height > width){
			y = (height - width) / 2;
		} else {
			x = (width - height) / 2;
		}
		return "translate(" + x + "," + y + ")";
	});

	const node = makeElement(nodeContainer, 'g', root.children, 'node');

	node.attr("transform", function (d) {
		return "translate(" + d.x + "," + d.y + ")";
	});

	makeElement(node, 'title', d => [d], 'title')
		.text(function (d) { return d.data.className + ": " + format(d.value); });

	makeElement(node, 'circle', d => [d], 'circle')
		.attr("r", function (d) { return d.r; })
		.style("fill", function (d) {
			return color(d.data.packageName);
		});

	makeElement(node, 'text', d => [d], 'text')
		.attr("dy", ".3em")
		.style("text-anchor", "middle")
		.text(function (d) { return d.data.className ? d.data.className.substring(0, d.r / 3) : ''; });

};

