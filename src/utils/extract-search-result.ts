export function extractSearchResult(response: any) {
	const result = {
		items: [],
		total: 0
	};

	if (!response.hits) return result;

	result.items = response.hits.hits.map((h: any) => h._source);
	result.total = response.hits.total;

	return result;
}
