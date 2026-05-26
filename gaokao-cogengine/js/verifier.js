const Verifier = {
  valance(input, expectedValences) {
    if (!input || typeof input !== 'object') return false;
    for (const substanceKey in expectedValences) {
      const expected = expectedValences[substanceKey];
      const given = input[substanceKey];
      if (!given) return false;
      for (const el in expected) {
        if (parseInt(given[el], 10) !== expected[el]) return false;
      }
    }
    return true;
  },

  rank(input, correctOrder) {
    if (!Array.isArray(input)) return false;
    if (input.length !== correctOrder.length) return false;
    return input.every((v, i) => (parseInt(v, 10) - 1) === correctOrder[i]);
  },

  construct(input, expectedParts) {
    if (!input || !input.trim()) return false;
    const normalize = (s) => s
      .replace(/\s+/g, '')
      .replace(/[→＝=——]/g, '-')
      .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, d => '0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(d)])
      .toLowerCase();
    const cleaned = normalize(input);
    const expected = normalize(expectedParts);
    return cleaned === expected;
  },

  fillBlank(input, expected, options = {}) {
    if (!input || !input.trim()) return false;
    const normalized = input.trim().replace(/\s+/g, ' ').toLowerCase();
    const normalizedExpected = expected.trim().replace(/\s+/g, ' ').toLowerCase();
    if (options.fuzzy) {
      return normalized.includes(normalizedExpected) || normalizedExpected.includes(normalized);
    }
    return normalized === normalizedExpected;
  },

  choice(input, options, correctIndex) {
    if (input === undefined || input === null || input === '') return false;
    const idx = typeof input === 'number' ? input : parseInt(input, 10);
    return idx === correctIndex;
  },

  multiChoice(input, correctIndices) {
    if (!Array.isArray(input)) return false;
    if (input.length !== correctIndices.length) return false;
    const sorted = [...input].sort();
    const sortedCorrect = [...correctIndices].sort();
    return sorted.every((v, i) => v === sortedCorrect[i]);
  },

  keyTerms(input, requiredTerms) {
    if (!input || !input.trim()) return false;
    const normalized = input.toLowerCase();
    return requiredTerms.every(term => normalized.includes(term.toLowerCase()));
  }
};
