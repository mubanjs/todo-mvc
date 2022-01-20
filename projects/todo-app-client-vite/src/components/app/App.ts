import {
  bind,
  bindTemplate,
  defineComponent,
  refComponent,
  refComponents, watchEffect,
} from '@muban/muban';
import { AppFooter } from '../app-footer/AppFooter';
import { AppHeader } from '../app-header/AppHeader';
import { TodoItem } from '../todo-item/TodoItem';
import { todoItemTemplate } from '../todo-item/TodoItem.template';
import { useTodos } from './useTodos';


export const App = defineComponent({
  name: "app",
  refs: {
    todoList: 'todoList',
    todoItems: refComponents(TodoItem),
    appHeader: refComponent(AppHeader),
    appFooter: refComponent(AppFooter),
  },
  setup({ refs}) {
    // const initialTodoItems = refs.todoItems.getComponents().map(({ props : { id, title, isCompleted } }) => ({ id, title, isCompleted }));
    const initialTodoItems = JSON.parse(localStorage.getItem('MUBAN_TODO_MVC_LIST') ?? '[]') || [];

    const { todos, filteredTodos, selectedFilter, activeTodoCount, addTodo, removeTodo, updateTodo, clearCompleted } = useTodos(initialTodoItems);

    watchEffect(() => {
      localStorage.setItem('MUBAN_TODO_MVC_LIST', JSON.stringify(todos.value));
    })

    return [
      bind(refs.appHeader, {
        onCreate: addTodo,
      }),
      bindTemplate(
        refs.todoList,
        filteredTodos,
        (items ) => items.map(itemData => todoItemTemplate(itemData)),
        { renderImmediate: true }
      ),
      bind(refs.todoItems, {
        onChange: updateTodo,
        onDelete: removeTodo,
      }),
      bind(refs.appFooter, {
        activeTodoCount,
        selectedFilter,
        onClearCompleted: clearCompleted,
      })
    ];
  }
});
