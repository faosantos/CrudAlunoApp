import React, { Component, PureComponent } from 'react';
import { FlatList, View, Dimensions, RefreshControl, TouchableOpacity } from 'react-native';
import { Fab, Content, Container, Spinner, Title, Button, Text, Thumbnail, Card, Subtitle } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { GiftedChat, Send } from "react-native-gifted-chat";
import { server, sendBird } from '../../apis';
import theme from '../../../native-base-theme/variables/commonColor';
import { Icon, UserCard } from '../comps'



export class ChatMessenger extends Component {

  state = {
    localUser: this.props.reduxStates.user,
    toUser: this.props.navigation.getParam('toUser'),
    channel: this.props.navigation.getParam('channel'),
    toMember: {},
    messages: []
  }

  async componentWillMount() {
    let channel = this.state.channel;
    if (!channel)
      channel = await sendBird.createChat(this.state.toUser);

    const localUserId = this.state.localUser.id.toString();
    const toMember = channel.members.find(m => m.userId != localUserId);
    const messages = await sendBird.getMessages(channel);
    this.setState({ toMember, channel, messages });
    sendBird.setOnReceiveCallback(channel, this.onReceive);
    sendBird.markAsRead(channel);
  }

  async componentWillUnmount() {
    sendBird.removeOnReceiveCallback(this.state.channel, this.onReceive);
  }

  insertMessages = (messages) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  onSend = (messages) => {
    this.insertMessages(messages);
    sendBird.sendMessage(this.state.channel, messages);
  }

  onReceive = (messages) => {
    this.insertMessages(messages);
    sendBird.markAsRead(this.state.channel);
  }

  renderSend = (props) => {
    return (
      <Send {...props} textStyle={{ color: theme.appColors.highlight }} label='Enviar' />
    );
  }

  render() {
    return (
      <Container style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          renderSend={this.renderSend}
          user={{
            _id: this.state.localUser.id
          }}
        />
      </Container >

    );
  }
}


class ChatCard extends PureComponent {

  state = {
    channel: {},
    toMember: {},
    lastMessage: null,
  }

  componentWillMount() {
    this.onUpdate(this.props.channel);
    sendBird.setOnChannelChangeCallback(this.props.channel, this.onUpdate);
  }

  componentWillUnmount() {
    sendBird.removeOnChannelChangeCallback(this.props.channel);
  }

  onUpdate = (channel) => {
    const localUserId = sendBird.getCurrentUser().userId;
    const toMember = channel.members.find(m => m.userId != localUserId);
    const lastMessage = channel.lastMessage ? channel.lastMessage : {};
    this.setState({ toMember, channel, lastMessage });
  }

  gotoMessenger = () => {
    this.props.navigation.navigate("ChatMessenger", { channel: this.props.channel });
  }

  renderLastMessage = () => {
    if (this.state.lastMessage) {

    }
  }

  render() {
    return (
      <Card style={{ padding: 8 }}>
        <TouchableOpacity onPress={this.gotoMessenger}>
          <Grid>
            <Col size={0.25}>
              <TouchableOpacity onPress={this.gotoProfile}>
                <Thumbnail
                  source={{ uri: this.state.toMember.profileUrl }}
                />
              </TouchableOpacity>
            </Col>
            <Col>
              <Row>
                <Title>{this.state.toMember.nickname}</Title>
              </Row>
              <Row>
                {
                  this.state.lastMessage && (
                    <Subtitle>{this.state.lastMessage.message}</Subtitle>
                  )
                }
              </Row>
            </Col>
          </Grid>
        </TouchableOpacity>
      </Card>

    );
  }
}



export default class ChatList extends Component {

  state = {
    loading: true
  }

  async componentDidMount() {
    await this.init();
  }

  init = async () => {
    const chats = await sendBird.getChats();
    this.props.reduxActions.setChatData(chats);
    this.setState({ loading: false });
  }

  keyExtractor = (item, idx) => {
    return idx.toString();
  }

  renderItem = ({ item }) => {
    return (
      <ChatCard
        channel={item}
        navigation={this.props.navigation}
      />
    );
  }

  render() {
    return (
      <Container>
        {
          this.state.loading ? (
            <Content contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
              <Spinner style={{ alignSelf: 'center' }} />
            </Content>
          ) : (
              <FlatList
                ref={(ref) => this.completedFL = ref}
                data={this.props.reduxStates.chatData}
                extraData={this.props.reduxStates}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
              />
            )
        }
      </Container>
    );
  }


}

