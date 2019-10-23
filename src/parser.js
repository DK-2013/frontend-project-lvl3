import _ from 'lodash';

const getDataFromNode = (node, selectors) => {
  const elements = selectors.map(node.querySelector, node);
  const data = _.map(elements, 'textContent');
  return _.zipObject(selectors, data);
};

const parseItem = (node) => getDataFromNode(node, ['title', 'description', 'link']);

const validate = (docElement) => {
  const requiredElementNames = ['title', 'description', 'link'];
  const getRequiredElement = (elName) => docElement.querySelector(`rss > channel > ${elName}`);
  const requiredElements = requiredElementNames.map(getRequiredElement, docElement);
  if (requiredElements.length !== 3) throw new Error('Invalid schema of loaded content');
};

export default (rawData) => {
  const dom = new DOMParser().parseFromString(rawData, 'text/xml');
  validate(dom);
  const channelEl = dom.querySelector('rss > channel');
  const data = getDataFromNode(channelEl, ['title', 'description', 'link']);
  const items = Array.from(channelEl.querySelectorAll('item')).map(parseItem);
  return { ...data, items };
};
