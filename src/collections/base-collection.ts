import { Collection, Db, ObjectId } from "mongodb";
import { client } from "../configs/db";

export interface IBase {
    _id?: ObjectId;
    createdOn?: Date;
    updatedOn?: Date;
}

export interface IIndex {
    field: string;
    isUnique?: boolean;
}

export enum BaseDocument {
    collectionName = "",
    _id = "_id",
    createdOn = "createdOn",
    updatedOn = "updatedOn",
}

interface List<T> {
    rows: Array<T>;
    total: number;
}

interface Result<T> {
    row: T;
}

export default class BaseCollection<T extends IBase> {
    private name: string = BaseDocument.collectionName;
    private indexes!: Array<IIndex>;
    private validator!: any;
    private db!: Db;
    private collection!: Collection;

    constructor(name: string, indexes: Array<IIndex> = [], validator: any = {}) {
        this.name = name;
        this.indexes = indexes;
        this.validator = validator;

        const interval = setInterval(() => {
            if (typeof client !== "undefined") {
                this.db = client.db();
                this.collection = this.db.collection(this.name);

                this.registerIndexes();
                this.validate();

                clearInterval(interval);
            }
        }, 250);
    }

    private async registerIndexes() {
        if (this.indexes.length > 0) {
            for (let i = 0; i < this.indexes.length; i++) {
                await this.collection.createIndex({ [this.indexes[i].field]: 1 }, { unique: this.indexes[i].isUnique });
            }
        }
    }

    private async validate() {
        if (Object.keys(this.validator).length > 0) {
            await this.db.command({
                collMod: this.name,
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: Object.keys(this.validator),
                        properties: this.validator,
                    },
                },
                validationLevel: "moderate",
            });
        }
    }

    async find(aggregate: Array<any> = [], limit: number = 1, page: number = 1): Promise<List<T>> {
        aggregate.push({
            $facet: {
                rows: [],
                metadata: [{ $group: { _id: null, count: { $sum: 1 } } }],
            },
        });

        if (limit > 0) {
            aggregate[aggregate.length - 1].$facet.rows.push(
                {
                    $skip: limit === 0 ? 0 : (page - 1) * limit,
                },
                {
                    $limit: limit,
                }
            );
        }

        const query: any = (await this.collection.aggregate(aggregate).toArray())[0];

        return {
            rows: [...(query.rows as Array<T>)],
            total: query.metadata[0]?.count as number,
        };
    }

    async findById(_id: ObjectId, aggregate: Array<any> = []): Promise<Result<T>> {
        aggregate.push({ $match: { _id: _id } });

        return {
            row: (await this.collection.aggregate(aggregate).toArray())[0] as T,
        };
    }

    async insert(body: T): Promise<Result<T>> {
        body.createdOn = new Date();
        body.updatedOn = new Date();

        return {
            row: (await this.collection.insertOne(body)).ops[0] as T,
        };
    }

    async findByIdAndUpdate(_id: ObjectId, body: T): Promise<Result<T>> {
        body.updatedOn = new Date();

        return {
            row: (await this.collection.findOneAndUpdate({ _id: _id }, { $set: body }, { returnOriginal: false })).value!! as T,
        };
    }

    async findByIdAndDelete(_id: ObjectId): Promise<Result<T>> {
        return {
            row: (await this.collection.findOneAndDelete({ _id: new ObjectId(_id) })).value!! as T,
        };
    }

    async updateMany(match: T, body: T): Promise<void> {
        await this.collection.updateMany(match, { $set: body });
    }

    async deleteMany(match: T): Promise<void> {
        await this.collection.deleteMany(match);
    }
}
