# react-native-drag-popup example code usage


/*
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ModalComponent from 'react-native-drag-popup';


type Props = {};
type States = {};

export default class App extends Component<Props, States> {
  constructor(props: Props) {
    super(props)
    this.ModalComponentRef = React.createRef()
    this.state = {}
  }

  renderChildComponent = () => {
    return (
      <View style={styles.itemContainer}>
        <Text>===================1==================</Text>
        <Text>===================2==================</Text>
        <Text>===================3==================</Text>
        <Text>===================4==================</Text>
        <Text>===================5==================</Text>
        <Text>===================6==================</Text>
        <Text>===================7==================</Text>
        <Text>===================8==================</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={() => this.ModalComponentRef.current.onOpenModal()}>Welcome to React Native!</Text>
        <ModalComponent
          ref={this.ModalComponentRef}
          renderChildComponent={this.renderChildComponent}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
