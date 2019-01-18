module.exports =
    (arr) => arr
        .reduce((accumulator, currentValue) =>
            accumulator.concat(currentValue));
