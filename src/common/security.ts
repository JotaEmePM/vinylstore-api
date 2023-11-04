import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

export function generateUUID(): string {
	return uuidv4()
}

export function hashPassword(password: string): {
	salt: string
	hashedPassword: string
} {
	const salt = crypto.randomBytes(16).toString('hex')
	const hashedPassword = crypto
		.pbkdf2Sync(password, salt, 1000, 64, `sha512`)
		.toString(`hex`)
	return {
		salt,
		hashedPassword,
	}
}

export function verifyPassword(
	password: string,
	hash: string,
	salt: string,
): boolean {
	const hashedPassword = crypto
		.pbkdf2Sync(password, salt, 1000, 64, `sha512`)
		.toString(`hex`)
	return hashedPassword === hash
}
