const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Food Delivery API',
            version: '1.0.0',
            description: 'API documentation for the Food Delivery app',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3002}`,
            },
        ],
    },
    apis: ['../routes/*.js'], // Adjust this path to include your routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
