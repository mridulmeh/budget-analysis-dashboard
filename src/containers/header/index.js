import React from 'react';
import './header.css';

class Header extends React.Component {

	render () {
		const {
			loadPreviousState,
			historyExists
		} = this.props;

		return (
			<div className = "budget-header budget-analysis-section">
				<div className = "budget-back-button-container">
					{historyExists ? (<div onClick = {loadPreviousState}>
						{/* <span>&#x3C; </span> */}Back</div>) : ''}</div>
			 Budget Analysis Dashboard
			</div>
		);
	}
}

export default Header;