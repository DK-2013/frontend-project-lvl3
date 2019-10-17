const parseItem = (node) => ({
  title: node.querySelector('title').textContent,
  description: node.querySelector('description').textContent,
  link: node.querySelector('link').textContent,
  // pubDate: node.querySelector('pubDate').textContent,
});

export default (data) => {
  const dom = new DOMParser().parseFromString(data, 'text/xml');
  return {
    title: dom.querySelector('title').textContent,
    description: dom.querySelector('description').textContent,
    link: dom.querySelector('link').textContent,
    items: Array.from(dom.querySelectorAll('item')).map(parseItem),
  };
};
