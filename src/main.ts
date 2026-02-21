import './main.css';
import { App } from './app';

const app = document.getElementById('app');
if (app) {
  const appInstance = new App(app);
  appInstance.mount();
}
