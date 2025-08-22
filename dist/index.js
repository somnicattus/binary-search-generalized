export const binarySearch = (alwaysEnd, neverEnd, predicate, midpoint, epsilon, safety = "check") => {
    const alwaysIsLower = alwaysEnd < neverEnd;
    let low = alwaysIsLower ? alwaysEnd : neverEnd;
    let high = alwaysIsLower ? neverEnd : alwaysEnd;
    if (safety === "check" || safety === "strict") {
        if (typeof alwaysEnd !== typeof neverEnd ||
            typeof epsilon !== typeof alwaysEnd) {
            throw new RangeError("alwaysEnd, neverEnd, and epsilon must be of the same type");
        }
        if (!predicate(alwaysEnd)) {
            throw new RangeError("alwaysEnd must satisfy the condition");
        }
        if (predicate(neverEnd)) {
            throw new RangeError("neverEnd must not satisfy the condition");
        }
        if (epsilon <= 0) {
            throw new RangeError("epsilon must be positive");
        }
        if (high - low < epsilon) {
            throw new RangeError("alwaysEnd and neverEnd must be different within the epsilon range");
        }
        if (typeof epsilon === "number") {
            if (!Number.isFinite(epsilon) ||
                !Number.isFinite(alwaysEnd) ||
                !Number.isFinite(neverEnd)) {
                throw new RangeError("alwaysEnd, neverEnd, and epsilon must be finite numbers");
            }
            if (high - epsilon === high || low + epsilon === low) {
                throw new RangeError("epsilon must be representable at the precision of alwaysEnd and neverEnd");
            }
        }
    }
    if (safety === "strict") {
        while (high - low > epsilon) {
            const middle = midpoint(low, high);
            if (middle >= high || middle <= low) {
                throw new RangeError(`midpoint function did not converge: got ${middle} with ${low} and ${high}`);
            }
            if (predicate(middle) === alwaysIsLower)
                low = middle;
            else
                high = middle;
        }
        return alwaysIsLower ? low : high;
    }
    while (high - low > epsilon) {
        const middle = midpoint(low, high);
        if (predicate(middle) === alwaysIsLower)
            low = middle;
        else
            high = middle;
    }
    return alwaysIsLower ? low : high;
};
export const binarySearchInteger = (alwaysEnd, neverEnd, predicate, safety = "check") => {
    if (safety === "check") {
        if (Number.isSafeInteger(alwaysEnd) === false ||
            Number.isSafeInteger(neverEnd) === false) {
            throw new RangeError("alwaysEnd and neverEnd must be safe integers");
        }
    }
    return binarySearch(alwaysEnd, neverEnd, predicate, (low, high) => Math.floor(low / 2 + high / 2), 1, safety);
};
export const binarySearchBigint = (alwaysEnd, neverEnd, predicate, safety = "check") => {
    return binarySearch(alwaysEnd, neverEnd, predicate, (low, high) => (low + high) / 2n, 1n, safety);
};
export const binarySearchDouble = (alwaysEnd, neverEnd, predicate, epsilon = "auto", safety = "check") => {
    if (epsilon === "limit") {
        const alwaysIsLower = alwaysEnd < neverEnd;
        let nextAlways = alwaysEnd;
        let nextNever = neverEnd;
        let nextEps = getEpsilon(nextAlways, nextNever);
        while (true) {
            nextAlways = binarySearch(nextAlways, nextNever, predicate, (low, high) => low / 2 + high / 2, nextEps, safety);
            nextNever = alwaysIsLower ? nextAlways + nextEps : nextAlways - nextEps;
            const lastEps = nextEps;
            nextEps = getEpsilon(nextAlways, nextNever);
            if (nextEps === lastEps)
                return nextAlways;
        }
    }
    const eps = epsilon === "auto" ? getEpsilon(alwaysEnd, neverEnd) : epsilon;
    const result = binarySearch(alwaysEnd, neverEnd, predicate, (low, high) => low / 2 + high / 2, eps, safety);
    return result;
};
const _binarySearchArrayInsertion = (findLast, sortedArray, target, compareFn) => {
    const alwaysEnd = findLast ? 0 : sortedArray.length - 1;
    const neverEnd = findLast ? sortedArray.length - 1 : 0;
    const notFound = findLast ? -1 : sortedArray.length;
    const nextToNeverEnd = findLast ? sortedArray.length - 2 : 1;
    let predicate;
    if (compareFn == null) {
        const isAsc = sortedArray[0] < sortedArray[sortedArray.length - 1];
        if (isAsc === findLast) {
            predicate = (index) => sortedArray[index] <= target;
        }
        else {
            predicate = (index) => sortedArray[index] >= target;
        }
    }
    else {
        if (findLast) {
            predicate = (index) => compareFn(sortedArray[index], target) <= 0;
        }
        else {
            predicate = (index) => compareFn(sortedArray[index], target) >= 0;
        }
    }
    const index = binarySearchInteger(alwaysEnd, neverEnd, predicate, "nocheck");
    if (index === alwaysEnd && !predicate(alwaysEnd))
        return notFound;
    if (index === nextToNeverEnd && predicate(neverEnd))
        return neverEnd;
    return index;
};
const _binarySearchArrayFindIndex = (findLast, sortedArray, target, compareFn) => {
    if (sortedArray.length === 0)
        return -1;
    if (sortedArray.length === 1) {
        if (compareFn == null)
            return sortedArray[0] === target ? 0 : -1;
        return compareFn(sortedArray[0], target) === 0 ? 0 : -1;
    }
    const index = _binarySearchArrayInsertion(findLast, sortedArray, target, compareFn);
    if (index === -1 || index === sortedArray.length)
        return -1;
    if (compareFn == null) {
        if (sortedArray[index] !== target)
            return -1;
    }
    else if (compareFn(sortedArray[index], target) !== 0) {
        return -1;
    }
    return index;
};
export const binarySearchArray = (sortedArray, target, compareFn) => {
    return _binarySearchArrayFindIndex(false, sortedArray, target, compareFn);
};
export const bsFindIndex = binarySearchArray;
export const binarySearchArrayLast = (sortedArray, target, compareFn) => {
    return _binarySearchArrayFindIndex(true, sortedArray, target, compareFn);
};
export const bsFindLastIndex = binarySearchArrayLast;
export const binarySearchArrayInsertionLeft = (sortedArray, target, order) => {
    if (sortedArray.length === 0)
        return 0;
    if (sortedArray.length === 1) {
        if (typeof order === "function") {
            return order(sortedArray[0], target) > 0 ? 1 : 0;
        }
        if (order === "asc") {
            return target > sortedArray[0] ? 1 : 0;
        }
        if (order === "desc") {
            return target < sortedArray[0] ? 1 : 0;
        }
        throw new RangeError("order must be specified for single-element arrays");
    }
    return _binarySearchArrayInsertion(false, sortedArray, target, typeof order === "function" ? order : undefined);
};
export const bsInsertionLeft = binarySearchArrayInsertionLeft;
export const bsLowerBound = binarySearchArrayInsertionLeft;
export const binarySearchArrayInsertionRight = (sortedArray, target, order) => {
    if (sortedArray.length === 0)
        return 0;
    if (sortedArray.length === 1) {
        if (typeof order === "function") {
            return order(sortedArray[0], target) >= 0 ? 1 : 0;
        }
        if (order === "asc") {
            return target >= sortedArray[0] ? 1 : 0;
        }
        if (order === "desc") {
            return target <= sortedArray[0] ? 1 : 0;
        }
        throw new RangeError("order must be specified for single-element arrays");
    }
    return (_binarySearchArrayInsertion(true, sortedArray, target, typeof order === "function" ? order : undefined) + 1);
};
export const bsInsertionRight = binarySearchArrayInsertionRight;
export const bsUpperBound = binarySearchArrayInsertionRight;
export const binarySearchGeneralized = (alwaysEnd, neverEnd, predicate, midpoint, shouldContinue, safety = "check") => {
    if (safety === "check") {
        if (!predicate(alwaysEnd)) {
            throw new RangeError("alwaysEnd must satisfy the condition");
        }
        if (predicate(neverEnd)) {
            throw new RangeError("neverEnd must not satisfy the condition");
        }
    }
    let always = alwaysEnd;
    let never = neverEnd;
    while (shouldContinue(always, never)) {
        const middle = midpoint(always, never);
        if (predicate(middle))
            always = middle;
        else
            never = middle;
    }
    return always;
};
export const getEpsilon = (value1, value2) => {
    const max = Math.max(Math.abs(value1), Math.abs(value2));
    return getUlp(max);
};
const view = new DataView(new ArrayBuffer(8));
export const getUlp = (value) => {
    view.setFloat64(0, value);
    const exponent = ((view.getUint16(0) & 0b0111111111110000) >> 4) - 1023;
    return 2 ** (exponent - 52) || Number.MIN_VALUE;
};
