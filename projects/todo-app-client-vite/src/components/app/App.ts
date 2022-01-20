import {
  bind,
  bindTemplate,
  computed,
  defineComponent,
  refComponent,
  refComponents,
  refElement,
  watchEffect,
} from '@muban/muban';
import { AppFooter } from '../app-footer/AppFooter';
import { AppHeader } from '../app-header/AppHeader';
import { TodoItem } from '../todo-item/TodoItem';
import { todoItemTemplate } from '../todo-item/TodoItem.template';
import { useTodos } from './useTodos';

export const App = defineComponent({
  name: 'app',
  refs: {
    appHeader: refComponent(AppHeader),
    toggleAllInput: refElement<HTMLInputElement>('toggleAllInput'),
    mainSection: 'mainSection',
    todoList: 'todoList',
    todoItems: refComponents(TodoItem),
    appFooter: refComponent(AppFooter),
  },
  setup({ refs }) {
    // const initialTodoItems = refs.todoItems.getComponents().map(({ props : { id, title, isCompleted } }) => ({ id, title, isCompleted }));
    const initialTodoItems = JSON.parse(localStorage.getItem('MUBAN_TODO_MVC_LIST') ?? '[]') || [];

    const {
      todos,
      filteredTodos,
      selectedFilter,
      activeTodoCount,
      addTodo,
      removeTodo,
      updateTodo,
      clearCompleted,
      markAllTodosAs,
    } = useTodos(initialTodoItems);

    watchEffect(() => {
      localStorage.setItem('MUBAN_TODO_MVC_LIST', JSON.stringify(todos.value));
    });

    const areAllCompleted = computed(() => activeTodoCount.value === 0);

    return [
      bind(refs.appHeader, {
        onCreate: addTodo,
      }),
      bind(refs.toggleAllInput, {
        checked: areAllCompleted,
        event: {
          change() {
            markAllTodosAs(!areAllCompleted.value);
          },
        },
      }),
      bind(refs.mainSection, {
        style: {
          display: computed(() => (todos.value.length === 0 ? 'none' : 'block')),
        },
      }),
      bindTemplate(
        refs.todoList,
        filteredTodos,
        (items) => items.map((itemData) => todoItemTemplate(itemData)).join(''),
        { renderImmediate: true },
      ),
      bind(refs.todoItems, {
        onChange: updateTodo,
        onDelete: removeTodo,
      }),
      bind(refs.appFooter, {
        style: {
          display: computed(() => (todos.value.length === 0 ? 'none' : 'block')),
        },
        activeTodoCount,
        selectedFilter,
        onClearCompleted: clearCompleted,
      }),
    ];
  },
});
