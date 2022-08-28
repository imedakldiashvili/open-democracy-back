export default {
	PORT: process.env.PORT || 8085,
	
	ACCESS_TOKEN_SECRET_KEY: process.env.JWT_ACCESS_TOKEN_SECRET_KEY || "sectretKeyAccessToken",
	ACCESS_TOKEN_DURATION: '2d',
	
	REFRESH_TOKEN_SECRET_KEY: process.env.JWT_REFRESH_TOKEN_SECRET_KEY || "sectretKeyRefreshToken",
	REFRESH_TOKEN_DURATION: '2d',
	
	DATABASE: {
		POSTGRE: {
			TYPE: 'postgres',
			HOST: process.env.POSTGRES_HOST || "localhost",
			PORT: parseInt(process.env.POSTGRES_PORT) || 5432,
			USERNAME: process.env.POSTGRES_USER || "postgres",
			PASSWORD: process.env.POSTGRES_PASSWORD || "Aa123",
			APP_DB_NAME: process.env.POSTGRES_DB || "open-democracy-db",
		}
	}

}
