import { encodeProfileId, decodeProfileId } from './profile-id-encoder';

describe('encodeProfileId', () => {
	it('should encode profile id 1', () => {
		const profileId = 1;
		const enc = encodeProfileId(profileId);
		expect(enc).toBe('B');

		const dec = decodeProfileId(enc);
		expect(dec).toBe(profileId);
	});

	it('should encode profile id 26', () => {
		const profileId = 26;
		const enc = encodeProfileId(profileId);
		expect(enc).toBe('AB');

		const dec = decodeProfileId(enc);
		expect(dec).toBe(profileId);
	});

	it('should encode profile id 300', () => {
		const profileId = 300;
		const enc = encodeProfileId(profileId);
		expect(enc).toBe('OL');

		const dec = decodeProfileId(enc);
		expect(dec).toBe(profileId);
	});

	it('should encode profile id 546', () => {
		const profileId = 546;
		const enc = encodeProfileId(profileId);
		expect(enc).toBe('AV');

		const dec = decodeProfileId(enc);
		expect(dec).toBe(profileId);
	});
});
