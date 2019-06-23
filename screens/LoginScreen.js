import React from 'react';
import { 
    Text, 
    StyleSheet, 
    View, 
    TouchableOpacity, 
    AsyncStorage,  
    Image, } from 'react-native';
import * as firebase from 'firebase';
import * as Expo from "expo";

export default class LoginScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props)
        this.state = ({
            email: '',
            password: ''
        });
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                const { navigate } = this.props.navigation;

                this.storeData('displayName', user.displayName);
                this.storeData('photoURL', user.photoURL);
                this.storeData('uid', user.uid);

                navigate('Main');
            }
        });
    }

    storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value)
        } catch (e) {
            // saving error
            console.log(e);
        }
    }

    async loginWithFacebook() {
        const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync
            ('322056148729551', { permisions: ['public_profile'] })

        if (type == 'success') {
            const credential = firebase.auth.FacebookAuthProvider.credential(token)

            firebase.auth().signInWithCredential(credential).catch((error) => {
                console.log(error)
            })
        }
    }

    render() {
        return (
            <View >
                <Image 
                style={styles.imageContainer}
                source={require('./../assets/images/icon.png')}/>

                <View style={{alignSelf: 'center'}}>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => this.loginWithFacebook()}
                    >
                        <Text style={{ color: '#4267B3' }} >Login With Facebook</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 155,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 4,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: '#4267B3',
    },
    imageContainer: {
        width: 400,
        height: 400,
        alignSelf: 'center',
    },
});
