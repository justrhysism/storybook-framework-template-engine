# Storybook for Templating Engines

---

Storybook for Templating Engines is a UI development environment for your template snippets (e.g. using [LiquidJS](https://liquidjs.com/) or [Nunjucks](https://mozilla.github.io/nunjucks/)).
With it, you can visualize different states of your UI components and develop them interactively.

![Storybook Screenshot](https://github.com/storybookjs/storybook/blob/main/media/storybook-intro.gif)

Storybook runs outside of your app.
So you can develop UI components in isolation without worrying about app specific dependencies and requirements.

## 🚀 Getting Started

Follow Storybook's [setup instructions](https://storybook.js.org/docs/html/get-started/install).

Install this framework:

```sh
# Using your configured package manager (e.g. npm, yarn or pnpm)
npm install storybook-framework-template-engine --save-dev
```

Once installed, a couple of steps are required to get your templating engine to parse and render templates.

### Step 1

> 💡 The following examples are for [LiquidJS](https://liquidjs.com/), the specific implementation will vary depending on the templating engine.

A render function parameter needs to be configured for your templating engine. For convenience you can do this setting [global parameters](https://storybook.js.org/docs/html/writing-stories/parameters#global-parameters):

```js
// .storybook/preview.js

// Import your template engine - in this case LiquidJS
import { Liquid } from 'liquidjs';

const engine = new Liquid({
  root: 'templates', // Relative to `/src`
  extname: '.liquid', // Allows omission of `.liquid` extension
});

export const parameters = {
  templateEngine: {
    // Receives the story template and args which can be passed to renderer
    render: (template, args) => engine.parseAndRender(template), // Returns Promise (async)

    /*
      // Nunjucks example (@see: https://mozilla.github.io/nunjucks/api.html#renderstring)
      render: (template, args) => nunjucks.renderString(template, args),
    */
  },
};
```

> 💡 Note: it might be worth configuring the engine in a separate file which can then be shared with a Webpack loader.

### Step 2

Configure Storybook to expose templates as [static files](https://storybook.js.org/docs/html/configure/images-and-assets#serving-static-files-via-storybook-configuration):

```js
// .storybook/main.js

module.exports = {
  // Set framework
  framework: 'storybook-framework-template-engine',

  // ...other config...

  staticDirs: [
    // Expose templates as static files
    {
      from: '../src/templates',
      to: '/templates', // Match with root input to the template engine
    },
  ],
};
```

## 🖋 Write Stories

Stories need to return a string which is then passed to the function provided to `parameters.templateEngine.render()`.

```js
// stories/Button.stories.js
export default {
  title: 'Example/Button',
};

// Return a string to be passed to the render function
export const Default = () => `<button>My Button</button>`;
```

### Loading Templates

However, this particular example is of little use on it's own as it's not really using the templating engine we've configured.

Let's create a template file (using the example LiquidJS):

```liquid
<!-- src/templates/button.liquid -->
<button>{{ label | default: 'My Button' }}</button>
```

Liquid allows us to render templates using the [`render`](https://liquidjs.com/tags/render.html) tag.

```js
// stories/Button.stories.js
export default {
  title: 'Example/Button',
};

// Return a string of Liquid markup
export const Default = () => `{% render 'button' %}`;
```

The string is then parsed by Liquid and the render tag tells Liquid to fetch the template, of which we have exposed using Storybook's `staticDirs`.

### Passing Parameters

We can make the templates integrate with Storybook's controls by forwarding the arguments to the render tag:

```js
// stories/Button.stories.js
export default {
  title: 'Example/Button',
  argTypes: {
    label: { control: 'text' },
  },
};

// Return a string of Liquid markup
export const Default = (args) => `{% render 'button', label: ${args.label} %}`;
Default.args = {
  label: 'Custom Label',
};
```

### 💪 Optional: Docs Source Code Override

To see how the templates can be used in your actual project (as in, the one Storybook is supporting), you can override docs source to show template provided to render function.

```js
// stories/Button.stories.js
export default {
  title: 'Example/Button',
  argTypes: {
    label: { control: 'text' },
  },
};

// Return a string of Liquid markup
export const Default = (args) => `{% render 'button', label: ${args.label} %}`;
Default.args = {
  label: 'Custom Label',
  docs: {
    // Override source code output for `Docs` addon
    transformSource(snippet, story) {
      return `{% render 'button', label: ${story.parameters.label} %}`;
    },
  },
};
```

#### 🦾 Upgrade: Render Template Function

Taking this concept even further, we can simplify our story writing by creating a utility function which provides the render code and forwards the arguments automatically:

```js
// stories/utils.js
import { escape, isString } from 'lodash-es';

/**
 * Use in place of `Template.bind({})` to generate a Template and automatically
 * provide `transformSource` to override the docs.
 */
export const bindRenderTemplate = (templateName) => {
  const Template = (args) => createRenderTemplate(templateName, args);

  Template.parameters = {
    docs: {
      ...(Template.parameters?.docs ?? {}),
      transformSource(snippet, story) {
        return createRenderTemplate(templateName, story.parameters.args);
      },
    },
  };

  return Template;
};

/**
 * Create LiquidJS render code with provided arguments.
 */
export const createLiquidRenderTemplate = (templateName, args) => {
  const argEntries = Object.entries(args);

  return `{% render '${templateName}'${argEntries.length ? ', ' : ''}${argEntries
    .map(([k, v]) => `${k}: ${isString(v) ? `'${escape(v)}'` : JSON.stringify(v)}`)
    .join(', ')} %}`;
};
```

```js
// stories/Button.stories.js

import { bindRenderTemplate } from '../utils';

export default {
  title: 'Example/Button',
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
  },
};

const templateName = 'button';

export const Primary = bindRenderTemplate(templateName);
Primary.args = {
  label: 'Primary Button',
  primary: true,
};

export const Secondary = bindRenderTemplate(templateName);
Secondary.args = {
  label: 'Secondary Button',
};
```
