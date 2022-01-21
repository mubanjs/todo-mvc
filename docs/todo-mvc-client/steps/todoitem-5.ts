import { bind, defineComponent, propType, ref, refElement } from '@muban/muban';

export const TodoItem = defineComponent({
  name: 'todo-item',
  refs: {
    completedInput: 'completedInput',
    title: 'title',
    destroyButton: 'destroyButton',
    editInput: refElement<HTMLInputElement>('editInput'),
  },
  props: {
    title: propType.string.source({ type: 'text', target: 'title' }),
    isCompleted: propType.boolean.source({ type: 'css', name: 'completed' }),
  },
  setup({ props, refs }) {
    const isCompleted = ref(props.isCompleted);
    const isEditing = ref(false);
    // since we can exit edit mode without saving, we need to store the temp value here
    const editValue = ref(props.title);

    return [
      bind(refs.self, {
        css: {
          completed: isCompleted,
          editing: isEditing,
        },
      }),
      bind(refs.completedInput, {
        checked: isCompleted,
      }),
      bind(refs.title, {
        event: {
          dblclick() {
            isEditing.value = true;
            // delay focussing until the element is updated to `display: block`
            // the `hasFocus` binding has the same issue – being too quick
            queueMicrotask(() => {
              refs.editInput.element?.focus();
            });
          },
        },
      }),
      bind(refs.editInput, {
        textInput: editValue,
      }),
    ];
  },
});
