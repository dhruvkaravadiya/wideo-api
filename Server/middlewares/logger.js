const winston = require('winston');
const { createLogger , transports } = require('winston');
const { MongoDB }=require('winston-mongodb');
const pass = process.env.Dhruv_CLUSTER_PASSWORD;
const logger = createLogger(
    {
        format: winston.format.json(),
        transports:[
            new winston.transports.Console(),
            new winston.transports.File({filename:'logfile.log'}),
        ],
        exceptionHandlers:[],
        rejectionHandlers:[]
    }
);