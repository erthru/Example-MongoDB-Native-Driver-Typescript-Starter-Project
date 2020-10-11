import { PORT } from "../helpers/constant";

export default {
    swaggerDefinition: {
        info: {
            title: "API Docs",
            version: "1.0.0",
            description: "API Documentation Panel",
        },
        tags: [
            {
                name: "user",
                description: "User API",
            },
        ],
        schemes: ["http"],
        host: "localhost:" + PORT,
        basePath: "/",
    },
    apis: ["src/routes/*.ts"],
};

export const custom = {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Docs",
    customfavIcon: "/public/favicon.ico",
};
