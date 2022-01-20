import type { ComponentTemplateResult } from '@muban/template';
import { html } from '@muban/template';

export type TodoItemTemplateProps = {
  id: string;
  isCompleted: boolean;
  title: string;
};

export function todoItemTemplate({
  isCompleted,
  title,
  id,
}: TodoItemTemplateProps): ComponentTemplateResult {
  // there is also an `editing` class, but that's only set when interacting with the element
  return html`<li
    data-component="todo-item"
    data-id=${id}
    class="${isCompleted ? 'completed' : ''}"
  >
    <div class="view">
      <input data-ref="completedInput" class="toggle" type="checkbox" checked=${isCompleted} />
      <label data-ref="title">${title}</label>
      <button data-ref="destroyButton" class="destroy"></button>
    </div>
    <input data-ref="editInput" class="edit" />
  </li>`;
}
