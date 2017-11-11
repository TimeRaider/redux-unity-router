type EnsureQuestionMark = (s: string) => string;

const ensureQuestionMark: EnsureQuestionMark = (s: string) =>
	s.charAt(0) === '?' ? s : `?${s}`;

export default ensureQuestionMark;
