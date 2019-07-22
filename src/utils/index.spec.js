import { removeSpaces, camelCaseToWords, toTitleCase, mergeRecursive } from ".";

it('removes spaces between string', () => {
	const string1 = 'How are you today?';
	expect(removeSpaces(string1)).toEqual('Howareyoutoday?');
});

it('converts Camel Case To Words', () => {
	const string1 = 'myName';
	expect(camelCaseToWords(string1)).toEqual('My Name');
});

it('converts to Title Case', () => {
	const string1 = 'can You convert To title';
	expect(toTitleCase(string1)).toEqual('Can You Convert To Title');
});

it('merge the objects recursively', () => {
	const obj = {
		a: {
			b: {
				c: 10
			}
		}
	};
	const obj2 = {
		a: {
			b: {
				c: 20
			}
		}
	};
	const mergedObj = mergeRecursive(obj, obj2);
	expect(mergedObj).toEqual(obj2);

	obj2.a.b.c = 40;

	// Merged obj unchanged
	expect(mergedObj).not.toEqual(obj2);
});
