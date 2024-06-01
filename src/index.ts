import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import * as swaggerUi from "swagger-ui-express";

import router from './routers'
import appSettings from './settings'
import { appDataSource } from './datasources'
import { AppError, appErrorHandler } from './middlewares/error';
import { validateToken } from './middlewares/security';
import { cronJobsStart } from './jobs';

const PORT = appSettings.PORT 
const app = express()

app.use(bodyParser.json())
app.use(cors())

cronJobsStart();

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: "/swagger.json",
      },
    })
  );
  
  const authUrl = "/api/auth"
  const publicUrl = "/api/public"

  
  app.use('/api/', (req, res, next) => { 
    if ((req.originalUrl.toLocaleLowerCase().substring(0, publicUrl.length) === publicUrl) ||
        (req.originalUrl.toLocaleLowerCase().substring(0, authUrl.length) === authUrl))  
    {     
      next()
    } else {
      validateToken(req, res, next) 
    }
  })

app.use('/api/', router )
app.all('*', (req, res) => { throw AppError.notFound(`Requested Url ${req.path} not found !!!`)})

app.use(appErrorHandler);

appDataSource.initialize()
.then(async () => { app.listen(PORT, () => console.log('app is runnging at port ', PORT));})
.catch(error => console.log("Error Connection: " + error))
