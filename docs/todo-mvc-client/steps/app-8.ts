import {
  bind,
  bindMap,
  bindTemplate,
  computed,
  defineComponent,
  ref,
  refComponent,
  refComponents,
} from '@muban/muban';
import { AppFooter } from '../app-footer/AppFooter';
import { AppHeader } from '../app-header/AppHeader';
import { TodoItem } from '../todo-item/TodoItem';
import { todoItemTemplate } from '../todo-item/TodoItem.template';

export const App = defineComponent({
  name: 'app',
  refs: {
    appHeader: refComponent(AppHeader),
    todoList: 'todoList',
    todoItems: refComponents(TodoItem),
    appFooter: refComponent(AppFooter),
  },
  setup({ refs }) {
    const initialTodoItems = refs.todoItems
      .getComponents()
      .map(({ props: { title, isCompleted } }) => ({ title, isCompleted }));
    const todos = ref(initialTodoItems);

    return [
      bind(refs.appHeader, {
        onCreate(newTodo) {
          todos.value = todos.value.concat({ title: newTodo, isCompleted: false });
        },
      }),
      bindTemplate(refs.todoList, todos, (items) =>
        items.map((itemData) => todoItemTemplate(itemData)).join(''),
      ),
      ...bindMap(refs.todoItems, (_, refIndex) => ({
        onChange(newProps) {
          todos.value = todos.value.map((item, index) =>
            index === refIndex ? { ...item, ...newProps } : item,
          );
        },
        onDelete() {
          todos.value = todos.value.filter((_, index) => index !== refIndex);
        },
      })),
      bind(refs.appFooter, {
        remainingTodoCount: computed(() => todos.value.filter((todo) => !todo.isCompleted).length),
        onClearCompleted() {
          todos.value = todos.value.filter((todo) => !todo.isCompleted);
        },
      }),
    ];
  },
});
