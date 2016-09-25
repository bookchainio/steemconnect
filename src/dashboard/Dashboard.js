const React = require('react'),
	ReactRedux = require('react-redux'),
	actions = require('../actions'),
	moment = require('moment'),
	_ = require('lodash'),
	{formatter} = require('steem'),
	{ Link }  = require('react-router'),
  Header = require('./../app/header');

class Dashboard extends React.Component {
	componentDidMount() {
		this.props.getAccountHistory(this.props.auth.user.name, -1, 5);
	}
	render() {
		let {reputation, name, accountHistory} = this.props.auth.user;
		return (
				<div>
          <Header />
					{accountHistory && <h2>Last Activity</h2>}
					{accountHistory && _.sortBy(accountHistory, 'timestamp').reverse().map(([id, transaction]) =>
						<Activity key={id} id={id} transaction={transaction}/>) }
        </div>
		);
	}
}

const Activity = ({id, transaction}) => {
	let {op, timestamp} = transaction;
	let [name, details] = op;
	let label = name.replace('account_update', 'Account Update').replace('vote', 'Vote');
	if (name == 'vote') {
		return <p key={id}>{label} for <a href="#" target="_blank"> @{details.author}/{details.permlink}</a> {moment(timestamp).fromNow() }</p>;
	} else if (_.includes(['account_update', 'vote'], name)) {
		return <p key={id}>{label} {moment(timestamp).fromNow() }</p>;
	}
};

var mapStateToProps = function (state) {
	return { auth: state.auth };
};

var mapDispatchToProps = function (dispatch) {
	return {
		getAccountHistory: (username, from, limit) => dispatch(actions.getAccountHistory(username, from, limit))
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Dashboard);
