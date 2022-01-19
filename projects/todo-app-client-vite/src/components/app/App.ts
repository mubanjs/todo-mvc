import {
  bind, bindMap,
  bindTemplate, computed,
  defineComponent,
  ref,
  refComponents,
} from '@muban/muban';
import { AppFooter } from '../app-footer/AppFooter';
import { AppHeader } from '../app-header/AppHeader';
import { TodoItem } from '../todo-item/TodoItem';
import { todoItemTemplate } from '../todo-item/TodoItem.template';

export const App = defineComponent({
  name: "app",
  refs: {
    todoList: 'todoList',
    todoItems: refComponents(TodoItem),
    appHeader: refComponents(AppHeader),
    appFooter: refComponents(AppFooter),
  },
  setup({ refs}) {
    const initialTodoItems = refs.todoItems.getComponents().map(({ props : { title, isCompleted } }) => ({ title, isCompleted }));
    const todos = ref(initialTodoItems);

    return [
      bind(refs.appHeader, {
        onCreate(newTodo) {
          todos.value = todos.value.concat({title: newTodo, isCompleted: false});
        }
      }),
      ...bindMap(refs.todoItems, (_, refIndex) => ({
        ...todos.value[refIndex],
        onChange(newProps) {
          todos.value = todos.value.map((item, index) => index === refIndex ? ({...item, ...newProps}) : item)
        },
        onDelete() {
          todos.value = todos.value.filter((_, index) => index !== refIndex)
        }
      })),
      bindTemplate(
        refs.todoList,
        todos,
        (items ) => items.map(itemData => todoItemTemplate(itemData)),
      ),
      bind(refs.appFooter, {
        activeTodoCount: computed(() => todos.value.filter(todo => !todo.isCompleted).length),
        onClearCompleted() {
          todos.value = todos.value.filter(todo => !todo.isCompleted);
        }
      })
    ];
  }
});
