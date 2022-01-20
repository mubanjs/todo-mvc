import { html } from '@muban/template';

export type AppHeaderTemplateProps = {
  title?: string;
};

export function appHeaderTemplate({ title = 'Todos' }: AppHeaderTemplateProps = {}) {
  return html`<div data-component="app-header" class="header">
    <h1>${title}</h1>
    <input
      data-ref="newTodoInput"
      class="new-todo"
      placeholder="What needs to be done?"
      autofocus
    />
  </div>`;
}
