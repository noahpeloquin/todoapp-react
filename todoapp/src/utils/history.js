import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

let history;
if (process.env.NODE_ENV === 'test') {
  history = createMemoryHistory();
} else {
  history = createBrowserHistory();
}

export default history;
