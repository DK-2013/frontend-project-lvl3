import { isURL } from 'validator';
import axios from 'axios';
import parse from './parser';

const cors = 'https://cors-anywhere.herokuapp.com/';

export const onInputUrl = (state) => ({ target: inputEl }) => {
  const { rssForm, channels } = state;
  if (inputEl.value === '') rssForm.errorUrl = 'empty';
  else if (!isURL(inputEl.value)) rssForm.errorUrl = 'invalid';
  else if (channels.find(({ url }) => url === inputEl.value)) rssForm.errorUrl = 'exist';
  else rssForm.errorUrl = 'valid';
  rssForm.currentUrl = inputEl.value;
};

const loadChannel = (channel, currentState) => {
  const newChannel = channel;
  const state = currentState;
  axios.get(`${cors}${newChannel.url}`)
    .then(({ data }) => {
      const loadedChannel = { ...channel, ...parse(data), status: 'ready' };
      state.channels = [loadedChannel, ...state.channels.filter((ch) => ch !== channel)];
    })
    .catch((error) => {
      // newChannel.error = error;
      newChannel.status = 'error';
      throw error;
    });
};

export const onSubmitUrl = (currentState) => (event) => {
  event.preventDefault();
  const state = currentState;
  // const url = new FormData(event.target).get('rss-url');
  const url = currentState.rssForm.currentUrl;
  const newChannel = { url, status: 'loading' };
  state.rssForm.errorUrl = 'empty';
  state.channels = [newChannel, ...state.channels];
  loadChannel(newChannel, state);
};

export const onRemoveChannel = (currentState) => (event, removingChannel) => {
  const state = currentState;
  state.channels = state.channels.filter((channel) => channel !== removingChannel);
};
