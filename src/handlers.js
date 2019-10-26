import { isURL } from 'validator';
import axios from 'axios';
import _ from 'lodash';
import parse from './parser';

const cors = 'https://cors-anywhere.herokuapp.com/';

const inputStates = [{
  predicate: (value) => value === '',
  inputState: 'empty',
}, {
  predicate: (value) => !isURL(value),
  inputState: 'invalidUrl',
}, {
  predicate: (value, channels) => channels.find(({ url }) => value === url),
  inputState: 'existUrl',
}, {
  predicate: () => true,
  inputState: 'validUrl',
}];

export const onInputUrl = (currentState) => ({ target: { value } }) => {
  const state = currentState;
  const { inputState } = inputStates.find(({ predicate }) => predicate(value, state.channels));
  state.inputState = inputState;
};

const updatePosts = (currentState, channel, dataChannel) => {
  const newPosts = _.differenceWith(dataChannel.items, channel.items, _.isEqual);
  if (newPosts.length === 0) return;
  const state = currentState;
  state.posts = [...newPosts, ...state.posts];
};

const updateChannel = _.assign;

const delaySyncChannel = 5; // sec

const syncChannelPosts = (currentChannel, currentState) => {
  const state = currentState;
  const channel = currentChannel;
  const { url } = currentChannel;
  setTimeout(() => {
    axios.get(`${cors}${url}`)
      .then(({ data }) => parse(data))
      .then((dataChannel) => {
        updatePosts(state, channel, dataChannel);
        updateChannel(channel, dataChannel);
      })
      .finally(() => {
        syncChannelPosts(channel, state);
      });
  }, delaySyncChannel * 1000);
};

export const addChannel = (currentState) => (event) => {
  event.preventDefault();
  const state = currentState;
  const formData = new FormData(event.target);
  const url = formData.get('rss-url');
  const loadingChannel = { url, status: 'loading' };
  state.inputState = 'empty';
  state.channels = [loadingChannel, ...state.channels];

  axios.get(`${cors}${url}`)
    .then(({ data }) => parse(data))
    .then((dataChannel) => {
      const loadedChannel = { url, ...dataChannel, status: 'ready' };
      const otherChannels = state.channels.filter((ch) => ch !== loadingChannel);
      state.channels = [loadedChannel, ...otherChannels];
      state.posts = [...loadedChannel.items, ...state.posts];
      syncChannelPosts(loadedChannel, state);
    })
    .catch((error) => {
      loadingChannel.status = 'error';
      throw error;
    });
};

export const removeChannel = (currentState) => ({ target }) => {
  const state = currentState;
  const data = target.dataset;
  if (_.has(data, 'dismiss')) {
    state.channels = state.channels.filter(({ url }) => url !== data.url);
  }
};
