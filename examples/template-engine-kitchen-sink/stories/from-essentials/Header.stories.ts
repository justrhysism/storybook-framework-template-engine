import { Meta } from '@storybook/template-engine';
import { bindLiquidRenderTemplate } from '../utils';

import './button.css';
import './header.css';

export default {
  title: 'Example/Header',
  argTypes: {},
} as Meta;

const templateName = 'header';

export const LoggedIn = bindLiquidRenderTemplate(templateName);
LoggedIn.args = {
  user: {},
};

export const LoggedOut = bindLiquidRenderTemplate(templateName);
LoggedOut.args = {};
