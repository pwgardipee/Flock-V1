import React from 'react';
import { GiftedChat } from "react-native-gifted-chat";
import { AsyncStorage, View } from 'react-native';
import * as firebase from 'firebase';
import { Platform } from '@unimodules/core';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class MyChat extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.Name}`

    });

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            text: '',
            id: this.props.navigation.getParam('id', 'noID'),
        }
    }

    componentWillMount() {
        this.getData()
    }

    getData = async () => {
        try {
            const valueName = await AsyncStorage.getItem('displayName')
            if (valueName !== null) {
                // value previously stored
                console.log("DisplayName: " + valueName);
                this.setState({ displayName: valueName })
            }
            else {
                console.log("Null Name");
            }

            const valuePhotoURL = await AsyncStorage.getItem('photoURL')
            if (valuePhotoURL !== null) {
                // value previously stored
                console.log("photoURL: " + valuePhotoURL);
                this.setState({ photoURL: valuePhotoURL })
            }
            else {
                console.log("Null Name");
            }

            const valueUID = await AsyncStorage.getItem('uid')
            if (valueUID !== null) {
                // value previously stored
                console.log("UID: " + valueUID);
                this.setState({ uid: valueUID })
            }
            else {
                console.log("Null Name");
            }

        } catch (e) {
            // error reading value
            console.log("Error")
        }

        var messagesRef = firebase.database().ref('Chats/' + this.state.id + '/Messages');
        var that = this;

        messagesRef.on('child_added', function (data) {
            that.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, data.val()),
            }))
        });
    }

    onSend(messages = []) {
        var date = new Date();
        var that = this;

        firebase.database().ref().child('Chats/' + this.state.id + '/Messages').push({
            text: that.state.text,
            createdAt: date.toString(),
            _id: Math.random(),
            user: {
                name: this.state.displayName,
                _id: this.state.uid,
                avatar: this.state.photoURL,
            },
        });
    }

    render() {
        return (

            <View style={{ flex: 1 }}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    onInputTextChanged={text => this.setState({ text: text })}
                    user={{
                        _id: this.state.uid,
                    }}
                />

                {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
            </View>
        )
    }

}