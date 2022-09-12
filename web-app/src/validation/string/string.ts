/********
 * Validate user input
 * 
 * Using lookahead (zero-length assertions) to prevent backtracking in regex engine
 * 
 * https://www.regular-expressions.info/lookaround.html
 * 
 * https://instanceof.me/post/52245507631/regex-emulate-atomic-grouping-with-lookahead
 * 
 * https://blog.stevenlevithan.com/archives/mimic-atomic-groups
 * 
 * https://javascript.info/regexp-catastrophic-backtracking
 * 
 * In other words, this regex is stack safe, and avoids catastrophic backtracking
 * 
 * https://javascript.info/regexp-catastrophic-backtracking
 * 
 * It's tested it with a million characters, just to be safe
 * 
 * Should change once possessive quantifiers or atomic groups are widely supported, 
 * as they are easier to read
 * 
 */

export function hasMinLength(str: string, min: number) {
	if(str.length < min) return false;
	return true;
};

export function hasMaxLength(str: string, max: number) {
	if(str.length > max) return false;
	return true;
};

export function inLengthRange(str: string, min: number, max: number) {
	if(!hasMinLength(str, min)) return false;
	if(!hasMaxLength(str, max)) return false;
	return true;
};

export function isAlphabetic(str: string) {
	/* letters */
	const regex = /^(?=([A-Za-z]+))\1$/gu;
	return regex.test(str);
};

export function isNumeric(str: string) {
	/* numbers */
	const regex = /^(?=([0-9]+))\1$/gu;
	return regex.test(str);
};

export function isAlphaNumeric(str: string) {
	/* letters and numbers */
	const regex = /^(?=([A-Za-z0-9]+))\1$/gu;
	return regex.test(str);
};

export function isName(str: string) {
	/* letters, and non-consecutive spaces in between */
	const regex = /^(?=([A-Za-z]+))\1(?=((?:\s[A-Za-z]+)*))\2$/gu
	return regex.test(str);
};

export function isAlphaNumericName(str: string) {
	/* letters, numbers, and non-consecutive spaces in between */
	const regex = /^(?=([A-Za-z0-9]+))\1(?=((?:\s[A-Za-z0-9]+)*))\2$/gu;
	return regex.test(str);
};

export function isLoginId(str: string) {
	/* letters, numbers, and non-consecutive periods, hyphens, and underscores in between */
	const regex = /^(?=([A-Za-z0-9]+))\1(?=((?:[.\-_]?[A-Za-z0-9]+)*))\2$/gu;
	return regex.test(str);
};

export function isEmail(str: string) {
	/* letters, numbers, and non-consecutive periods, hyphens, and underscores in between */
	/* any domain extension allowed */
	const regex = /^(?=([A-Za-z0-9]+))\1(?=((?:[.\-_]?[A-Za-z0-9]+)*))\2@(?=((?:[A-Za-z]+\.)+))\3(?=([A-Za-z]+))\4$/gu;
	return regex.test(str);
};

export function isEther(str: string) {
	/* max 59 whole digits (aprox. floor of 256 unsigned int Wei as Ether) just to make sure there is a ceiling */
	/* no leading zeros in the whole portion */
	/* max 18 decimal digits of precision */
	/* no trailing zeros in the fractional portion */
	/* max one comma or point (decimal separator) */
	/* no signs allowed */
	const regex = /^(?=([1-9][0-9]{0,58}|0))\1(?=((?:[.,](?:[0-9]{0,17}[1-9]|0))?))\2$/gu;
	return regex.test(str);
};

export function isWei(str: string) {
	/* max 77 whole digits (aprox. floor of 256 unsigned int) just to make sure there is a ceiling */
	/* no leading zeros */
	const regex = /^(?=([1-9][0-9]{0,76}|0))\1$/gu;
	return regex.test(str);
};

export function isHour(str: string) {
	/* max 2 digits */
	/* no leading zeros */
	/* min: 0, max: 24 */
	const regex = /^(?=(2[0-4]|1[0-9]|[0-9]))\1$/gu;
	return regex.test(str);
};

export function isMinute(str: string) {
	/* max 2 digits */
	/* no leading zeros */
	/* min: 0, max: 60 */
	const regex = /^(?=(60|[1-5][0-9]|[0-9]))\1$/gu;
	return regex.test(str);
};

export function isSecond(str: string) {
	/* max 2 whole digits */
	/* no leading zeros in the whole portion */
	/* max 2 decimal digits of precision */
	/* no trailing zeros in the fractional portion */
	/* max one comma or point (decimal separator) */
	/* min: 0.0, max: 60.99 */
	const regex = /^(?=(60|[1-5][0-9]|[0-9]))\1(?=((?:[.,](?:[0-9][1-9]|[0-9]))?))\2$/gu;
	return regex.test(str);
};

export function isDecDegree(str: string) {
	/* max 2 digits */
	/* no leading zeros */
	/* no negative zero (-0) */
	/* min: -90, max: 90 */
	const regex = /^(?=([-]?90|[-]?[1-8][0-9]|[-]?[1-9]|0))\1$/gu;
	return regex.test(str);
};
