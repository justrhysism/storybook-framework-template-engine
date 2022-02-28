import { Meta } from 'storybook-framework-template-engine';
import { bindLiquidRenderTemplate } from '../utils';
import * as HeaderStories from './Header.stories';

import './page.css';

export default {
  title: 'Example/Page',
  argTypes: {},
} as Meta;

const templateName = 'page';

export const LoggedIn = bindLiquidRenderTemplate(templateName);
LoggedIn.args = {
  ...HeaderStories.LoggedIn.args,
};

export const LoggedOut = bindLiquidRenderTemplate(templateName);
LoggedOut.args = {
  ...HeaderStories.LoggedOut.args,
};
