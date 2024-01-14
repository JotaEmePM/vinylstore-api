export default class UsersConstants {
	userRoles = Object.freeze({
		USER_ROLE: 'user',
		ADMIN_ROLE: 'admin',
	})

	SuccessMessages = Object.freeze({
		FN_CREATE_OK: 'Usuario creado correctamente',
		FN_FINDALL_OK: 'Listado de usuarios',
		FN_FINDONE_OK: 'Ver usuario',
		FN_FINDBYEMAIL_OK: 'Ver usuario',
		FN_FINDBYUSERNAME_OK: 'Ver usuario',
		FN_DELETE_OK: 'Usuario deshabilitado',
		FN_CHANGEEMAIL_OK: 'Email cambiado correctamente',
		FN_CONFIRMEMAIL_OK: 'Email confirmado',
		FN_ADDROLE_OK: 'Rol asignado a usuario',
	})

	ErrorMessages = Object.freeze({
		FN_FINDALL_ERROR: 'Error al obtener datos',
		FN_FINDONE_ERROR: 'Error al obtener datos',
		FN_FINDBYEMAIL_ERROR: 'Error al obtener datos',
		FN_FINDONE_USERNOTEXIST: 'Usuario no existe',
		FN_FINDBYUSERNAME_USERNOTEXIST: 'Usuario no existe',
		FN_FINDBYUSERNAME_ERROR: 'Problemas al obtener datos',
		FN_CHANGEEMAILL_USERNOTEXIST: 'Usuario no existe',
		FN_CHANGEEMAILL_EMAILEXIST: 'Email ya ingresado',
		FN_CHANGEEMAILL_PREVIOUSEMAILPROBLEM:
			'Problemas al obtener el ultimo email del usuario',
		FN_DELETE_ERROR: 'Error al deshabilitar usuario',
		FN_CREATE_ERROR: 'Error al crear usuario',
		FN_CREATE_VALIDATIONERROR: 'Name, email and password are required',
		FN_CREATE_EMAILEXIST: 'Email already in use',
		FN_CREATE_USERNAMEEXIST: 'Username already in use',
		FN_FINDBYEMAIL_USERNOTEXIST: 'Usuario no existe',
		FN_CONFIRMEMAIL_USERNOTEXIST: 'Usuario no existe',
		FN_CONFIRMEMAIL_EMAILNOTEXIST: 'Email del usuario no existe',
		FN_CONFIRMEMAIL_ERROR: 'Error al cambiar email',
		FN_ADDROLE_USERNOTEXIST: 'Usuario no existe',
		FN_ADDROLE_USERROLEPRESENT: 'Usuario ya tiene el rol asignado',
		FN_ADDROLE_ERROR: 'Eror al asignar rol a usuario',
	})

	functions = Object.freeze({
		FN_CREATE: '[FN]UsersService.create',
		FN_FINDALL: '[FN]UsersService.findAll',
		FN_DELETE: '[FN]UsersService.delete',
		FN_FINDONE: '[FN]UsersService.findOne',
		FN_FINDBYEMAIL: '[FN]UsersService.findByEmail',
		FN_FINDBYUSERNAME: '[FN]UsersService.findByUserName',
		FN_CHANGEEMAIL: '[FN]UsersService.changeEmail',
		FN_CONFIRMEMAIL: '[FN]UsersService.confirmEmail',
		FN_ADDROLE: '[FN]UsersService.addRole',
	})
}
