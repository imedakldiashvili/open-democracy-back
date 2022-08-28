import { DataSource, DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import appSettings from '../app-settings'


const dataSource : DataSourceOptions = {
    type: "postgres",
    host: appSettings.DATABASE.POSTGRE.HOST,
    port: appSettings.DATABASE.POSTGRE.PORT,
    username: appSettings.DATABASE.POSTGRE.USERNAME,
    password: appSettings.DATABASE.POSTGRE.PASSWORD,
    database: appSettings.DATABASE.POSTGRE.APP_DB_NAME,
    synchronize: false,
    entities: ["src/modules/**/entities/**/*.ts"],
    migrations: [],
    subscribers: [],
    logging: false,
    namingStrategy: new SnakeNamingStrategy()
}

export const appDataSource = new DataSource(dataSource)
