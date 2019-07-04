import { Pageable } from '../store/reducers/account-defination';

export function extractPageableResponse<T>(response: any) {
	const items = response.content as Array<T>;
	const page = {} as Pageable;
	page.last = response.last;
	page.totalPages = response.totalPages;
	page.totalElements = response.totalElements;
	page.number = response.number;
	return { items, page };
}
