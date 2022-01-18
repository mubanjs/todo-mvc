import { defineComponent } from "@muban/muban";
import { AppHeader } from '../app-header/AppHeader';
import { TodoItem } from '../todo-item/TodoItem';

export const App = defineComponent({
  name: "app",
  components: [TodoItem, AppHeader],
  setup() {
    console.log('App Running...')
    return [];
  }
});
