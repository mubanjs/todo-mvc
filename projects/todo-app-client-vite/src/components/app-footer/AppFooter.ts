import { bind, computed, defineComponent, propType } from '@muban/muban';

export const AppFooter = defineComponent({
  name: 'app-footer',
  refs: {
    todoCount: 'todoCount',
    clearCompletedButton: 'clearCompletedButton',
    filterAll: 'filterAll',
    filterActive: 'filterActive',
    filterCompleted: 'filterCompleted',
  },
  props: {
    activeTodoCount: propType.number.defaultValue(0),
    onClearCompleted: propType.func.optional.shape<() => void>()
  },
  setup({ refs , props}) {
    return [
      bind(refs.todoCount, {
        html: computed(() => `<strong>${props.activeTodoCount}</strong> ${props.activeTodoCount === 1 ? 'items' : 'item'} left`)
      }),
      bind(refs.clearCompletedButton, {
        click() {
          props.onClearCompleted?.();
        }
      })
    ];
  }
})