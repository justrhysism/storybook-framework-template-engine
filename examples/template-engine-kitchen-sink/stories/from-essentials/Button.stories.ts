import { Meta } from '@storybook/template-engine';
import { bindLiquidRenderTemplate } from '../utils';

import './button.css';

export default {
  title: 'Example/Button',
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
    backgroundColor: { control: 'color' },
    buttonSize: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
  },
} as Meta;

const templateName = 'button';

export const Primary = bindLiquidRenderTemplate(templateName);
Primary.args = {
  primary: true,
  label: 'Button',
};

export const Secondary = bindLiquidRenderTemplate(templateName);
Secondary.args = {
  label: 'Button',
};

export const Large = bindLiquidRenderTemplate(templateName);
Large.args = {
  buttonSize: 'large',
  label: 'Button',
};

export const Small = bindLiquidRenderTemplate(templateName);
Small.args = {
  buttonSize: 'small',
  label: 'Button',
};
