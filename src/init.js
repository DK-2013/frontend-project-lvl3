import '@babel/polyfill';
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
  const channelListElement = container.querySelector('.channels');
  rssLinkInputElement.addEventListener('input', onInputUrl(state));
  rssLinkSubmitFormElement.addEventListener('submit', addChannel(state));
  channelListElement.addEventListener('click', removeChannel(state));

  watch(state, 'inputState', renderRssForm(state, container));
  watch(state, 'channels', renderChannels(state, channelListElement));
  watch(state, 'posts', renderPosts(state, container));
};
