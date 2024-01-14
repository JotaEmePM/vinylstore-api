import { Resend } from 'resend'

export const sendEmail = async (
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
		return error.message
	}
	return data.id
}
