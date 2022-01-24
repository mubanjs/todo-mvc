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
    selectedFilter: propType.string.optional,
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
      bind(refs.filterAll, {
        css: { selected: computed(() => props.selectedFilter === undefined) },
      }),
      bind(refs.filterActive, {
        css: { selected: computed(() => props.selectedFilter === 'active') },
      }),
      bind(refs.filterCompleted, {
        css: { selected: computed(() => props.selectedFilter === 'completed') },
      }),
    ];
  },
});
