import React from 'react';

import { FlatList, Keyboard } from 'react-native';

import {
  Input,
  Item,
  View,
  ListItem,
  Text,
  Button
} from 'native-base';

import Icon from './Icon';



export default class SearchBar extends React.Component {

  static defaultProps = {
    placeholder: 'Procurar',
    buttonText: 'OK',
    confirmButton: false
  }

  constructor(props) {
    super(props);
    this.state = {
      options: props.options,
      focused: false,
      inputRef: null,
      selectedOptionIndex: null,
      text: ''
    }
  }

  filterOptions = (text) => {
    this.setState({
      options: this.props.options.filter(function (str) {
        return str.toLowerCase().indexOf(text) >= 0;
      })
    });
  }

  onFocus = () => {
    this.setState({ focused: true, selectedOptionIndex: null, text: '' });
    this.filterOptions('');
  }

  onBlur = () => {
    this.setState({ focused: false });
  }

  onChangeText = (text) => {
    this.setState({ text });
    text = text.toLowerCase();
    this.filterOptions(text);
  }

  getInputRef = (ref) => {
    this.setState({ inputRef: ref });
  }

  onEndEditing = ({ nativeEvent: { text } }) => {
    if (!this.props.confirmButton) {
      this.submit(text);
    }
  }

  submit = (text = null) => {
    if (text == null)
      text = this.state.text;
    text = String(text).toLowerCase();
    if (this.state.selectedOptionIndex != null) {
      this.props.onOptionSelected(this.state.selectedOptionIndex, this.props.options[this.state.selectedOptionIndex]);
    } else {
      let index = null, value = null;
      for (i = 0; i < this.state.options.length; ++i) {
        const item = this.state.options[i];
        if (item.toLowerCase() == text) {
          index = this.props.options.indexOf(item);
          value = item;
          break;
        }
      }
      if (index != null) {
        this.props.onOptionSelected(index, value);
      } else {
        this.props.onCancel();
      }
    }
  }

  itemPress = (item) => {
    const index = this.props.options.indexOf(item);
    console.debug("ITEM SELECTED: ", item, " | INDEX: ", index);
    this.setState({ text: item, selectedOptionIndex: index });
    Keyboard.dismiss();
  }

  renderItem = ({ item, index }) => {
    return (
      <ListItem onPress={this.itemPress.bind(this, item, index)}>
        <Text>{item}</Text>
      </ListItem>
    );
  }

  keyExtractor = (item, idx) => {
    return String(idx);
  }

  render() {
    return (
      <View style={{
        backgroundColor: 'transparent',
        height: 'auto',
        width: '100%',
        alignItems: 'center'
      }}>
        <View style={{ width: '100%', flexDirection: 'row', margin: 4, justifyContent: 'center' }}>
          <Item rounded style={{
            width: this.props.confirmButton ? '80%' : '100%',
            marginRight: this.props.confirmButton ? 4 : 0
          }}>
            <Icon name="search" />
            <Input
              ref={this.getInputRef}
              onChangeText={this.onChangeText}
              value={this.state.text}
              placeholder={this.props.placeholder}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onEndEditing={this.onEndEditing}
              underlineColorAndroid='transparent'
            />
          </Item>
          {
            this.props.confirmButton && (
              <Button rounded onPress={this.submit}>
                <Text>{this.props.buttonText}</Text>
              </Button>
            )
          }
        </View>

        {
          this.state.focused && this.state.text.length >= 1 && (
            <FlatList
              keyboardShouldPersistTaps="aways"
              data={this.state.options}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ListEmptyComponent={
                <Text>Nenhum resultado para {this.state.text}</Text>
              }
            />
          )
        }

      </View>
    );
  }
}





