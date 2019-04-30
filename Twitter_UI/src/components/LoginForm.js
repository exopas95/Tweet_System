import React, { Component } from "react";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import Touchable from "@appandflow/touchable";
import { Keyboard, AsyncStorage } from "react-native";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";

import { colors, fakeAvatar } from "../utils/constants";
import LOGIN_MUTATION from "../graphql/mutations/login";
import Loading from "../components/Loading";
import { login } from "../actions/user";

const Root = styled(Touchable).attrs({
  feedback: "none"
})`
  flex: 1;
  position: relative;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.View`
  align-self: stretch;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const BackButton = styled(Touchable).attrs({
  feedback: "opacity",
  hitSlop: { top: 20, bottom: 20, right: 20, left: 20 }
})`
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 5%;
  z-index: 1;
  left: 5%;
`;

const ButtonConfirm = styled(Touchable).attrs({
  feedback: "opacity"
})`
  position: absolute;
  bottom: 15%;
  width: 70%;
  height: 50;
  background-color: ${props => props.theme.PRIMARY};
  border-radius: 10;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 5;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

const ButtonConfirmText = styled.Text`
  color: ${props => props.theme.WHITE};
  font-weight: bold;
  font-size: 20;
`;

const InputWrapper = styled.View`
  height: 50;
  width: 70%;
  border-bottom-width: 2;
  border-bottom-color: ${props => props.theme.SECONDARY};
  margin-vertical: 5;
  justify-content: flex-end;
`;

const Input = styled.TextInput.attrs({
  placeholderTextColor: colors.SECONDARY,
  autoCorrect: false
})`
  height: 30;
  color: ${props => props.theme.SECONDARY};
`;

class LoginForm extends Component {
  state = {
    email: "",
    password: "",
    loading: false
  };

  _onOutsidePress = () => Keyboard.dismiss();

  _onChangeText = (text, type) => this.setState({ [type]: text });

  _checkIfDisabled() {
    const { email, password } = this.state;

    if (!email || !password) {
      return true;
    }

    return false;
  }

  _onLoginPress = async () => {
    this.setState({ loading: true });

    const { firstName, lastName, email, password, username } = this.state;
    const avatar = fakeAvatar;

    try {
      const { data } = await this.props.mutate({
        variables: {
          firstName,
          lastName,
          email,
          password,
          username,
          avatar
        }
      });

      await AsyncStorage.setItem("@twitterproject", data.login.token);
      this.setState({ loading: false });
      return this.props.login();
    } catch (error) {
      throw error;
    }
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <Root onPress={this._onOutsidePress}>
        <BackButton onPress={this.props.onBackPress}>
          <MaterialIcons color={colors.SECONDARY} size={30} name="arrow-back" />
        </BackButton>
        <Wrapper>
          <InputWrapper>
            <Input
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={text => this._onChangeText(text, "email")}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              placeholder="Password"
              secureTextEntry
              onChangeText={text => this._onChangeText(text, "password")}
            />
          </InputWrapper>
        </Wrapper>
        <ButtonConfirm
          onPress={this._onLoginPress}
          disabled={this._checkIfDisabled()}
        >
          <ButtonConfirmText>Log In</ButtonConfirmText>
        </ButtonConfirm>
      </Root>
    );
  }
}

export default compose(
  graphql(LOGIN_MUTATION),
  connect(
    undefined,
    { login }
  )
)(LoginForm);
