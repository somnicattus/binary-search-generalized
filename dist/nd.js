const createContext = (predicate, midpoint, shouldContinue) => {
    if (midpoint.length !== shouldContinue.length) {
        throw new Error("midpoint and shouldContinue must have the same length");
    }
    const length = midpoint.length;
    const d = Array.from({ length }, () => true);
    const _continue = (always, never) => {
        let result = 0;
        for (let i = 0; i < length; i++) {
            if (!d[i])
                continue;
            if (shouldContinue[i](always[i], never[i])) {
                result++;
            }
            else {
                d[i] = false;
            }
        }
        return result;
    };
    const _midpoint = (always, never) => midpoint.map((fn, i) => d[i] ? fn(always[i], never[i]) : always[i]);
    return {
        p: predicate,
        c: _continue,
        m: _midpoint,
        d,
    };
};
const vectorMergePartial = (vector1, vector2, indexes) => {
    const result = vector1.slice();
    for (const index of indexes) {
        result[index] = vector2[index];
    }
    return result;
};
const createDfsBinarySearch = (ctx) => {
    const { p, m, c, d } = ctx;
    const divide = function* (forward, backward, base, baseResult, done = 0, omit = new Set()) {
        if (omit.size === 0) {
            const division = baseResult
                ? { always: base, never: forward }
                : { always: forward, never: base };
            yield division;
        }
        if (omit.size === d.length)
            return;
        for (let i = done; i < d.length; i++) {
            if (!d[i])
                continue;
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
            yield* divide(forward, backward, base, baseResult, i + 1, omit);
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
            d.splice(0, d.length, ..._d);
        }
    };
    return dfsBinarySearch;
};
export const ndBinarySearch = function* (alwaysEnd, neverEnd, predicate, midpoint, shouldContinue) {
    const ctx = createContext(predicate, midpoint, shouldContinue);
    const dfsBinarySearch = createDfsBinarySearch(ctx);
    yield* dfsBinarySearch({ always: alwaysEnd, never: neverEnd });
};
