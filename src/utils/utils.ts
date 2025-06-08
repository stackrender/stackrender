const areArraysEqual = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return false;

    const sortedA = [...a].sort();
    const sortedB = [...b].sort();

    return sortedA.every((val, index) => val === sortedB[index]);
};


function getTimestamp() {
    const date = new Date();

    // Get ISO string and split date and time
    const [datePart, timePart] = date.toISOString().split('T');

    // Extract milliseconds
    const [time, msZ] = timePart.split('.');
    const milliseconds = msZ.slice(0, -1); // remove 'Z'

    // Add 3 random digits to simulate microseconds (since JS only gives ms)
    const microseconds = milliseconds.padEnd(3, '0') + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `${datePart} ${time}.${microseconds}Z`;
}


type NestedObject = { [key: string]: any };

function excludeFields(
    obj: NestedObject,
    exclusions: { [key: string]: string[] }
): NestedObject {
    const newObj: NestedObject = {};
    for (const [key, value] of Object.entries(obj)) {
        if (exclusions["root"]?.includes(key)) {
            // Skip top-level fields listed in 'root'
            continue;
        }
        if (typeof value === "object" && !Array.isArray(value) && value !== null) {
            // Recursively exclude fields in nested objects
            newObj[key] = exclusions[key]
                ? Object.fromEntries(
                    Object.entries(value).filter(([k]) => !exclusions[key].includes(k))
                )
                : excludeFields(value, exclusions);
        } else {
            newObj[key] = value;
        }
    }
    return newObj;
}




function groupBy(array: any[], key: string) {
    return array.reduce((acc, item) => {
        const groupKey = item[key];
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {});
}



export {
    areArraysEqual,
    getTimestamp,
    excludeFields,
    groupBy
}