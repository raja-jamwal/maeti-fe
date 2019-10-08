export function extractSearchResult(response: any) {
	return {
		items: !response.items ? [] : response.items,
		total: response.total
	};
}
