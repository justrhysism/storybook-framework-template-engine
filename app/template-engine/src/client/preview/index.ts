/* eslint-disable prefer-destructuring */
import { start } from '@storybook/core/client';
import { ClientStoryApi, Loadable } from '@storybook/addons';
import { TemplateEngineFramework } from './types-6-0';

import './globals';
import { renderToDOM } from './render';
import { IStorybookSection } from './types';

const framework = 'html';

interface ClientApi extends ClientStoryApi<TemplateEngineFramework['storyResult']> {
  setAddon(addon: any): void;
  configure(loader: Loadable, module: NodeModule): void;
  getStorybook(): IStorybookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: () => any; // todo add type
}

const api = start(renderToDOM);

export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  return (api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({
    framework,
  });
};

export const configure: ClientApi['configure'] = (...args) => api.configure(framework, ...args);
export const addDecorator: ClientApi['addDecorator'] = api.clientApi
  .addDecorator as ClientApi['addDecorator'];
export const addParameters: ClientApi['addParameters'] = api.clientApi
  .addParameters as ClientApi['addParameters'];
export const clearDecorators: ClientApi['clearDecorators'] = api.clientApi.clearDecorators;
export const setAddon: ClientApi['setAddon'] = api.clientApi.setAddon;
export const forceReRender: ClientApi['forceReRender'] = api.forceReRender;
export const getStorybook: ClientApi['getStorybook'] = api.clientApi.getStorybook;
export const raw: ClientApi['raw'] = api.clientApi.raw;
