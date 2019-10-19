import $ from 'jquery';
// eslint-disable-next-line no-unused-vars
import mdl from 'bootstrap/js/dist/modal';

export const renderRssFormError = (state) => (prop, action, value) => {
  const container = document.getElementById(state.containerId);
  const rssField = container.querySelector('input');
  const submitBtn = container.querySelector('input[type=submit]');
  const messageBox = container.querySelector('.message');
  const setFieldState = (isValid) => {
    rssField.classList[isValid ? 'remove' : 'add']('is-invalid');
    rssField.classList[isValid ? 'add' : 'remove']('is-valid');
  };
  switch (value) {
    case 'invalid':
      messageBox.textContent = 'Need url';
      setFieldState(false);
      submitBtn.setAttribute('disabled', true);
      break;
    case 'exist':
      submitBtn.setAttribute('disabled', true);
      messageBox.textContent = 'Channel was added';
      setFieldState(false);
      break;
    case 'valid':
      setFieldState(true);
      submitBtn.removeAttribute('disabled');
      break;
    case 'empty':
      submitBtn.setAttribute('disabled', true);
      rssField.classList.remove('is-valid', 'is-invalid');
      rssField.value = '';
      break;
    default:
      throw new Error('Unknown field error type');
  }
};

const showDescription = ({ data: { description, modalCt, title } }) => {
  modalCt.find('.modal-title').text(title);
  modalCt.find('.modal-body').text(description);
  modalCt.modal('show');
};

const emmitRemoveChannel = ({ data: { channel, container } }) => {
  container.triggerHandler('rss-remove-channel', channel);
};

const renderChannel = (container) => (channel) => {
  const {
    status, title, description, url,
  } = channel;
  let node;
  switch (status) {
    case 'loading':
      node = $(`<li class="alert alert-primary p-1" role="alert">
              Loading...
              <div  class="progress" style="height: 1.5rem">
                <div class="progress-bar progress-bar-striped progress-bar-animated text-left" style="width: 100%; padding: 0 .5rem">
                  <span class="text-truncate">${url}</span>
                </div>
              </div>
            </li>`);
      break;
    case 'ready':
      node = $(`<li>
              <h5>${title}</h5>
              <p>${description}</p>
            </li>`);
      break;
    case 'error':
      node = $(`<li class="alert alert-danger p-1" role="alert">
              <div>
                Something went wrong...
                <button class="close">&times;</button>
              </div>
              <div  class="progress" style="height: 1.5rem">
                <div class="progress-bar bg-danger progress-bar-striped text-left" style="width: 100%; padding: 0 .5rem">
                  <span class="text-truncate">${url}</span>
                </div>
              </div>
            </li>`);
      node.on('click', 'button', { channel, container }, emmitRemoveChannel);
      break;
    default:
      throw new Error(`Unknown status chanel: ${url}`);
  }
  return node;
};

const renderChannels = (channels, container) => {
  const renderedChannels = channels.map(renderChannel(container));
  container.find('.channels').empty().append(renderedChannels);
};

const renderPost = (modalCt) => ({ link, title, description }) => {
  const node = $(`<div class="row">
  <div class="col-1">
    <button class="btn btn-primary btn-sm py-0"> + </button>
  </div>
  <div class="col-11">
    <a href="${link}" target="_blank">${title}</a>
  </div>
</div>`);
  node.on('click', 'button', { description, modalCt, title }, showDescription);
  return node;
};

const renderPosts = (posts, container) => {
  const modalCt = container.find('.modal');
  const renderedPosts = posts.map(renderPost(modalCt));
  container.find('.posts').empty().append(renderedPosts);
};

export const renderRSSFeed = ({ containerId, channels }) => {
  const container = $(`#${containerId}`);
  renderChannels(channels, container);

  const posts = channels.filter(({ status }) => status === 'ready')
    .flatMap(({ items }) => items);
  renderPosts(posts, container);
};
