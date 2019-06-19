export function put(key, value) {
  localStorage.setItem(key, value);
}

export function get(key) {
  return localStorage.getItem(key);
}

export function remove(key) {
  return localStorage.removeItem(key);
}

export function clear() {
  localStorage.clear();
}
