import React from 'react';
import './budget-yoy.css';
import { BarChart, Card } from '../../components';
import { separateDataKeys, camelCaseToWords } from '../../utils';
import { sequence } from '../../enums';

class BudgetYOY extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			dataPresent: false
		};
	}

	static getDerivedStateFromProps (props, state){
		const {
			dataset
		} = props;

		const mappedData = {};
		const allTypes = [];

		dataset && dataset.forEach(e => {
			mappedData[e.Particulars] = e;
			allTypes.push(e.Particulars.trim());
		});

		state.mappedData = mappedData;

		state.allTypes = allTypes;

		state.dataPresent = (dataset && dataset.length) ? true : false;
		return state;
	}

	render () {
		let barData = {};
		const {
			mappedData,
			dataPresent
		} = this.state;
		const {
			view,
			estimateView,
			yearView,
			onYearChage,
			onEstimateChange
		} = this.props;
		const {
			financialView,
			deepDiveView
		} = view;

		const currData = mappedData[camelCaseToWords(financialView).trim()];

		if(dataPresent){
			barData = separateDataKeys(currData);

		}

		const bodyHtml = (<BarChart
			selectedPoint = {{
				bar: estimateView,
				xAxisTick: yearView
			}}
			events = {{
				onXAxisClick: onYearChage,
				onBarClick: (datum) => onEstimateChange(datum.key)
			}}
			data = {barData}
			sequence = {sequence}></BarChart>);

		return (
			<div className = "budget-yoy budget-analysis-section">
				<Card header= {`Year on Year: ${deepDiveView.value ? deepDiveView.value : deepDiveView.name}`}
					body = {bodyHtml}
					classPrefix = "budget">
				</Card>
			</div>
		);
	}
}

export default BudgetYOY;