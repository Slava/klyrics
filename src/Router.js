import SimpleReactRouter from 'simple-react-router';
import App from './App';
import HomePage from './HomePage';
import {APP} from './constants';

export default class Router extends SimpleReactRouter {
  routes(map) {
    map('/', HomePage);
    map('/artist/:path*', App, {type: APP.ARTIST});
    map('/:path*', App, {type: APP.LYRICS});
  }
}
