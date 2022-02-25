import button from '../src/templates/button.liquid';

const packageName = 'package';
const componentSubtitle = `import button from '${packageName}/lib/elements/buttons';`;

export default {
  title: 'Addons/Source loader',
  parameters: {
    componentSubtitle,
  },
};

export const Button = () => button;
Button.parameters = {
  storySource: {
    source: `source: ${button}`,
  },
};

export const SimpleStory = () =>
  `<p>
      <strong>
        This is a fragment of HTML
      </strong>
    </p>`;
SimpleStory.storyName = 'Very simple story';
