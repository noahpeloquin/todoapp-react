import { createBrowserHistory, createMemoryHistory } from 'history';

let history;
if (process.env.NODE_ENV === 'test') {
  history = createMemoryHistory();
} else {
  history = createBrowserHistory();
}

export default history;
