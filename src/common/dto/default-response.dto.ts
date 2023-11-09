export default class DefaultResponseDTO {
	HttpCode: number
	IsError: boolean
	Message: string | undefined
	Value: any | undefined
	Location: string | undefined
}
