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
		// TODO: registrar error en log.
		return error.message
	}

	// TODO: Registrar id envío en log.
	console.log({ data })
	return data.id
}
