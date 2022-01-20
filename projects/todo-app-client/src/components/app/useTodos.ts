import { useEventListener } from '@muban/hooks';
import { computed, ref } from '@muban/muban';
import { nanoid } from 'nanoid';
import type { TodoItemTemplateProps } from '../todo-item/TodoItem.template';

function getFilterFromUrl(): 'active' | 'completed' | undefined {
  const [, filter] = document.location.hash.split('/');
  if (filter === 'active' || filter === 'completed') {
    return filter;
  }
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useTodos(initialTodoItems: Array<TodoItemTemplateProps>) {
  const todos = ref(initialTodoItems);
  const selectedFilter = ref<'active' | 'completed' | undefined>(getFilterFromUrl());
  useEventListener(window, 'popstate', () => {
    selectedFilter.value = getFilterFromUrl();
  });

  const filteredTodos = computed(() => {
    if (selectedFilter.value === undefined) {
      return todos.value;
    }
    return todos.value.filter(
      (todo) => todo.isCompleted === (selectedFilter.value === 'completed'),
    );
  });

  const activeTodoCount = computed(() => todos.value.filter((todo) => !todo.isCompleted).length);

  const addTodo = (title: string) => {
    const sanitizedTitle = title.trim();
    if (sanitizedTitle.length > 0) {
      todos.value = todos.value.concat({ title: sanitizedTitle, isCompleted: false, id: nanoid() });
    }
  };
  const removeTodo = (id: string) => {
    todos.value = todos.value.filter((item) => item.id !== id);
  };
  const updateTodo = (id: string, newValues: Partial<TodoItemTemplateProps>) => {
    let newItem = newValues;
    if (newValues.title !== undefined) {
      const sanitizedTitle = newValues.title.trim();
      // if an empty title would be set, remove the item
      if (sanitizedTitle.length === 0) {
        removeTodo(id);
        return;
      }
      // update with sanitizedTitle when not empty
      newItem = { ...newValues, title: sanitizedTitle };
    }
    todos.value = todos.value.map((item) => (item.id === id ? { ...item, ...newItem } : item));
  };
  const clearCompleted = () => {
    todos.value = todos.value.filter((todo) => !todo.isCompleted);
  };

  const markAllTodosAs = (isCompleted: boolean) => {
    todos.value = todos.value.map((todo) => ({
      ...todo,
      isCompleted,
    }));
  };

  return {
    todos,
    filteredTodos,
    selectedFilter,
    activeTodoCount,
    addTodo,
    removeTodo,
    updateTodo,
    clearCompleted,
    markAllTodosAs,
  };
}
