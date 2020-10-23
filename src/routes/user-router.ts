import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import UserCollection, { UserDocument } from "../collections/user-collection";
import faker from "faker";
import { created, error, ok } from "../helpers/json";
import { filter, paginate, search, sort } from "../helpers/aggregate";

const router: Router = Router();
const userCollection = new UserCollection();

router.get("/users", async (req: Request, res: Response) => {
    try {
        const aggregate: Array<any> = [
            ...search(req.query, [UserDocument.firstName, UserDocument.lastName, UserDocument.email]),
            ...filter(req.query),
            ...sort(req.query),
            ...paginate(req.query),
        ];

        const users = await userCollection.find(aggregate);
        const usersTotal = await userCollection.count();

        ok(res, { users: users, total: usersTotal });
    } catch (e: any) {
        error(res, e);
    }
});

router.get("/user/:id", async (req: Request, res: Response) => {
    try {
        const user = await userCollection.findById(new ObjectId(req.params.id));
        ok(res, { user: user });
    } catch (e: any) {
        error(res, e);
    }
});

router.post("/users", async (req: Request, res: Response) => {
    try {
        for (let i = 0; i < 50; i++) {
            await userCollection.insert({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: i + "dummy@mail.com",
                address: faker.address.streetAddress(),
            });
        }

        created(res, { seeder: "completed" });
    } catch (e: any) {
        error(res, e);
    }
});

router.post("/user", async (req: Request, res: Response) => {
    try {
        const user = await userCollection.insert({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
        });

        created(res, { user: user });
    } catch (e: any) {
        error(res, e);
    }
});

router.put("/user/:id", async (req: Request, res: Response) => {
    try {
        const user = await userCollection.findByIdAndUpdate(new ObjectId(req.params.id), {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
        });

        ok(res, { user: user });
    } catch (e: any) {
        error(res, e);
    }
});

router.delete("/user/:id", async (req: Request, res: Response) => {
    try {
        const user = await userCollection.findByIdAndDelete(new ObjectId(req.params.id));
        ok(res, { user: user });
    } catch (e: any) {
        error(res, e);
    }
});

export default router;
