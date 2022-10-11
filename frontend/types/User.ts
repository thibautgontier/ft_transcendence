export interface Iuser {
	avatar: string,
	nickname: string,
	id: number,
	accessToken: string,
}

export class User implements Iuser {
	avatar = '';
	nickname = '';
	id = 0;
	accessToken = '';
}
