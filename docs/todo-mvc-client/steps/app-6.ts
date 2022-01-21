import { bind, bindMap, bindTemplate, defineComponent, ref, refComponents } from '@muban/muban';
import { AppHeader } from '../app-header/AppHeader';
import { TodoItem } from '../todo-item/TodoItem';
import { todoItemTemplate } from '../todo-item/TodoItem.template';

export const App = defineComponent({
  name: 'app',
  refs: {
    todoList: 'todoList',
    todoItems: refComponents(TodoItem),
    appHeader: refComponents(AppHeader),
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
        items.map((itemData) => todoItemTemplate(itemData)),
      ),
      ...bindMap(refs.todoItems, (_, refIndex) => ({
        onChange(newProps) {
          todos.value = todos.value.map((item, index) =>
            index === refIndex ? { ...item, ...newProps } : item,
          );
        },
      })),
    ];
  },
});
