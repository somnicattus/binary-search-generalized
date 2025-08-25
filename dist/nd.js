const createContext = (predicate, midpoint, shouldContinue) => {
    const d = new Set(midpoint.keys());
    const _continue = (always, never) => {
        let result = 0;
        for (const i of d) {
            if (shouldContinue[i](always[i], never[i])) {
                result++;
            }
            else {
                d.delete(i);
            }
        }
        return result;
    };
    const _midpoint = (always, never) => midpoint.map((fn, i) => d.has(i) ? fn(always[i], never[i]) : always[i]);
    return {
        p: predicate,
        c: _continue,
        m: _midpoint,
        d,
    };
};
const vectorMergePartial = (vector1, vector2, components) => {
    const result = vector1.slice();
    for (const i of components) {
        result[i] = vector2[i];
    }
    return result;
};
const createDfsBinarySearch = (ctx) => {
    const { p, m, c, d } = ctx;
    const divide = function* (forward, backward, base, baseResult, done = -1, omit = new Set()) {
        if (omit.size === 0) {
            const division = baseResult
                ? { always: base, never: forward }
                : { always: forward, never: base };
            yield division;
        }
        if (omit.size === d.size)
            return;
        for (const i of [...d].filter((i) => i > done)) {
            omit.add(i);
            const newForward = vectorMergePartial(forward, base, omit);
            const newBackward = vectorMergePartial(base, backward, omit);
            const newResult = p(newForward);
            if (newResult === baseResult) {
                omit.delete(i);
                continue;
            }
            const always = baseResult ? newBackward : newForward;
            const never = baseResult ? newForward : newBackward;
            yield { always, never };
            yield* divide(forward, backward, base, baseResult, i, omit);
            omit.delete(i);
        }
    };
    const dfsBinarySearch = function* (division) {
        const mid = m(division.always, division.never);
        const result = p(mid);
        const forward = result ? division.never : division.always;
        const backward = result ? division.always : division.never;
        for (const { always, never } of divide(forward, backward, mid, result)) {
            const _d = [...d];
            if (c(always, never)) {
                yield* dfsBinarySearch({ always, never });
            }
            else {
                yield always;
            }
            _d.forEach((i) => d.add(i));
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
    const ctx = createContext(predicate, midpoint, shouldContinue);
    const dfsBinarySearch = createDfsBinarySearch(ctx);
    yield* dfsBinarySearch({ always: alwaysEnd, never: neverEnd });
};
