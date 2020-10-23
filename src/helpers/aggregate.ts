import { isEmpty, queryToObject } from "./basic-tools";

export const search = (query: any, fields: Array<string>): Array<any> => {
    const aggregate: Array<any> = [];

    if (!isEmpty(query.search)) {
        aggregate.push({
            $match: { $or: [] },
        });

        fields.map((field) => {
            aggregate[0].$match.$or.push({
                [field]: {
                    $regex: query.search,
                    $options: "i",
                },
            });
        });
    }

    return aggregate;
};

export const filter = (query: any): Array<any> => {
    const aggregate: Array<any> = [];

    if (!isEmpty(query.filter)) {
        aggregate.push({
            $match: queryToObject(query.filter),
        });
    }

    return aggregate;
};

export const sort = (query: any): Array<any> => {
    const aggregate: Array<any> = [];
    const sort = queryToObject(query.sort);

    if (!isEmpty(sort)) {
        aggregate.push({
            $sort: sort,
        });
    }

    return aggregate;
};

export const paginate = (query: any): Array<any> => {
    const aggregate: Array<any> = [];

    const page: number = isEmpty(query.page) ? 1 : parseInt(query.page);
    const limit: number = isEmpty(query.limit) ? 10 : parseInt(query.limit);
    const skip: number = (page - 1) * limit;

    aggregate.push({
        $skip: skip,
    });

    aggregate.push({
        $limit: limit,
    });

    return aggregate;
};
