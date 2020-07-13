export async function fetchPt(url) {
	const res = await fetch(url, { redirect: 'follow' });
	const buffer = await res.arrayBuffer();
	const decoder = new TextDecoder('gbk');
	return decoder.decode(buffer);
}