import * as express from 'express'
import  * as bodyParser from 'body-parser'
import * as cors from 'cors'

import * as swaggerUi from "swagger-ui-express";

import router from './routers'
import appSettings from '../settings'
import { appDataSource } from './datasources'

const PORT = appSettings.PORT 
const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: "/swagger.json",
      },
    })
  );

// app.use('/api/', (req, res, next) => {  console.log("check token ") } )

app.use('/api/', router )
app.all('*', (req, res) => { console.log(`Requested Url ${req.path} not found !!!`)})


appDataSource.initialize()
.then(async () => { app.listen(PORT, () => console.log('app is runnging at port ', PORT));})
.catch(error => console.log("Error Connection: " + error))