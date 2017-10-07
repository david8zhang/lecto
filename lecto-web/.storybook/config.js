import { configure } from '@kadira/storybook';

/* eslint-disable */
function loadStories() {
  require('../stories');
}
/* eslint-enable */

configure(loadStories, module);
