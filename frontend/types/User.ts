export interface Iuser {
	avatar: string,
	nickname: string,
	status: string,
	id: number,
	accessToken: string,
	twoFA: boolean
}

export class User implements Iuser {
	avatar = '';
	nickname = '';
	status = ''
	id = 0;
	accessToken = '';
	twoFA = false
}
