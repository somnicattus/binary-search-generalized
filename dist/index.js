export const binarySearch = (alwaysEnd, neverEnd, check, midpoint, epsilon, safety = "check") => {
    if (safety === "check") {
        if (!check(alwaysEnd)) {
            throw new RangeError("alwaysEnd must satisfy the condition");
        }
        if (check(neverEnd)) {
            throw new RangeError("neverEnd must not satisfy the condition");
        }
    }
    const alwaysEndIsLower = alwaysEnd < neverEnd;
    let low = alwaysEndIsLower ? alwaysEnd : neverEnd;
    let high = alwaysEndIsLower ? neverEnd : alwaysEnd;
    while (high - low > epsilon) {
        const middle = midpoint(low, high);
        if (check(middle) === alwaysEndIsLower)
            low = middle;
        else
            high = middle;
    }
    return alwaysEndIsLower ? low : high;
};
export const binarySearchInteger = (alwaysEnd, neverEnd, check, safety = "check") => {
    if (safety === "check") {
        if (Number.isSafeInteger(alwaysEnd) === false ||
            Number.isSafeInteger(neverEnd) === false) {
            throw new RangeError("alwaysEnd and neverEnd must be safe integers");
        }
    }
    return binarySearch(alwaysEnd, neverEnd, check, (low, high) => Math.floor((low + high) / 2), 1, safety);
};
export const binarySearchBigint = (alwaysEnd, neverEnd, check, safety = "check") => {
    return binarySearch(alwaysEnd, neverEnd, check, (low, high) => (low + high) / 2n, 1n, safety);
};
export const binarySearchDouble = (alwaysEnd, neverEnd, check, epsilon, safety = "check") => {
    if (safety === "check") {
        if (Number.isFinite(alwaysEnd) === false ||
            Number.isFinite(neverEnd) === false) {
            throw new RangeError("alwaysEnd and neverEnd must be finite numbers");
        }
        if (epsilon <= 0) {
            throw new RangeError("epsilon must be positive");
        }
        if (Math.abs(alwaysEnd - neverEnd) < epsilon) {
            throw new RangeError("alwaysEnd and neverEnd must be different within the epsilon range");
        }
        if (alwaysEnd + epsilon === alwaysEnd ||
            alwaysEnd - epsilon === alwaysEnd ||
            neverEnd + epsilon === neverEnd ||
            neverEnd - epsilon === neverEnd) {
            throw new RangeError("epsilon must be representable at the precision of alwaysEnd and neverEnd");
        }
    }
    return binarySearch(alwaysEnd, neverEnd, check, (low, high) => (low + high) / 2, epsilon, safety);
};
const _binarySearchArrayInsertion = (findLast, sortedArray, target, compareFn) => {
    const alwaysEnd = findLast ? 0 : sortedArray.length - 1;
    const neverEnd = findLast ? sortedArray.length - 1 : 0;
    const notFound = findLast ? -1 : sortedArray.length;
    const nextToNeverEnd = findLast ? sortedArray.length - 2 : 1;
    let check;
    if (compareFn == null) {
        const isAsc = sortedArray[0] < sortedArray[sortedArray.length - 1];
        if (isAsc === findLast) {
            check = (index) => sortedArray[index] <= target;
        }
        else {
            check = (index) => sortedArray[index] >= target;
        }
    }
    else {
        if (findLast) {
            check = (index) => compareFn(sortedArray[index], target) <= 0;
        }
        else {
            check = (index) => compareFn(sortedArray[index], target) >= 0;
        }
    }
    const index = binarySearchInteger(alwaysEnd, neverEnd, check, "nocheck");
    if (index === alwaysEnd && !check(alwaysEnd))
        return notFound;
    if (index === nextToNeverEnd && check(neverEnd))
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
export const binarySearchArrayLast = (sortedArray, target, compareFn) => {
    return _binarySearchArrayFindIndex(true, sortedArray, target, compareFn);
};
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
export const binarySearchGeneralized = (alwaysEnd, neverEnd, check, midpoint, shouldContinue, safety = "check") => {
    if (safety === "check") {
        if (!check(alwaysEnd)) {
            throw new RangeError("alwaysEnd must satisfy the condition");
        }
        if (check(neverEnd)) {
            throw new RangeError("neverEnd must not satisfy the condition");
        }
    }
    let always = alwaysEnd;
    let never = neverEnd;
    while (shouldContinue(always, never)) {
        const middle = midpoint(always, never);
        if (check(middle))
            always = middle;
        else
            never = middle;
    }
    return always;
};
