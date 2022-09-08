export interface Iuser {
	photo: string,
	id: number,
	success: number,
}

export class User implements Iuser {
	photo = '';
	id = 0;
	success = 0;
}
