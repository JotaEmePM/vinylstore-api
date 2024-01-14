export const config = {
	app: {
		name: 'Acordes y Surcos',
	},
	email: {
		info_from: 'info@jotaemepm.dev',
		url_email_verification: 'https://store.jotaemepm.dev/confirm=',
		url_email_unsub: 'https://store.jotaemepm.dev/unsub=',
	},
	database: {
		url: process.env.MONGO_URL,
	},
}
