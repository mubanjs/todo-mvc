import { ComponentTemplateResult, html } from '@muban/template';
import { appFooterTemplate } from '../app-footer/AppFooter.template';
import { appHeaderTemplate } from '../app-header/AppHeader.template';
import { todoItemTemplate, TodoItemTemplateProps } from '../todo-item/TodoItem.template';

export type AppTemplateProps = {
  title?: string;
  todos?: Array<TodoItemTemplateProps>;
};

export function appTemplate({ title, todos = [] }: AppTemplateProps = {}): ComponentTemplateResult {
  return html`
    <div data-component="app">
      <section class="todoapp">
        ${appHeaderTemplate({ title })}
        <section class="main">
          <input data-ref="toggleAllInput" id="toggle-all" class="toggle-all" type="checkbox" />
          <label for="toggle-all">Mark all as complete</label>
          <ul data-ref="todoList" class="todo-list">
            ${todos.map((todo) => todoItemTemplate(todo))}
          </ul>
        </section>
        ${appFooterTemplate({ uncompletedCount: todos.filter((todo) => !todo.isCompleted).length })}
      </section>
      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="http://github.com/mubanjs">Muban</a></p>
      </footer>
    </div>
  `;
}
