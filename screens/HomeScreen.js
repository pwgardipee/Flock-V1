import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import * as firebase from 'firebase';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    items: [],
  }

  componentWillMount() {
    firebase.database().ref(`Chats/`).on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          id: child.key,
          Name: child.val().Name,
          Code: child.val().Code,
          Semester: child.val().Semester,
          key: child.key,
        });

        console.log("Items: " + JSON.stringify(items));

      });

      this.setState({ items: items });
      console.log("Done Setting Items");
      return items;
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    const CustomRow = ({ Name, Code, Semester, id }) => (
      <TouchableOpacity onPress={() => navigate('Chat',
        {
          Name: Name,
          Code: Code,
          Semester: Semester,
          id: id,
        })}>
        <View style={styles.container}>
          <View style={styles.container_text}>
            <Text style={styles.title}>
              {Name}
            </Text>
            <Text style={styles.description}>
              {Semester}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    const CustomListview = ({ itemList }) => (
      <View style={styles.listContainer}>
        <FlatList
          data={itemList}
          renderItem={({ item }) => <CustomRow
            Name={item.Name}
            Code={item.Code}
            Semester={item.Semester}
            id={item.id}
            key={item.key}
          />}
        />
      </View>
    );

    return (
      <View style={styles.contianer_parent}>
        <CustomListview itemList={this.state.items} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contianer_parent: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
    marginBottom: 90,
    color: '#404042'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  description: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  photo: {
    height: 50,
    width: 50,
  },
  listContainer: {
    flex: 1,
  },
});