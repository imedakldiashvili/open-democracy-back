import  security  from '../../security'

export default {
	PORT: process.env.PORT || 8085,
	
	ACCESS_TOKEN_SECRET_KEY: security.ACCESS_TOKEN_SECRET_KEY,
	ACCESS_TOKEN_DURATION: '2d',
	
	REFRESH_TOKEN_SECRET_KEY: security.REFRESH_TOKEN_SECRET_KEY,
	REFRESH_TOKEN_DURATION: '2d',
	
	DATABASE: {
		POSTGRE: {
			TYPE: 'postgres',
			HOST: process.env.POSTGRES_HOST || "localhost",
			PORT: parseInt(process.env.POSTGRES_PORT) || 5432,
			USERNAME: process.env.POSTGRES_USER || "postgres",
			PASSWORD: security.DB_PASSWORD,
			APP_DB_NAME: process.env.POSTGRES_DB || "open-democracy-db",
		}
	}

}
