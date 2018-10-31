/*
* @flow
* @format 
*/
import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  PanResponder,
  Animated,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window')
const DEFAULT_HEIGHT = screenHeight / 2;
const HEIGHT_SCROLL_TO_TOP = screenHeight * 0.3
const HEIGHT_SCROLL_TO_BOTTOM = screenHeight * 0.8

type Props = {
  renderChildComponent: () => void,
};

type States = {
  visibleModal: boolean,
  heightAnim: Object,
  animationType: string,
};

export default class ModalComponent extends React.Component<Props, States> {
  scrollPosition: number;
  scrollViewRef: Object;
  panResponder: Object;

  constructor(props: Props) {
    super(props)
    this.state = {
      visibleModal: false,
      heightAnim: new Animated.Value(DEFAULT_HEIGHT),
      animationType: 'slide',
    };
    this.scrollViewRef = React.createRef()
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminate: () => false,
      onShouldBlockNativeResponder: () => false,
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderGrant: (evt, gestureState) => this.state.heightAnim.setOffset(this.currentOffsetY),
      onStartShouldSetPanResponderCapture: () => {
        if (this.scrollPosition === 'TOP' || this.scrollPosition === 'BOTTOM') return true
        if (this.currentOffsetY === 0) return false
        return true
      },
      onStartShouldSetPanResponder: () => {
        if (this.scrollPosition === 'TOP' || this.scrollPosition === 'BOTTOM') return true
        if (this.currentOffsetY === 0) return false
        return true
      },
      onPanResponderMove: (evt, gestureState) => {
        if (this.currentOffsetY === 0) {
          if (this.scrollPosition === 'TOP' || this.scrollPosition === 'BOTTOM') {
            return Animated.event([null, { dy: this.state.heightAnim }])(evt, gestureState)
          }
          return Animated.event([null, {}])(evt, gestureState)
        }
        return Animated.event([null, { dy: this.state.heightAnim }])(evt, gestureState)
      },
    });

    this.currentOffsetY = DEFAULT_HEIGHT;
    this.scrollPosition = '';
  }

  onOpenModal = () => {
    this.setState({ visibleModal: true, animationType: 'slide' })
  }

  onPanResponderRelease = (evt: Object, gestureState: Object) => {
    if (Math.abs(gestureState.dy) === 0) return;

    if (this.currentOffsetY === 0 && gestureState.dy <= -400) {
      this.currentOffsetY = this.currentOffsetY + gestureState.dy;
      this.state.heightAnim.flattenOffset()
      this.scrollUpCloseModal()
      return;
    }
    this.currentOffsetY = this.currentOffsetY + gestureState.dy;
    this.state.heightAnim.flattenOffset()
    if (gestureState.dy > 500) {
      this.onCloseModal()
      return;
    }
    if (this.currentOffsetY > HEIGHT_SCROLL_TO_TOP
      && this.currentOffsetY < HEIGHT_SCROLL_TO_BOTTOM

    ) {
      this.toCenter()
      return;
    }
    if (this.currentOffsetY < HEIGHT_SCROLL_TO_TOP) {
      this.toTop()
      return;
    }
    this.onCloseModal()
  };

  toTop = () => {
    this.scrollPosition = ''
    Animated.timing(
      this.state.heightAnim,
      {
        toValue: 0,
        duration: 100,
      },
    ).start();
    this.currentOffsetY = 0
  }

  toCenter = () => {
    if (this.scrollPosition === 'BOTTOM') this.scrollPosition = ''
    Animated.timing(
      this.state.heightAnim,
      {
        toValue: DEFAULT_HEIGHT,
        duration: 200,
      },
    ).start();
    this.currentOffsetY = DEFAULT_HEIGHT
  }

  onCloseModal = () => {
    this.scrollPosition = ''
    this.setState({ visibleModal: false }, () => {
      this.state.heightAnim.setValue(DEFAULT_HEIGHT)
      this.currentOffsetY = DEFAULT_HEIGHT
    })
  }

  scrollUpCloseModal = () => {
    this.scrollPosition = ''
    this.setState({ animationType: 'none' })
    Animated.timing(
      this.state.heightAnim,
      {
        toValue: - screenHeight,
        duration: 140,
      },
    ).start(() => {
      this.setState({ visibleModal: false })
      this.state.heightAnim.setValue(DEFAULT_HEIGHT)
      this.currentOffsetY = DEFAULT_HEIGHT
    });
  }

  handleOnScroll = (e) => {
    const lengthOfEnd = e.nativeEvent.contentSize.height - this.contentHeight;
    if (e.nativeEvent.contentOffset.y <= 0) {
      this.scrollPosition = 'TOP'
      return
    }
    if (lengthOfEnd < 0) {
      this.scrollPosition = 'MIDLE'
      return
    }
    if (e.nativeEvent.contentOffset.y >= lengthOfEnd) {
      this.scrollPosition = 'BOTTOM'
    }
  }

  render() {
    return (
      <Modal
        visible={this.state.visibleModal}
        animationType={this.state.animationType}
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={this.onCloseModal}>
          <View style={styles.blankContainer} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[styles.panView, { transform: [{ translateY: this.state.heightAnim }], }]}
          {...this.panResponder.panHandlers}
        >
          <View style={styles.headerContainer}>
            <View style={styles.headerBar} />
          </View>
          <ScrollView
            onContentSizeChange={(width, height) => { this.contentHeight = height }}
            ref={this.scrollViewRef}
            onScroll={this.handleOnScroll}
            scrollEventThrottle={1}
            style={styles.scrollView}
          >
            {this.props.renderChildComponent()}
          </ScrollView>
        </Animated.View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  panView: {
    paddingTop: 30,
    paddingHorizontal: 15,
    height: screenHeight,
    width: screenWidth,
  },
  blankContainer: {
    height: screenHeight,
    width: screenWidth,
    position: 'absolute'
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10
  },
  headerBar: {
    height: 8,
    width: 120,
    backgroundColor: 'white',
    borderRadius: 4
  },
  headerContainer: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})