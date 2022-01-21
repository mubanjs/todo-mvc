import { defineComponent } from '@muban/muban';
import { TodoItem } from '../todo-item/TodoItem';

export const App = defineComponent({
  name: 'app',
  components: [TodoItem],
  setup() {
    console.log('App Running...');
    return [];
  },
});
