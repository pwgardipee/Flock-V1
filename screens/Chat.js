import React from 'react';
import { GiftedChat, Composer, Send } from "react-native-gifted-chat";
import { AsyncStorage, View, Alert, Text, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import { Platform } from '@unimodules/core';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
//import { ImagePicker, Permissions } from 'expo';
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

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
            showSend: false,
            showImageOptions: false,
        }
    }

    componentDidMount() {
        this.getData()
    }

    componentWillUnmount() {
        if (firebase.database().ref('Chats/' + this.state.id + '/Messages')) {
            firebase.database().ref('Chats/' + this.state.id + '/Messages').off();
        }
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

        messagesRef.off();

        messagesRef.on('child_added', function (data) {
            that.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, data.val()),
            }))
        });
    }

    onSend(imageBool = false, url = '') {
        var date = new Date();
        var that = this;

        if (!imageBool) {
            //Normal Message
            firebase.database().ref().child('Chats/' + this.state.id + '/Messages').push({
                text: that.state.text,
                createdAt: date.toString(),
                _id: Math.random(),
                user: {
                    name: this.state.displayName,
                    _id: this.state.uid,
                    avatar: this.state.photoURL,
                },
            }, function (error) {
                if (error) {
                    showAlert("Unable to send message", error)
                }
            });


        }
        else {
            //Message is an image
            firebase.database().ref().child('Chats/' + this.state.id + '/Messages').push({
                text: that.state.text,
                createdAt: date.toString(),
                _id: Math.random(),
                user: {
                    name: this.state.displayName,
                    _id: this.state.uid,
                    avatar: this.state.photoURL,
                },
                messageType: 'image',
                image: url,
            }, function (error) {
                if (error) {
                    showAlert("Unable to send message", error)
                }
            });
        }
    }


    async checkCameraRollPermission() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (status !== 'granted') {
            return false;
        }
        else {
            return true;
        }
    }

    onChooseImagePress = async (cameraBool) => {
        console.log("Image Press Function");
        const checkPermissions = await this.checkCameraRollPermission();
        const key1 = Math.random().toString(36).replace('0.', '');
        const key2 = Math.random().toString(36).replace('0.', '');
        const key3 = key1 + '' + key2;

        if (!checkPermissions) {
            return;
        }
        else {
            let result;

            if (cameraBool) {
                result = await ImagePicker.launchCameraAsync();
            }
            else {
                result = await ImagePicker.launchImageLibraryAsync();
            }

            if (!result.cancelled) {
                //Confirm that the picture should be sent
                //this.confirmSend(result.uri, key3);

                this.uploadImage(result.uri, key3);
            }
        }
    }

    confirmSend(uri, key) {
        Alert.alert(
            'Are you sure you want to send this image?',
            'Confirm send',
            [
                { text: 'OK', onPress: () => this.uploadImage(uri, key)},
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },

            ],
            { cancelable: false },
        );
    }

    uploadImage = async (uri, key) => {
        console.log("Upload Image Function");
        const blob = await this.urlToBlob(uri);
        var ref = firebase.storage().ref().child("images/" + key);
        return ref.put(blob).then(() => {
            this.sendImageToChat(key);
        })
            .catch(function (error) {
                console.log("Upload Error: " + error);
            });
    }

    urlToBlob(url) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onerror = reject;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve(xhr.response);
                }
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob'; // convert type
            xhr.send();
        })
    }

    sendImageToChat(key) {
        var that = this;
        firebase.storage().ref().child('images/' + key).getDownloadURL().then(function (url) {
            that.onSend(true, url);
        }).catch(function (error) {
            // Handle any errors
            console.log("ERRORRR: " + JSON.stringify(error))
        });
    }

    showAlert(message, subtitle) {
        Alert.alert(
            message,
            subtitle,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }

    renderActions() {
        return (
            <TouchableOpacity style={{ paddingLeft: 10, paddingBottom: 10 }} onPress={() => this.toggleImageOptions()}>
                <FontAwesome size={24} name='paperclip' />
            </TouchableOpacity>
        )
    }

    textChanged(text) {
        this.setState({ text: text });
    }

    toggleImageOptions() {
        if (this.state.showImageOptions) {
            this.setState({ showImageOptions: false });
        } else {
            this.setState({ showImageOptions: true });
        }
    }


    render() {
        let imageOptions;
        if (this.state.showImageOptions) {
            imageOptions = (
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <TouchableOpacity style={{ paddingLeft: 10, paddingBottom: 10 }} onPress={() => this.onChooseImagePress(true)}>
                        <FontAwesome size={34} name='camera-retro' />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingLeft: 10, paddingBottom: 10 }} onPress={() => this.onChooseImagePress(false)}>
                        <FontAwesome size={34} name='image' />
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={() => this.onSend()}
                    onInputTextChanged={text => this.textChanged(text)}
                    user={{
                        _id: this.state.uid,
                    }}
                    renderActions={this.renderActions.bind(this)}
                />
                {imageOptions}

                {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
            </View>
        )
    }
}