import { defineComponent, propType } from '@muban/muban';

export const TodoItem = defineComponent({
  name: 'todo-item',
  refs: {
    completedInput: 'completedInput',
    title: 'title',
    destroyButton: 'destroyButton',
    editInput: 'editInput',
  },
  props: {
    title: propType.string.source({ type: 'text', target: 'title' }),
    isCompleted: propType.boolean.source({ type: 'css', name: 'completed' }),
  },
  setup() {
    return [];
  },
});
