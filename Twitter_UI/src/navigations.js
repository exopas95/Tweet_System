import React, { Component } from "react";
import {
  addNavigationHelpers,
  StackNavigator,
  TabNavigator
} from "react-navigation";
import { Keyboard } from "react-native";
import { connect } from "react-redux";
import {
  FontAwesome,
  Entypo,
  EvilIcons,
  AntDesign,
  SimpleLineIcons
} from "@expo/vector-icons";

import HomeScreen from "./Screens/HomeScreen";
import ExploreScreen from "./Screens/ExploreScreen";
import NotificationsScreen from "./Screens/NotificationsScreen";
import MessageScreen from "./Screens/MessageScreen";
import LoginScreen from "./Screens/LoginScreen";
import NewTweetScreen from "./Screens/NewTweetScreen";

import HeaderAvatar from "./components/HeaderAvatar";
import ButtonHeader from "./components/ButtonHeader";

import { colors } from "./utils/constants";

const TAB_ICON_SIZE = 20;

const Tabs = TabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        headerTitle: "Home",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome size={TAB_ICON_SIZE} color={tintColor} name="home" />
        )
      })
    },
    Explore: {
      screen: ExploreScreen,
      navigationOptions: () => ({
        headerTitle: "Explore",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome size={TAB_ICON_SIZE} color={tintColor} name="search" />
        )
      })
    },
    Notifications: {
      screen: NotificationsScreen,
      navigationOptions: () => ({
        headerTitle: "Notifications",
        tabBarIcon: ({ tintColor }) => (
          <SimpleLineIcons size={TAB_ICON_SIZE} color={tintColor} name="bell" />
        )
      })
    },
    Message: {
      screen: MessageScreen,
      navigationOptions: () => ({
        headerTitle: "Message",
        tabBarIcon: ({ tintColor }) => (
          <AntDesign size={TAB_ICON_SIZE} color={tintColor} name="mail" />
        )
      })
    }
  },
  {
    lazy: true,
    tabBarPosition: "bottom",
    swipeEnabled: false,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      activeTintColor: colors.PRIMARY,
      inactiveTintColor: colors.LIGHT_GRAY,
      style: {
        backgroundColor: colors.WHITE,
        height: 50,
        paddingVertical: 5
      }
    }
  }
);

const NewTweetModel = StackNavigator(
  {
    NewTweet: {
      screen: NewTweetScreen,
      navigationOptions: ({ navigation }) => ({
        headerLeft: (
          <ButtonHeader
            side="left"
            onPress={() => {
              Keyboard.dismiss();
              navigation.goBack(null);
            }}
          >
            <EvilIcons color={colors.PRIMARY} size={25} name="close" />
          </ButtonHeader>
        )
      })
    }
  },
  {
    headerMode: "none"
  }
);

const AppMainNav = StackNavigator(
  {
    Home: {
      screen: Tabs,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <HeaderAvatar />,
        headerRight: (
          <ButtonHeader
            side="right"
            onPress={() => navigation.navigate("NewTweet")}
          >
            <Entypo color={colors.PRIMARY} size={25} name="feather" />
          </ButtonHeader>
        )
      })
    },
    NewTweet: {
      screen: NewTweetModel
    }
  },
  {
    cardStyle: {
      backgroundColor: "#F1F6FA"
    },
    navigationOptions: () => ({
      headerStyle: {
        backgroundColor: colors.WHITE
      },
      headerTitleStyle: {
        fontWeight: "bold",
        color: colors.SECONDARY,
        alignSelf: "center"
      }
    })
  }
);

class AppNavigator extends Component {
  render() {
    const nav = addNavigationHelpers({
      dispatch: this.props.dispatch,
      state: this.props.nav
    });
    if (!this.props.user.isAuthenticated) {
      return <LoginScreen />;
    }
    return <AppMainNav navigation={nav} />;
  }
}

export default connect(state => ({
  nav: state.nav,
  user: state.user
}))(AppNavigator);

export const router = AppMainNav.router;
