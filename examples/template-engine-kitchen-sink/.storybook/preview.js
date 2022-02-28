import { addParameters } from 'storybook-framework-template-engine';
import { liquidEngine } from './engine';

addParameters({
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },
  docs: {
    iframeHeight: '200px',
  },
  templateEngine: {
    render: (template) => liquidEngine.parseAndRender(template),
  },
});
