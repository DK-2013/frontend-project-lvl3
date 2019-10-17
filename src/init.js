import '@babel/polyfill';
import { watch } from 'melanke-watchjs';
import { onInputUrl, onSubmitUrl, setupDismiss } from './handlers';
import { renderRssFormError, renderChannels } from './renders';


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

  watch(state.rssForm, 'errorUrl', renderRssFormError(state));
  watch(state, 'channels', () => {
    renderChannels(state);
    setupDismiss(state, container);
  });
};
