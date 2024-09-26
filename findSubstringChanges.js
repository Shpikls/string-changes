function replaceSubstring(originalString, startIndex, endIndex, newSubstring) {
    const start = originalString.slice(0, startIndex);
    const end = originalString.slice(endIndex + 1);

    return start + newSubstring + end;
}

function findLastDiscrepancy(original, modified) {
    const maxLength = Math.max(original.length, modified.length);

    for (let i = 0; i < maxLength; i++) {
        const originalChar = original[original.length - 1 - i];
        const modifiedChar = modified[modified.length - 1 - i];

        if (originalChar !== modifiedChar) {
            // Возвращаем позицию расхождения относительно конца строки
            // Если строки одной длины, то возвращаем i.
            // Если длины разные, то находим позицию в длинной строке.
            return {
                position: original.length - 1 - i, // Индекс в оригинальной строке
                originalChar,
                modifiedChar
            };
        }
    }

    return null; // Если строка идентична с конца
}

function findSubstringChanges(original, modified) {
    let originalPtr = 0;
    let modifiedPtr = 0;

    while (originalPtr < original.length || modifiedPtr < modified.length) {
        if (original[originalPtr] !== modified[modifiedPtr]) {
            const originalSubstring = original.substring(originalPtr);
            const modifiedSubstring = modified.substring(modifiedPtr);

            // Исходная подстрока встречается в измененной, значит это вставка
            if (~modifiedSubstring.lastIndexOf(originalSubstring)) {
                return {
                    type: 'insert',
                    index: originalPtr,
                    payload: modified.substring(modifiedPtr)
                };
            }

            // Измененная подстрока встречается в оригинальной, значит это удаление
            if (~originalSubstring.lastIndexOf(modifiedSubstring)) {
                return {
                    type: 'delete',
                    start: originalPtr,
                    end: original.length
                };
            }

            const lastDiscrepancy = findLastDiscrepancy(original, modified);
            // Замена части строки на новую
            return {
                type: 'replace',
                start: originalPtr,
                end: lastDiscrepancy.position,
                payload: modified.substring(modifiedPtr, lastDiscrepancy.position - 1)
            };
        }

        originalPtr++;
        modifiedPtr++;
    }

    // Если мы дошли до конца, значит строки идентичны
    return { type: 'not_modified' };
}

// const originalStr = "Hello, world!";
// const modifiedStr = "Hello, old!";

//  1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17   18   19   20   21   22   23
// 'H', 'e', 'l', 'l', 'o', ',', ' ', 'w', 'o', 'n', 'd', 'e', 'r', 'f', 'u', 'l', ' ', 'w', 'o', 'r', 'l', 'd', '!'

//  1    2    3    4    5    6    7    8    9    10   11   12   13
// 'H', 'e', 'l', 'l', 'o', ',', ' ', 'w', 'o', 'r', 'l', 'd', '!'

// Пример использования:
const originalStr = "Hello, world!";
// const originalStr = "Hello, world!";
// const modifiedStr = "Hello, old!";
// const originalStr = "";
// const modifiedStr = "1";
// const modifiedStr = "Alex world!";
const modifiedStr = "Hello, wonderful world!";
// const originalStr = "Hello, wonderful world!";
// const originalStr = "Hello, world! Hello, world! Hello, world!";
// const modifiedStr = "Hello, world! Hello, world!";
//
const operation = findSubstringChanges(originalStr, modifiedStr);
console.log(operation);
// console.log(replaceSubstring(originalStr, operation.start, operation.end, operation.payload));