import  key  from '../../keys'

export default {
	PORT: process.env.PORT || 8085,
	
	ACCESS_TOKEN_SECRET_KEY: key.ACCESS_TOKEN_SECRET_KEY,
	ACCESS_TOKEN_DURATION: '2d',
	
	REFRESH_TOKEN_SECRET_KEY: key.REFRESH_TOKEN_SECRET_KEY,
	REFRESH_TOKEN_DURATION: '2d',

	SENDGRID_API_KEY:  key.SENDGRID_API_KEY,
	SENDGRID_FROM_EMAIL: 'imeda.kldiashvili@gmail.com',

	OTP_CODE: '1111',
	
	DATABASE: {
		POSTGRE: {
			TYPE: 'postgres',
			HOST: process.env.POSTGRES_HOST || "localhost",
			PORT: parseInt(process.env.POSTGRES_PORT) || 5432,
			USERNAME: key.DB_USERNAME || "postgres",
			PASSWORD: key.DB_PASSWORD,
			APP_DB_NAME: process.env.POSTGRES_DB || "open-democracy-db",
		}
	},

	BANKS: {
		BOG_ACCOUNT: process.env.BOG_ACCOUNT || 'GE67BG0000000161311283',
		BOG_USER: process.env.BOG_USER || '4efbdf7f-dc94-4c3c-88b7-c2d1bfee36cc',
		BOG_PASSWORD: process.env.BOG_PASSWORD || '5c3c2711-cf48-4a92-bd22-b3f501375d8d'
	}

}
