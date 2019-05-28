import React, { Component, PureComponent, Fragment } from 'react';
import { Text, KeyboardAvoidingView, View, Alert } from 'react-native';
import { Container, Content, List, ListItem, InputGroup, Input, Icon, Right, Body, Textarea, Left } from 'native-base';
import theme from '../../../native-base-theme/variables/commonColor';
import { Slider } from 'react-native-elements';
import { server } from '../../apis';
import { showToast } from './../../lib';

class InputBase extends PureComponent {
	render() {
		const { title, mode, onChange, iName, icon, onPress, onConfirm, value } = this.props;
		if (mode == 'text') {
			return (
				<ListItem>
					<InputGroup>
						<Icon name={icon} style={{ color: '#000' }} />
						<Input
							placeholder={title}
							value={value}
							onBlur={() => { if (onConfirm) onConfirm() }}
							onChangeText={text => { if (onChange) onChange(text, iName); }}
						/>
					</InputGroup>
				</ListItem>
			)
		}
		if (mode == 'area') {
			return (
				<Fragment>
					<View key={0} style={{ padding: 15 }}>
						<Textarea
							placeholder={title}
							maxLength={60}
							value={value}
							onBlur={() => onConfirm()}
							style={{ borderColor: "#000", borderWidth: .5 }}
							onChangeText={(text) => { if (onChange) onChange(text, iName) }}
						/>
						<View key={1}>
							<Text>{value.length}/{60}</Text>
						</View>
					</View>
				</Fragment>
			)
		}
		if (mode == 'button') {
			return (
				<ListItem onPress={onPress}>
					<Left style={{ maxWidth: 25 }}>
						<Icon name={icon} style={{ color: '#000', fontSize: 25 }} />
					</Left>
					<Body><Text>{title}</Text></Body>
					<Right>
						<Icon name="arrow-round-forward" />
					</Right>
				</ListItem>
			)
		}
	}
}

class MenuScreen extends Component {
	state = {
		name: this.props.reduxStates.user.name,
		email: this.props.reduxStates.user.email,
		about: this.props.reduxStates.user.about,
		distance: parseInt(this.props.reduxStates.user.feedMaxDistance)
	}
	onChange(text, f) {
		let state = this.state;
		state[f] = text;
		this.setState(state);
	}
	openPassword = () => {
		this.props.navigation.navigate({ routeName: 'PasswordRedefine' })
	}
	confirm = async () => {
		Alert.alert(
			'Atenção',
			'Deseja alterar suas informações?',
			[
				{
					text: "SIM", onPress: async () => {
						let data = this.state;
						let conf = await server.post('editData', {
							name: data.name,
							about: data.about,
							distance: data.distance,
							email: data.email
						});
						if (conf.success) {
							showToast('Dados alterados com sucesso!', 'success');
							let userData = {
								...this.props.reduxStates.user,
								name: data.name,
								email: data.email,
								about: data.about,
								feedMaxDistance: data.distance
							}
							this.props.reduxActions.setUser(userData)
						}
					}
				},
				{ text: "NÃO", style: "cancel" }
			]
		)
	}
	render() {
		return (
			<Container>
				<Content>
					<KeyboardAvoidingView
						ref={c => this.refs.keyboardAwareScrollView = c}
						behavior="padding"
						enabled
					>
						<List style={{ paddingBottom: 80 }}>
							<ListItem itemDivider>
								<Text>Informações</Text>
							</ListItem>
							<InputBase
								mode="text"
								icon="contact"
								iName="name"
								onChange={(t, c) => this.onChange(t, c)}
								title={this.state.name}
								value={this.state.name}
								onConfirm={this.confirm}
							/>
							<InputBase
								mode="text"
								icon="mail"
								iName="email"
								onChange={(t, c) => this.onChange(t, c)}
								title={this.state.email}
								value={this.state.email}
								onConfirm={this.confirm}
							/>
							<InputBase
								mode="area"
								iName="about"
								onChange={(txt, nm) => this.onChange(txt, nm)}
								title={this.state.about ? this.state.about : "Sobre Você"}
								value={this.state.about}
								onConfirm={this.confirm}
							/>
							<ListItem itemDivider>
								<Text>Segurança</Text>
							</ListItem>
							<InputBase
								mode="button"
								title="Redefinir senha"
								onPress={this.openPassword}
								icon="lock"
							/>
							<ListItem itemDivider>
								<Text>Geral</Text>
							</ListItem>
							<ListItem>
								<View style={{ paddingRight: 10, width: '100%' }}>
									<Slider
										style={{ width: '100%' }}
										maximumValue={500}
										minimumValue={20}
										onSlidingComplete={this.confirm}
										minimumTrackTintColor={theme.appColors.highlight}
										thumbTintColor={theme.appColors.highlight}
										onValueChange={(val) => this.setState({ distance: parseInt(val) })}
										value={this.state.distance}
									/>
									<Text>{this.state.distance} km</Text>
								</View>
							</ListItem>
						</List>
					</KeyboardAvoidingView>
				</Content>
			</Container>
		)
	}
}

export default MenuScreen;