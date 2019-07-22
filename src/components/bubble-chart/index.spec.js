import React from 'react';
import ReactDOM from 'react-dom';
import BubbleChart from './index';
import * as d3 from 'd3';
import { shallow, mount } from 'enzyme';

class Comp extends React.Component {
	render () {
	  const {
			data,
			size,
			nameKey,
		  events
	  } = this.props;
		return <BubbleChart
			data = {data}
			size = {size}
			nameKey = {nameKey}
			ref={(node) => { this.portal = node; }}
			events = {events}/>;
	}
}

// assert on `portal`

const data = {
	key: 'data',
	values: [
		{
			key: 'b',
			value: 12
		}
	]

};

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<BubbleChart/>, div);
	ReactDOM.unmountComponentAtNode(div);
});

it('renders without bubble chart with appropriate data', (done) => {
	const wrapper = mount(<Comp data = {data} size = {'value'} name = {'key'}/>);
	const { portal } = wrapper.instance();

	d3.select(portal.node).select('.bubble-text').each(d => {
		expect(d.data.className).toEqual('b');
	});

	done();
});

it('renders with appropriate bubble click', (done) => {
	let x = 10;
	const wrapper = mount(<Comp data = {data}
		size = {'value'} name = {'key'}
		events = {{
			onBubbleClick: () => {
				x = 12;
			}
		}}/>);
	const { portal } = wrapper.instance();
	d3.select(portal.node).select('.bubble-node').on('click')();
	expect(x).toEqual(12);

	done();
});