import { html, ComponentTemplateResult } from '@muban/template';

export type AppTemplateProps = {
  title?: string;
};

export function appTemplate({ title = 'Todos' }: AppTemplateProps): ComponentTemplateResult {
  return html`
    <div data-component="app">
      <h1>${title}</h1>
    </div>
  `;
}
