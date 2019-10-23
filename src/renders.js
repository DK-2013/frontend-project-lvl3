import $ from 'jquery';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/alert';

export const renderRssForm = (state, container) => () => {
  const { inputState } = state;
  const rssField = container.querySelector('input');
  const submitBtn = container.querySelector('input[type=submit]');
  const messageBox = container.querySelector('.message');
  const renderError = (message) => {
    submitBtn.setAttribute('disabled', 'disabled');
    rssField.classList.add('is-invalid');
    rssField.classList.remove('is-valid');
    messageBox.textContent = message;
  };
  switch (inputState) {
    case 'invalidUrl':
      renderError('Need url');
      break;
    case 'existUrl':
      renderError('Channel was added');
      break;
    case 'validUrl':
      rssField.classList.remove('is-invalid');
      rssField.classList.add('is-valid');
      submitBtn.removeAttribute('disabled');
      break;
    case 'empty':
      submitBtn.setAttribute('disabled', 'disabled');
      rssField.classList.remove('is-valid', 'is-invalid');
      rssField.value = '';
      break;
    default:
      throw new Error(`Unknown input state: ${inputState}`);
  }
};

const showDescription = ({ data: { description, modalCt, title } }) => {
  modalCt.find('.modal-title').text(title);
  modalCt.find('.modal-body').text(description);
  modalCt.modal('show');
};

const emmitRemoveChannel = ({ data: { channel, container } }) => {
  $(container).triggerHandler('rss-remove-channel', channel);
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
                <button class="close" data-dismiss="alert" >&times;</button>
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

export const renderChannels = (state, container) => () => {
  const { channels } = state;
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

export const renderPosts = (state, container) => () => {
  const { posts } = state;
  const modalCt = container.find('.modal');
  const renderedPosts = posts.map(renderPost(modalCt));
  container.find('.posts').empty().append(renderedPosts);
};
