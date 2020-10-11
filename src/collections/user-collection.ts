import BaseCollection, { IBase, IIndex } from "./base-collection";

export interface IUser extends IBase {
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
}

export enum UserDocument {
    collectionName = "users",
    firstName = "firstName",
    lastName = "lastName",
    email = "email",
    address = "address",
}

const indexes: Array<IIndex> = [
    {
        field: UserDocument.email,
        isUnique: true,
    },
];

const validator = {
    [UserDocument.firstName]: {
        bsonType: "string",
        description: "must be a string and is required",
    },

    [UserDocument.email]: {
        bsonType: "string",
        pattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$",
        description: "must match the email pattern and is required",
    },

    [UserDocument.address]: {
        bsonType: "string",
        description: "must be a string and is required",
    },
};

export default class UserCollection extends BaseCollection<IUser> {
    constructor() {
        super(UserDocument.collectionName, indexes, validator);
    }
}
