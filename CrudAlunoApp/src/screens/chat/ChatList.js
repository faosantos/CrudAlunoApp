import React, { Component, PureComponent } from 'react';
import { FlatList, View, Dimensions, RefreshControl, TouchableOpacity } from 'react-native';
import { Fab, Content, Container, Spinner, Title, Button, Text, Thumbnail, Card } from 'native-base';
import theme from '../../../native-base-theme/variables/commonColor';
import { Icon, UserCard } from '../comps'
import { server } from '../../apis';

import { Grid, Row } from 'react-native-easy-grid';
import serverApi from '../../apis/serverApi';
import { connect, states, actions } from '../../redux';



class ChatCard extends PureComponent {
  render() {
    let props = this.props;
    return (
      <Card style={{ padding: 8 }}>
        <TouchableOpacity>
          <Grid>
            <Row>
              <Thumbnail source={{ uri: props.user.avatar }} />
              <Title>{props.user.name}</Title>
            </Row>
          </Grid>
        </TouchableOpacity>
      </Card>

    );
  }
}



export default class ChatList extends Component {

  async componentDidMount() {
    const chatData = await server.get('localFeed');
    this.props.reduxActions.setChatData(chatData);
  }

  keyExtractor = (item, idx) => {
    return idx.toString();
  }

  renderItem = ({ item }) => {
    return <ChatCard user={item} />
  }

  render() {
    return (
      <Container>
        <FlatList
          ref={(ref) => this.completedFL = ref}
          data={this.props.reduxStates.chatData}
          extraData={this.props.reduxStates}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </Container>
    );
  }


}
