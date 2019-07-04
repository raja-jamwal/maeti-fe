import * as React from 'react';
import { View } from 'react-native';
import GlobalStyle from '../styles/global';
import { connect } from 'react-redux';
import EditForm from '../components/edit-form/index';
import { mapping } from '../definitions/profile-form';

interface IAuthProps {}

interface IAuthDispatchProps {
	createAccount: () => any;
}

class Auth extends React.Component<IAuthProps & IAuthDispatchProps, any> {
	constructor(props: any) {
		super(props);
		this.buttonClicked = this.buttonClicked.bind(this);
	}

	buttonClicked() {
		console.log(this.props.createAccount());
	}

	render() {
		return (
			<View style={GlobalStyle.expand}>
				<EditForm object={null} mapping={mapping} buttonLabel="Create Profile" />
			</View>
		);
	}
}

function mapDispatchToProps(dispatch: any) {
	return {
		// createAccount: bindActionCreators(createAccount, dispatch)
	};
}

export default connect<any, any>(
	null,
	mapDispatchToProps
)(Auth);
