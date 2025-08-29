const createShouldContinue = (shouldContinue) => (division, components) => {
    const { always, never } = division;
    const result = new Set();
    for (const i of components) {
        if (shouldContinue[i](always[i], never[i])) {
            result.add(i);
        }
    }
    return result;
};
const createMidpoint = (midpoint) => (division, components) => {
    const { always, never } = division;
    return midpoint.map((fn, i) => components.has(i) ? fn(always[i], never[i]) : always[i]);
};
const vectorWith = (vector, index, value) => {
    const result = vector.slice();
    result[index] = value;
    return result;
};
const createDivide = (predicate) => {
    const divide = function* (forward, backward, mid, result, components, done = new Set()) {
        yield result
            ? { always: mid, never: forward }
            : { always: forward, never: mid };
        const _done = new Set(done);
        for (const i of components) {
            if (_done.has(i))
                continue;
            _done.add(i);
            const omitted = vectorWith(forward, i, mid[i]);
            if (predicate(omitted) === result) {
                continue;
            }
            const counter = vectorWith(mid, i, backward[i]);
            yield* divide(omitted, backward, counter, result, components, _done);
        }
    };
    return divide;
};
const createDfsBinarySearch = (predicate, divide, midpoint, shouldContinue) => {
    const dfsBinarySearch = function* (division, components) {
        const _components = shouldContinue(division, components);
        if (_components.size === 0) {
            yield division.always;
            return;
        }
        const mid = midpoint(division, _components);
        const result = predicate(mid);
        const forward = result ? division.never : division.always;
        const backward = result ? division.always : division.never;
        const divisions = divide(forward, backward, mid, result, _components);
        for (const division of divisions) {
            yield* dfsBinarySearch(division, _components);
        }
    };
    return dfsBinarySearch;
};
export const ndBinarySearch = function* (alwaysEnd, neverEnd, predicate, midpoint, shouldContinue) {
    if (alwaysEnd.length !== neverEnd.length ||
        neverEnd.length !== midpoint.length ||
        midpoint.length !== shouldContinue.length) {
        throw new Error("All input vectors must have the same length");
    }
    const divide = createDivide(predicate);
    const m = createMidpoint(midpoint);
    const c = createShouldContinue(shouldContinue);
    const dfsBinarySearch = createDfsBinarySearch(predicate, divide, m, c);
    const components = new Set(Array.from(alwaysEnd, (_, i) => i));
    yield* dfsBinarySearch({ always: alwaysEnd, never: neverEnd }, components);
};
