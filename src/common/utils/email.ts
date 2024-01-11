import { Resend } from 'resend'

export const sendTestEmail = async (
	to: string,
	from: string,
	subject: string,
	content: string,
) => {
	const resend_api = new Resend(process.env.RESEND_APIKEY)

	const { data, error } = await resend_api.emails.send({
		from,
		to: [to],
		subject,
		html: content,
	})

	if (error) {
		return console.log({ error })
	}

	console.log({ data })
}
