import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native'
import TInput from './TInput'

class LoginScreen extends Component {
    constructor(props){
        super(props)
    }
    showLogin(props){
        let { onLogin, onLogout, onUser, handleSubmit, auth } = props
        if(auth.access_token === '') {
            return (
            <View style={styles.container}>
                <Text style={styles.Text}> Testando o LOGIN </Text>
                <Field style={styles.input} autoCapitalize="none" placeholder="Email" component={TInput} name={'email'} />
                <Field style={styles.input} autoCapitalize="none" placeholder="Password" secureTextEntry={true} component={TInput} name={'password'} />
                <Button
                    title = "Login"
                    color = "#236CF5"
                    style = {{backgroundColor:'#F8F8F8'}}
                    onPress = {handleSubmit(onLogin)}
                    />
            </View>
            )
        }
        else {
            return (
                <View style={styles.container}>
                    <Text>{auth.email}</Text>
                    <Button title="Mais informações" color= "#236CF5" onPress={()=>onUser(auth)}/>
                    <Text style={{fontWeight:'bold'}}>{auth.name}</Text>
                    {/* <Text style={{fontWeight:'bold'}}>{auth.email}</Text> */}
                    <Button title="Sair" color= "#236CF5" onPress={()=>onLogout()}/>
                </View>
                )
        }

    }
    render(){
        return this.showLogin(this.props)
        
   }
}

export default reduxForm({ form: 'login' })(LoginScreen); 

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    input:{
        height:40,
        width:300,
        padding:5,
        borderWidth:0,
        borderBottomWidth:2,
        borderBottomColor:'#236CF5',
        borderColor:'gray',
        margin:10
    },
    Text:{
        paddingTop:20,
    paddingBottom:20,
    color:'#fff',
    textAlign:'center',
    backgroundColor:'#228b22',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#fff' 

    }
})