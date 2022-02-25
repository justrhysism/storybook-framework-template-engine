/* eslint-disable no-param-reassign */
import global from 'global';
import dedent from 'ts-dedent';
import { simulatePageLoad, simulateDOMContentLoaded } from '@storybook/preview-web';
import { RenderContext } from '@storybook/store';
import { TemplateEngineFramework } from './types-6-0';

const { Node } = global;

export async function renderToDOM(
  {
    storyFn,
    kind,
    name,
    showMain,
    showError,
    forceRemount,
    storyContext,
  }: RenderContext<TemplateEngineFramework>,
  domElement: HTMLElement
) {
  const { parameters } = storyContext;

  const template = storyFn();
  showMain();

  // Allow compatibility with HTML nodes
  if (typeof template !== 'string' && template instanceof Node) {
    if (domElement.firstChild === template && forceRemount === false) {
      return;
    }

    domElement.innerHTML = '';
    domElement.appendChild(template);
    simulateDOMContentLoaded();
    return;
  }

  if (typeof template !== 'string') {
    showError({
      title: `Expecting an template snippet from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the template snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
    return;
  }

  const renderFn = parameters.templateEngine?.render;

  // Check for render function if we actually need it (i.e. the story returns a string)
  if (!renderFn) {
    showError({
      title: `Missing render function parameter from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to provide the render function?
        Provide your template render function via "parameters.templateEngine.render" either globally
        in your ".storybook/preview.js" or via story parameters.
      `,
    });
    return;
  }

  const element = await renderFn(template);

  if (typeof element === 'string') {
    domElement.innerHTML = element;
    simulatePageLoad(domElement);
  } else {
    showError({
      title: `Expecting an HTML snippet or DOM Node result from render function parameter for the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the HTML snippet from the render function parameter for the story?
        Use "parameters.templateEngine.render = (template) => <your template engine's render function>" when defining the story's parameters.
      `,
    });
  }
}
