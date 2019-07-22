import React from 'react';
import ReactDOM from 'react-dom';
import BarChart from './index';
import * as d3 from 'd3';
import { shallow, mount } from 'enzyme';

class Comp extends React.Component {
	render () {
	  const {
		  data,
		  events
	  } = this.props;
		return <BarChart data = {data} ref={(node) => { this.portal = node; }} events = {events}/>;
	}
}

// assert on `portal`

const data = {
	first: {
		a: 100,
		b: 200
	},
	second: {
		a: 111
	}
};

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<BarChart/>, div);
	ReactDOM.unmountComponentAtNode(div);
});

it('renders without bar chart with appropriate data', (done) => {
	const wrapper = mount(<Comp data = {data}/>);
	const { portal } = wrapper.instance();
	expect(d3.select(portal.node).select('.legend-text').html()).toEqual('b');

	done();
});

it('renders with appropriate bar click', (done) => {
	let x = 10;
	const wrapper = mount(<Comp data = {data} events = {{
		onBarClick: () => {
			x = 12;
		}
	}}/>);
	const { portal } = wrapper.instance();
	d3.select(portal.node).select('.bar').on('click')();
	expect(x).toEqual(12);

	done();
});