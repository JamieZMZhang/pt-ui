export async function fetchPt(url) {
	const res = await fetch(url);
	const decoder = new TextDecoder('gbk');
	return decoder.decode(await res.arrayBuffer());
}