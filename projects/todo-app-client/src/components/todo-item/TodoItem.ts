import { bind, computed, defineComponent, propType, ref, refElement } from '@muban/muban';

export const TodoItem = defineComponent({
  name: 'todo-item',
  refs: {
    completedInput: refElement<HTMLInputElement>('completedInput'),
    title: 'title',
    destroyButton: 'destroyButton',
    editInput: refElement<HTMLInputElement>('editInput'),
  },
  props: {
    id: propType.string,
    title: propType.string.source({ type: 'text', target: 'title' }),
    isCompleted: propType.boolean.source({ type: 'css', name: 'completed' }),
    onChange:
      propType.func.optional.shape<
        (id: string, data: { title?: string; isCompleted?: boolean }) => void
      >(),
    onDelete: propType.func.optional.shape<(id: string) => void>(),
  },
  setup({ props, refs }) {
    const isEditing = ref(false);
    // since we can exit edit mode without saving, we need to store the temp value here
    const editValue = ref(props.title);

    const exitEditing = (saveValue = false) => {
      // either save the value, or restore it to the previous state
      if (saveValue) {
        props.onChange?.(props.id, { title: editValue.value });
      } else {
        editValue.value = props.title;
      }
      // exit editing mode
      isEditing.value = false;
    };

    return [
      bind(refs.self, {
        css: {
          completed: computed(() => props.isCompleted),
          editing: isEditing,
        },
      }),
      bind(refs.completedInput, {
        checked: computed(() => props.isCompleted),
        event: {
          change() {
            props.onChange?.(props.id, {
              isCompleted: Boolean(refs.completedInput.element?.checked),
            });
          },
        },
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
        text: computed(() => props.title),
      }),
      bind(refs.editInput, {
        textInput: editValue,
        event: {
          keydown(event) {
            if (['Esc', 'Escape'].includes(event.key)) {
              exitEditing();
            } else if (['Enter'].includes(event.key)) {
              exitEditing(true);
            }
          },
          blur() {
            exitEditing(true);
          },
        },
      }),
      bind(refs.destroyButton, {
        click() {
          props.onDelete?.(props.id);
        },
      }),
    ];
  },
});
