import './style.css';

import { createApp } from '@muban/muban';
import { App } from './components/app/App';
import { appTemplate } from './components/app/App.template';

const appRoot = document.getElementById('app')!;
const app = createApp(App);

app.mount(appRoot, appTemplate, {
  title: 'Todos',
});
