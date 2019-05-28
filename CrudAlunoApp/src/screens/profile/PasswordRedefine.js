import React, { Component } from 'react'
import { View, Text, Keyboard } from 'react-native'
import { server } from '../../apis'
import { showToast } from '../../lib'
import { Container, Input as NBInput, Content, InputGroup, Icon, Form, Button } from 'native-base'

function Input({ name, value, onChange }) {
    const pl = {
        auth: 'Insira sua senha atual',
        new: 'Insira sua nova senha',
        confirmNew: 'Confirme sua senha'
    }
    return (
        <InputGroup style={{ padding: 5 }}>
            <Icon
                name="lock"
                style={{ color: '#000' }}
            />
            <NBInput
                placeholder={pl[name]}
                autoFocus={name == 'auth' ? true : false}
                secureTextEntry={true}
                onChangeText={onChange}
                value={value}
            />
        </InputGroup>
    )
}
class PasswordRedefine extends Component {
    state = {
        currentPass: '',
        confirmed: false,
        newPassword: '',
        confirmNewPassword: ''
    }
    confirmPass = async () => {
        let res = await server.post('confirmPassword', {
            password: this.state.currentPass
        });
        if (res.success) {
            this.setState({ confirmed: true });
        } else {
            Keyboard.dismiss();
            showToast('Não foi possível autenticar.', 'danger')
        }
    }
    setNewPassword = async () => {
        let conf = await server.post('redefPassword', {
            password: this.state.newPassword
        });
        if (conf.success) {
            showToast('senha alterada com sucesso!', 'success');
            this.props.navigation.goBack();
        } else {
            showToast('Algo deu errado, tente novamente', 'danger');
        }
    }
    render() {
        return (
            <Container>
                <Content>
                    <Form style={{ padding: 10 }}>
                        <View style={{ display: this.state.confirmed ? 'none' : 'flex' }}>
                            <Input
                                name="auth"
                                onChange={text => { this.setState({ currentPass: text }) }}
                                value={this.state.currentPass}
                            />
                            <Button
                                style={{ marginTop: 17 }}
                                onPress={this.confirmPass}
                                block
                                disabled={!(this.state.currentPass.length >= 6)}
                            >
                                <Text style={{ color: '#fff' }}>Confirmar</Text>
                            </Button>
                        </View>
                        <View style={{ display: this.state.confirmed ? 'flex' : 'none' }}>
                            <Input
                                name="new"
                                onChange={text => { this.setState({ newPassword: text }) }}
                                value={this.state.newPassword}
                            />
                            <Input
                                name="confirmNew"
                                onChange={text => { this.setState({ confirmNewPassword: text }) }}
                                value={this.state.confirmNewPassword}
                            />
                            <Button
                                style={{ marginTop: 17 }}
                                onPress={this.setNewPassword}
                                block
                                disabled={
                                    (this.state.newPassword !=
                                        this.state.confirmNewPassword ||
                                        this.state.newPassword.length < 6) ?
                                        true :
                                        false
                                }
                            >
                                <Text style={{ color: '#fff' }}>Confirmar</Text>
                            </Button>
                        </View>
                    </Form>
                </Content>
            </Container>
        )
    }
}

export default PasswordRedefine;
