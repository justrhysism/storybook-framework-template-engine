import { Story, StoryContext } from 'storybook-framework-template-engine';
import { escape, isString } from 'lodash-es';

export const createLiquidRenderTemplate = (templateName: string, args: Record<string, any>) => {
  const argEntries = Object.entries(args);

  return `{% render '${templateName}'${argEntries.length ? ', ' : ''}${argEntries
    .map(([k, v]) => `${k}: ${isString(v) ? `'${escape(v)}'` : JSON.stringify(v)}`)
    .join(', ')} %}`;
};

export const bindLiquidRenderTemplate = (templateName: string) => {
  const Template: Story = (args: Record<string, any>) =>
    createLiquidRenderTemplate(templateName, args);

  Template.parameters = {
    docs: {
      ...(Template.parameters?.docs ?? {}),
      transformSource(_snippet: string, story: StoryContext) {
        return createLiquidRenderTemplate(templateName, story.parameters.args);
      },
    },
  };

  return Template;
};

export const createNunjucksIncludeTemplate = (templateName: string) =>
  `{% include '${templateName}' %}`;
