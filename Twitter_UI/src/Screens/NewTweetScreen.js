import React, { Component } from "react";
import styled from "styled-components/native";
import Touchable from "@appandflow/touchable";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import { Keyboard } from "react-native";

import CREATE_TWEET_MUTATION from "../graphql/mutations/createTweet";
import GET_TWEETS_QUERY from "../graphql/queries/getTweets";

const Root = styled.View`
  background-color: ${props => props.theme.WHITE};
  flex: 1;
  align-items: center;
`;

const Wrapper = styled.View`
  height: 80%;
  width: 90%;
  padding-top: 5;
  position: relative;
`;

const Input = styled.TextInput.attrs({
  multiline: true,
  placeholder: "What's happening?",
  maxLength: 200,
  autoFocus: true
})`
  width: 100%;
  font-size: 18;
  color: ${props => props.theme.SECONDARY};
`;

export const TweetButton = styled(Touchable).attrs({
  feedback: "opacity",
  hitSlop: { top: 20, left: 20, right: 20, bottom: 20 }
})`
  background-color: ${props => props.theme.PRIMARY};
  justify-content: center;
  align-items: center;
  width: 80;
  height: 35;
  border-radius: 20;
  position: absolute;
  top: 60%;
  right: 0;
`;

export const TweetButtonText = styled.Text`
  color: ${props => props.theme.WHITE};
  font-size: 16;
`;

class NewTweetScreen extends Component {
  state = {
    text: ""
  };
  _onChangeText = text => this.setState({ text });

  _onCreateTweetPress = async () => {
    const { user } = this.props;

    await this.props.mutate({
      variables: {
        text: this.state.text
      },
      optimisticResponse: {
        __typename: "Mutation",
        createTweet: {
          __typename: "Tweet",
          text: this.state.text,
          favoriteCount: 0,
          _id: Math.round(Math.random() * -1000000),
          createdAt: new Date(),
          user: {
            __typename: "User",
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar
          }
        }
      },
      update: (store, { data: { createTweet } }) => {
        const data = store.readQuery({ query: GET_TWEETS_QUERY });
        if (!data.getTweets.find(t => t._id === createTweet._id)) {
          store.writeQuery({
            query: GET_TWEETS_QUERY,
            data: { getTweets: [{ ...createTweet }, ...data.getTweets] }
          });
        }
      }
    });

    Keyboard.dismiss();
    this.props.navigation.goBack(null);
  };

  get _buttonDisabled() {
    return this.state.text.length < 10;
  }

  render() {
    return (
      <Root>
        <Wrapper>
          <Input value={this.state.text} onChangeText={this._onChangeText} />
          <TweetButton
            onPress={this._onCreateTweetPress}
            disabled={this._buttonDisabled}
          >
            <TweetButtonText>Tweet</TweetButtonText>
          </TweetButton>
        </Wrapper>
      </Root>
    );
  }
}

export default compose(
  graphql(CREATE_TWEET_MUTATION),
  connect(state => ({ user: state.user.info }))
)(NewTweetScreen);
