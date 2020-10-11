import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import UserCollection from "../collections/user-collection";
import faker from "faker";

const router: Router = Router();
const userCollection = new UserCollection();

/**
 * @swagger
 * /users:
 *  get:
 *      description: Get All Users
 *      tags:
 *          - user
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: ok
 */

router.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await userCollection.find();
        res.status(200).json(users);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @swagger
 * /user/{id}:
 *  get:
 *      description: Get Single Users
 *      tags:
 *          - user
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            description: id of user to get
 *            in: path
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: ok
 */

router.get("/user/:id", async (req: Request, res: Response) => {
    try {
        const user = await userCollection.findById(new ObjectId(req.params.id));
        res.status(200).json(user);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
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

        res.status(201).json({ seeder: "ok" });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @swagger
 * /user:
 *  post:
 *      description: Add Single Users
 *      tags:
 *          - user
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: user
 *            in: body
 *            description: user body to add
 *            schema:
 *              type: object
 *              required:
 *                  - firstName
 *                  - email
 *                  - address
 *              properties:
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  email:
 *                      type: string
 *                  address:
 *                      type: string
 *      responses:
 *          201:
 *              description: created
 */

router.post("/user", async (req: Request, res: Response) => {
    try {
        const user = await userCollection.insert({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
        });

        res.status(201).json(user);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @swagger
 * /user/{id}:
 *  put:
 *      description: Update Single Users
 *      tags:
 *          - user
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            in: path
 *            description: user id to update
 *          - name: user
 *            in: body
 *            description: user body to add
 *            required: true
 *            type: string
 *            schema:
 *              type: object
 *              required:
 *                  - firstName
 *                  - email
 *                  - address
 *              properties:
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  email:
 *                      type: string
 *                  address:
 *                      type: string
 *      responses:
 *          200:
 *              description: ok
 */

router.put("/user/:id", async (req: Request, res: Response) => {
    try {
        const user = await userCollection.findByIdAndUpdate(new ObjectId(req.params.id), {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
        });

        res.status(200).json(user);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @swagger
 * /user/{id}:
 *  delete:
 *      description: Delete Single Users
 *      tags:
 *          - user
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            in: path
 *            description: user id to delete
 *      responses:
 *          200:
 *              description: ok
 */

router.delete("/user/:id", async (req: Request, res: Response) => {
    try {
        const user = await userCollection.findByIdAndDelete(new ObjectId(req.params.id));
        res.status(200).json(user);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
