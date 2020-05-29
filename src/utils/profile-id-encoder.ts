import { range } from 'lodash';

const chars = range(65, 91).map(code => String.fromCharCode(code));
const base = 26;

export function encodeProfileId(id: number): string {
	const pos = [];
	let qou = id;
	let remainder = 0;
	while (qou > 0) {
		const q = Math.floor(qou / base);
		const r = qou % base;
		pos.push(r);
		qou = q;
		remainder = r;
	}
	const t = pos.map(p => chars[p]).join('');
	return t;
}

export function decodeProfileId(id: string): number {
	const po = id.split('').map(p => {
		const pos = chars.findIndex(a => a === p);
		return pos;
	});
	return po.reduce((acc, p, index) => {
		return acc + p * Math.pow(base, index);
	}, 0);
}
