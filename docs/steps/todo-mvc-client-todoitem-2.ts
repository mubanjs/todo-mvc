import { defineComponent } from '@muban/muban';

export const TodoItem = defineComponent({
  name: 'todo-item',
  refs: {
    completedInput: 'completedInput',
    title: 'title',
    destroyButton: 'destroyButton',
    editInput: 'editInput',
  },
  setup() {
    return [];
  },
});
