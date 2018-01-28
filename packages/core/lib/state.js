import {set, merge, getOr} from "lodash/fp";

const State = st => ({
  runState: x => st(x),

  map: f =>
    State(x => {
      const [a, ss] = st(x);
      return [f(a), ss];
    }),

  chain: f =>
    State(s => {
      const [l, r] = st(s);
      return f(l).runState(r);
    }),
});

State.of = x => State(s => [x, s]);

export const state = (obj = {}) => {
  let s = State.of({});

  const get = path => {
    const data = s.runState(obj)[1];
    return path ? getOr({}, path, data) : data;
  };

  // FIXME: Updating existing paths fails at the moment.
  const update = (...args) => {
    let [path, f] = args;
    if (!f) {
      f = path;
      path = null;
    }

    const calc = data => {
      const applied = path ? f(getOr({}, path, data)) : f(data);
      const expanded = path ? set(path, applied, {}) : applied;
      return merge(data, expanded);
    };

    s = s.chain(data => State(ss => [data, Object.assign({}, calc(data), ss)]));

    return s;
  };

  return {
    get,
    update,
  };
};

export default {state};
