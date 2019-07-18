import React from 'react';
import './top-bottom.css';
import { Card } from '../../components';

class TopBottom extends React.Component {

	render () {

		return (
			<div className = "budget-top-bottom budget-analysis-section">
			 	<Card classPrefix = "budget"></Card>
			</div>
		);
	}
}

export default TopBottom;