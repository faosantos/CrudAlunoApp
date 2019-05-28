import SendBird from 'sendbird';
import { store } from '../redux/store';
import actions from '../redux/actions';

const APP_ID = "BDF0F1C3-448A-4DA6-9AF7-5999A906C21E";

/*
  channel_name: callback
*/

const receiveMessageCallbacks = {};
const channelChangedCallbacks = {};

const sb = new SendBird({ appId: APP_ID });


function sbLog(...args) {
  console.debug("SEND BIRD :: ", ...args);
}

function toGiftedChatMessages(messages) {
  return messages.map(message =>
    ({
      "_id": message.messageId,
      "createdAt": new Date(message.createdAt),
      "text": message.message,
      "user": {
        "_id": Number(message._sender.userId),
      }
    })
  );
}

function updateChannelInChatData(channel) {
  const chatData = store.getState().chatData;
  const found = chatData.find(c => c.name == channel.name);
  if (!found) {
    chatData.push(channel);
    store.dispatch(actions.setChatData(chatData));
  }
}

function callbackDispatcher(callbacks, channel, clbkArg) {
  const clbk = callbacks[channel.name];
  if (clbk)
    clbk(clbkArg);
}

function receiveMessageCallbackDispatcher(channel, message) {
  sbLog("RECEIVED: ", message)
  sbLog("ON CHANNEL: ", channel);
  callbackDispatcher(receiveMessageCallbacks, channel, toGiftedChatMessages([message]));
}

function channelChangedCallbackDispatcher(channel) {
  sbLog("CHANNEL CHANGED: ", channel);
  updateChannelInChatData(channel);
  callbackDispatcher(channelChangedCallbacks, channel, channel);
}

function readReceiptCallback(channel) {
  sbLog("READ RECIPT FOR USER: ", sb.currentUser.nickname);
}

function reconnectSucceededCallback() {
  sbLog("RECONNECT SUCCEEDED");
}


async function init(localUser) {
  const connectResp = await new Promise((resolve) => {
    sb.connect(localUser.id, (user, error) => {
      if (error) {
        sbLog("ERROR CONNECT: ", error);
        resolve(false);
      } else {
        sbLog("CONNECTED USER: ", user);
        sb.updateCurrentUserInfo(localUser.name, localUser.avatar, (user, error) => {
          if (error) {
            sbLog("ERROR UPDATE USER INFO: ", error);
            resolve(false);
          } else {
            sbLog("USER UPDATED: ", user);
            resolve(true);
          }
        })
      }
    });
  });

  if (connectResp) {
    sb.setChannelInvitationPreference(true, (response, error) => {
      if (error) {
        sbLog("ERROR SETTING AUTO ACCEPT: ", error);
      } else {
        sbLog("AUTO ACCEPT: ", response);
      }
    });

    const ChannelHandler = new sb.ChannelHandler();
    ChannelHandler.onMessageReceived = receiveMessageCallbackDispatcher;
    ChannelHandler.onChannelChanged = channelChangedCallbackDispatcher;
    ChannelHandler.onReadReceiptUpdated = readReceiptCallback;
    sb.addChannelHandler('CHANNEL_HANDLERS', ChannelHandler);

    var ConnectionHandler = new sb.ConnectionHandler();
    ConnectionHandler.onReconnectSucceeded = reconnectSucceededCallback;
    sb.addConnectionHandler('CONNECTION_HANDLERS', ConnectionHandler);

  }

  return connectResp;
}

async function getChats() {
  const channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  channelListQuery.includeEmpty = false;
  channelListQuery.limit = 100;    // The value of pagination limit could be set up to 100.
  const chats = [];

  while (channelListQuery.hasNext) {
    const chat = await new Promise((resolve) => {
      channelListQuery.next((channelList, error) => {
        if (error) {
          sbLog("ERROR CHANNEL LIST: ", channelList);
          resolve([]);
        } else {
          resolve(channelList);
        }
      });
    });
    chat.forEach((val) => {
      chats.push(val);
    });
  }

  return chats;
}

async function createChat(toUser) {
  const chat = await new Promise((resolve) => {
    sb.GroupChannel.createChannelWithUserIds(
      [sb.currentUser.userId, toUser.id.toString()],
      true,
      `${sb.currentUser.userId}_to_${toUser.id}`, null, null, (groupChannel, error) => {
        if (error) {
          sbLog("ERROR CREATING CHAT: ", error);
          resolve(false);
        } else {
          sbLog("CHAT CREATED: ", groupChannel);
          resolve(groupChannel);
        }
      });
  });

  return chat;
}

function getMessages(channel) {
  return new Promise((resolve) => {
    var prevMessageListQuery = channel.createPreviousMessageListQuery();
    prevMessageListQuery.limit = 30;
    prevMessageListQuery.reverse = true;
    prevMessageListQuery.load(function (messages, error) {
      if (error) {
        sbLog("ERROR: ", error);
        resolve([]);
      } else {
        const formatted = toGiftedChatMessages(messages);
        resolve(formatted);
      }
    });
  });

}

function sendMessage(channel, messages) {

  messages.forEach(message => {
    const params = new sb.UserMessageParams();

    params.message = message.text;
    params.pushNotificationDeliveryOption = 'default';  // Either 'default' or 'suppress' 

    channel.sendUserMessage(params, function (message, error) {
      if (error) {
        sbLog("ERROR SENDING MESSAGE: ", error);
      } else {
        sbLog("MESSAGE SENT: ", message);
      }
    });
  });
}

function markAsRead(channel) {
  channel.markAsRead();
}

function setOnReceiveCallback(channel, callback) {
  receiveMessageCallbacks[channel.name] = callback;
}

function removeOnReceiveCallback(channel) {
  receiveMessageCallbacks[channel.name] = null;
}

function setOnChannelChangeCallback(channel, callback) {
  channelChangedCallbacks[channel.name] = callback;
}

function removeOnChannelChangeCallback(channel) {
  channelChangedCallbacks[channel.name] = null;
}

function getCurrentUser() {
  return sb.currentUser
}



export default {
  init,
  getCurrentUser,
  getChats,
  createChat,
  getMessages,
  sendMessage,
  markAsRead,
  setOnReceiveCallback,
  removeOnReceiveCallback,
  setOnChannelChangeCallback,
  removeOnChannelChangeCallback
}