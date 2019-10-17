
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

const renderPost = ({ link, title }) => `<li><a href="${link}">${title}</a></li>`;

const renderChannel = ({
  status, title, description, url,
}) => {
  switch (status) {
    case 'loading':
      return `<li class="alert alert-primary p-1" role="alert">
                Loading...
                <div  class="progress" style="height: 1.5rem">
                  <div class="progress-bar progress-bar-striped progress-bar-animated text-left" style="width: 100%; padding: 0 .5rem">
                    <span class="text-truncate">${url}</span>
                  </div>
                </div>
              </li>`;
    case 'ready':
      return `<li><h5>${title}</h5><p>${description}</p></li>`;
    case 'error':
      return `<li class="alert alert-danger p-1" role="alert">
                <div>
                  Something went wrong...
                  <button data-url="${url}" class="close">&times;</button>
                </div>
                <div  class="progress" style="height: 1.5rem">
                  <div class="progress-bar bg-danger progress-bar-striped text-left" style="width: 100%; padding: 0 .5rem">
                    <span class="text-truncate">${url}</span>
                  </div>
                </div>
              </li>`;
    default:
      throw new Error(`Unknown status chanel: ${url}`);
  }
};

export const renderChannels = (state) => {
  const container = document.getElementById(state.containerId);
  const channelsContainer = container.querySelector('.channels');
  channelsContainer.innerHTML = state.channels.map(renderChannel).join('');
  const postsContainer = container.querySelector('.posts');
  const renderedPosts = state.channels.filter(({ status }) => status === 'ready')
    .flatMap(({ items }) => items.map(renderPost));
  renderedPosts.length = 200;
  postsContainer.innerHTML = renderedPosts.join('');
};
