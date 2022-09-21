export interface Iuser {
	avatar: string,
	nickname: string,
	id: number,
	success: number,
	menu: boolean,
}

export class User implements Iuser {
	avatar = '';
	nickname = '';
	id = 0;
	success = 0;
	menu = false;
}
