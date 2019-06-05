import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Login from './Containers/Login'

export default class Root extends Component {
    render(){
        return(
            <View style={styles.container}>
                <Login />
            </View>
            // {/* <ImageBackground source={...} style={{width: '100%', height: '100%'}}>
            //      <Text>Inside</Text>
            // </ImageBackground> */}
            )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00bfff',
        alignItems:'center',
        justifyContent:'center'
    }
})