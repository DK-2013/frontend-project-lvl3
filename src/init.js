import '@babel/polyfill';
import $ from 'jquery';
import { watch } from 'melanke-watchjs';
import { onInputUrl, addChannel, removeChannel } from './handlers';
import { renderRssFormError, renderChannels, renderPosts } from './renders';


export default (containerId) => {
  const container = document.getElementById(containerId);

  const state = {
    containerId,
    inputState: 'empty',
    channels: [],
    posts: [],
  };

  const rssField = container.querySelector('input');
  const submitForm = container.querySelector('form');
  rssField.addEventListener('input', onInputUrl(state));
  submitForm.addEventListener('submit', addChannel(state));
  $(container).on('rss-remove-channel', removeChannel(state));

  watch(state, 'inputState', renderRssFormError(state));
  watch(state, 'channels', renderChannels(state));
  watch(state, 'posts', renderPosts(state));
};
