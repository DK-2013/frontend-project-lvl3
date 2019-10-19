import '@babel/polyfill';
import $ from 'jquery';
import { watch } from 'melanke-watchjs';
import { onInputUrl, onSubmitUrl, onRemoveChannel } from './handlers';
import { renderRssFormError, renderRSSFeed } from './renders';


export default (containerId) => {
  const container = document.getElementById(containerId);

  const state = {
    containerId,
    rssForm: {
      currentUrl: '',
      errorUrl: '',
    },
    channels: [],
  };

  const rssField = container.querySelector('input');
  const submitForm = container.querySelector('form');
  rssField.addEventListener('input', onInputUrl(state));
  submitForm.addEventListener('submit', onSubmitUrl(state));
  $(container).on('rss-remove-channel', onRemoveChannel(state));

  watch(state.rssForm, 'errorUrl', renderRssFormError(state));
  watch(state, 'channels', () => {
    renderRSSFeed(state);
  });
};
