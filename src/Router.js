import SimpleReactRouter from 'simple-react-router';
import App from './App';
import HomePage from './HomePage';

export default class Router extends SimpleReactRouter {
  routes(map) {
    map('/', HomePage);
    map('/:path*', App);
  }
}
