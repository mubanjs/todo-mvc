import { html } from '@muban/template';

type AppFooterTemplateProps = {
  uncompletedCount?: number;
  selectedFilter?: 'active' | 'completed';
};

export function appFooterTemplate({
  uncompletedCount = 0,
  selectedFilter,
}: AppFooterTemplateProps = {}) {
  return html`
    <footer data-component="app-footer" class="footer">
      <span data-ref="todoCount" class="todo-count">
        <strong>${uncompletedCount}</strong> ${uncompletedCount === 1 ? 'item' : 'items'} left
      </span>
      <ul class="filters">
        <li>
          <a data-ref="filterAll" class="${!selectedFilter ? 'selected' : ''}" href="#/">All</a>
        </li>
        <li>
          <a
            data-ref="filterActive"
            class="${selectedFilter === 'active' ? 'selected' : ''}"
            href="#/active"
          >
            Active
          </a>
        </li>
        <li>
          <a
            data-ref="filterCompleted"
            class="${selectedFilter === 'completed' ? 'selected' : ''}"
            href="#/completed"
          >
            Completed
          </a>
        </li>
      </ul>
      <!-- Hidden if no completed items are left ↓ -->
      <button data-ref="clearCompletedButton" class="clear-completed">Clear completed</button>
    </footer>
  `;
}
