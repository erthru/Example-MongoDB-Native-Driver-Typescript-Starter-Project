export const splice = (str: string, start: number, delCount: number, newSubStr: string): string => {
    return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));
};

export const isEmpty = (obj: any): boolean => {
    return obj === undefined || obj === null || Object.keys(obj).length === 0 || obj.length === 0;
};

export const queryToObject = (query: string): any => {
    try {
        let queryArr = query.split(",");
        let queryFix = "";

        queryArr.map((query) => {
            let queryX = '"' + query;
            let idx = 0;

            for (let i = 0; i < queryX.length; i++) {
                if (queryX[i] === ":") {
                    idx = i;
                    break;
                }
            }

            queryX = splice(queryX, idx, 0, '"');
            queryFix += queryX + ",";
        });

        queryFix = queryFix.slice(0, -1);
        queryFix = "{" + queryFix + "}";

        return JSON.parse(queryFix);
    } catch (err) {
        return JSON.parse("{}");
    }
};
