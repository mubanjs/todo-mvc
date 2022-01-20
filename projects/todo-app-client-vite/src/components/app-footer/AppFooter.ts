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
    onClearCompleted: propType.func.optional.shape<() => void>(),
    selectedFilter: propType.string.optional,
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
      }),
      bind(refs.filterAll, {
        css: { selected: computed(() => props.selectedFilter === undefined)}
      }),
      bind(refs.filterActive, {
        css: { selected: computed(() => props.selectedFilter === 'active')}
      }),
      bind(refs.filterCompleted, {
        css: { selected: computed(() => props.selectedFilter === 'completed')}
      })
    ];
  }
})