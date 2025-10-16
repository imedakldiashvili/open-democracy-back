import  key  from '../../keys'

export default {
	PORT: process.env.PORT || 8085,
	
	ACCESS_TOKEN_SECRET_KEY: key.ACCESS_TOKEN_SECRET_KEY,
	ACCESS_TOKEN_DURATION: '2d',
	
	REFRESH_TOKEN_SECRET_KEY: key.REFRESH_TOKEN_SECRET_KEY,
	REFRESH_TOKEN_DURATION: '2d',

	EMAIL_USER: key.EMAIL_USER,
	EMAIL_PASS: key.EMAIL_PASS,


	SENDGRID_API_KEY:  key.SENDGRID_API_KEY,
	SENDGRID_FROM_EMAIL: 'imeda.kldiashvili@gmail.com',

	SMS_SENDER: "MoneyMarket",
	SMS_OFFICE_KEY: "SMS_OFFICE_KEY",

	OTP_CODE: '1111',
	
	DATABASE: {
		POSTGRE: {
			TYPE: 'postgres',
			HOST: key.DB_HOST || "localhost",
			PORT: key.DB_PORT || 5432,
			USERNAME: key.DB_USERNAME || "postgres",
			PASSWORD: key.DB_PASSWORD,
			DB_NAME: key.DB_NAME || "open-democracy-db",
		}
	},

	BANKS: {
		BOG_USER: key.BOG_USER || '4efbdf7f-dc94-4c3c-88b7-c2d1bfee36cc',
		BOG_PASSWORD: key.BOG_PASSWORD || '5c3c2711-cf48-4a92-bd22-b3f501375d8d',
	}

}
