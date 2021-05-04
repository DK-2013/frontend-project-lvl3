import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/alert';
import _ from 'lodash';

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

const renderChannel = (channel) => {
  const {
    status, title, description, url, errMsg,
  } = channel;
  switch (status) {
    case 'loading':
      return `<li class="alert alert-primary p-1" role="alert">
              Loading...
              <div  class="progress" style="height: 1.5rem">
                <div class="progress-bar progress-bar-striped progress-bar-animated text-left"
                      style="width: 100%; padding: 0 .5rem">
                  <span class="text-truncate">${url}</span>
                </div>
              </div>
            </li>`;
    case 'ready':
      return `<li>
              <h5>${title}</h5>
              <p>${description}</p>
            </li>`;
    case 'error':
      return `<li class="alert alert-danger p-1" role="alert">
              <div>
                ${errMsg}
                <button class="close" data-dismiss="alert" data-url="${url}">&times;</button>
              </div>
              <div  class="progress" style="height: 1.5rem">
                <div class="progress-bar bg-danger progress-bar-striped text-left"
                      style="width: 100%; padding: 0 .5rem">
                  <span class="text-truncate">${url}</span>
                </div>
              </div>
            </li>`;
    default:
      throw new Error(`Unknown status chanel: ${url}`);
  }
};

export const renderChannels = (state, container) => () => {
  const { channels } = state;
  const channelListElement = container;
  channelListElement.innerHTML = channels.map(renderChannel).join('');
};

const renderPost = ({ link, title, description }) => `<div class="row">
    <div class="col-1">
      <button class="btn btn-primary btn-sm py-0"
              data-toggle="modal" data-target=".post-description"
              data-description="${description}"
              data-title="${title}"> + </button>
    </div>
    <div class="col-11">
      <a href="${link}" target="_blank">${title}</a>
    </div>
  </div>`;

const renderPostInModal = (container) => ({ target }) => {
  const data = target.dataset;
  if (_.has(data, 'description')) {
    const { description, title } = data;
    const titleHolderElement = container.querySelector('.post-description .modal-title');
    const descriptionHolderElement = container.querySelector('.post-description .modal-body');
    titleHolderElement.textContent = title;
    descriptionHolderElement.textContent = description;
  }
};

export const renderPosts = (state, container) => () => {
  const { posts } = state;
  const postListElement = container.querySelector('.posts');
  const renderedPosts = posts.map(renderPost);
  postListElement.innerHTML = renderedPosts.join('');
  postListElement.addEventListener('click', renderPostInModal(container));
};
