import { bindTemplate, computed, defineComponent, reactive, refComponents } from '@muban/muban';
import { AppHeader } from '../app-header/AppHeader';
import { TodoItem } from '../todo-item/TodoItem';
import { todoItemTemplate } from '../todo-item/TodoItem.template';

export const App = defineComponent({
  name: "app",
  components: [TodoItem, AppHeader],
  refs: {
    todoList: 'todoList',
    todoItems: refComponents(TodoItem),
  },
  setup({ refs}) {
    const initialTodoItems = refs.todoItems.getComponents().map(({ props : { title, isCompleted } }) => ({ title, isCompleted }));
    const todos = reactive(initialTodoItems);

    return [
      bindTemplate(
        refs.todoList,
        computed(() => todos),
        (items ) => items.map(itemData => todoItemTemplate(itemData))
      ),
    ];
  }
});
