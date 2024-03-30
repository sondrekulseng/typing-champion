export default class TextData {
	id: string;
	title: string;
	content: string;

	public constructor(id: string, title: string, content: string) {
		this.id = id;
		this.title = title;
		this.content = content;
	}
}