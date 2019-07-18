import React from 'react';
import './card.css';

class Card extends React.Component {

	render () {
		const {
			header,
			body,
			classPrefix
		} = this.props;

		return (
			<div className = {`card-section ${classPrefix}-card-section`}>
				<div className = {`card-section-header ${classPrefix}-card-section-header`}>
					{header}
				</div>
				<div className = {`card-section-body ${classPrefix}-card-section-body`}>
					{body}
				</div>
			</div>
		);
	}
}

export default Card;