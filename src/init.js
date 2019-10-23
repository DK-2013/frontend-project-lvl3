import '@babel/polyfill';
import $ from 'jquery';
import { watch } from 'melanke-watchjs';
import { onInputUrl, addChannel, removeChannel } from './handlers';
import { renderRssForm, renderChannels, renderPosts } from './renders';


export default () => {
  const container = document.getElementById('rss-aggregator');

  const state = {
    inputState: 'empty',
    channels: [],
    posts: [],
  };

  const rssLinkInputElement = container.querySelector('input');
  const rssLinkSubmitFormElement = container.querySelector('form');
  rssLinkInputElement.addEventListener('input', onInputUrl(state));
  rssLinkSubmitFormElement.addEventListener('submit', addChannel(state));
  $(container).on('rss-remove-channel', removeChannel(state));

  watch(state, 'inputState', renderRssForm(state, container));
  watch(state, 'channels', renderChannels(state, $(container)));
  watch(state, 'posts', renderPosts(state, $(container)));
};
