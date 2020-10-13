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

    async find(aggregate: Array<any> = [], limit: number = 0, page: number = 1): Promise<Array<T>> {
        if (limit > 0) {
            aggregate.push({
                $skip: limit === 0 ? 0 : (page - 1) * limit,
            });

            aggregate.push({
                $limit: limit,
            });
        }

        return (await this.collection.aggregate(aggregate).toArray()) as Array<T>;
    }

    async findById(_id: ObjectId, aggregate: Array<any> = []): Promise<T> {
        aggregate.push({ $match: { _id: _id } });
        return (await this.collection.aggregate(aggregate).toArray())[0] as T;
    }

    async insert(body: T): Promise<T> {
        body.createdOn = new Date();
        body.updatedOn = new Date();

        return (await this.collection.insertOne(body)).ops[0] as T;
    }

    async findByIdAndUpdate(_id: ObjectId, body: T): Promise<T> {
        body.updatedOn = new Date();
        return (await this.collection.findOneAndUpdate({ _id: _id }, { $set: body }, { returnOriginal: false })).value!! as T;
    }

    async findByIdAndDelete(_id: ObjectId): Promise<T> {
        return (await this.collection.findOneAndDelete({ _id: new ObjectId(_id) })).value!! as T;
    }

    async updateMany(match: any, body: T): Promise<void> {
        await this.collection.updateMany(match, { $set: body });
    }

    async deleteMany(match: any): Promise<void> {
        await this.collection.deleteMany(match);
    }

    async count(aggregate: Array<any> = []): Promise<number> {
        aggregate.push({
            $group: {
                _id: null,
                count: { $sum: 1 },
            },
        });

        return (await this.collection.aggregate(aggregate).toArray())[0]?.count;
    }
}
