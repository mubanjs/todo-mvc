import { bind, defineComponent, propType, ref } from '@muban/muban';

export const AppHeader = defineComponent({
  name: 'app-header',
  refs: {
    newTodoInput: 'newTodoInput',
  },
  props: {
    onCreate: propType.func.optional.shape<(value: string) => void>(),
  },
  setup({ refs, props }) {
    const inputValue = ref('');
    return [
      bind(refs.newTodoInput, {
        textInput: inputValue,
        event: {
          keyup(event) {
            if (event.key === 'Enter') {
              props.onCreate?.(inputValue.value);
              inputValue.value = '';
            }
          },
        },
      }),
    ];
  },
});
