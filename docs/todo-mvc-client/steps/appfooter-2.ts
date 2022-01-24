import { bind, computed, defineComponent, propType } from '@muban/muban';

export const AppFooter = defineComponent({
  name: 'app-footer',
  refs: {
    remainingCount: 'remainingCount',
    clearCompletedButton: 'clearCompletedButton',
    filterAll: 'filterAll',
    filterActive: 'filterActive',
    filterCompleted: 'filterCompleted',
  },
  props: {
    remainingTodoCount: propType.number.defaultValue(0),
    onClearCompleted: propType.func.optional.shape<() => void>(),
  },
  setup({ refs, props }) {
    return [
      bind(refs.remainingCount, {
        html: computed(
          () =>
            `<strong>${props.remainingTodoCount}</strong> ${
              props.remainingTodoCount === 1 ? 'item' : 'items'
            } left`,
        ),
      }),
      bind(refs.clearCompletedButton, {
        click() {
          props.onClearCompleted?.();
        },
      }),
    ];
  },
});
