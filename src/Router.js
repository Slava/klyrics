import SimpleReactRouter from 'simple-react-router';
import App from './App';
import {APP} from './constants';

export default class Router extends SimpleReactRouter {
  routes(map) {
    map('/', App, {type: APP.HOMEPAGE});
    map('/artist/:path*', App, {type: APP.ARTIST});
    map('/:path*', App, {type: APP.LYRICS});
  }
}
