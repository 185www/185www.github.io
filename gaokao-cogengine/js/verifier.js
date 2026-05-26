const Verifier = {
  fillBlank(input, expected, options = {}) {
    if (!input || !input.trim()) return false;
    const normalized = input.trim().replace(/\s+/g, ' ').toLowerCase();
    const normalizedExpected = expected.trim().replace(/\s+/g, ' ').toLowerCase();
    if (options.fuzzy) {
      return normalized.includes(normalizedExpected) || normalizedExpected.includes(normalized);
    }
    return normalized === normalizedExpected;
  },

  equation(input, expectedEquation) {
    if (!input || !input.trim()) return { pass: false };
    const normalized = input.trim().replace(/\s+/g, ' ').replace(/→/g, '=').replace(/＝/g, '=').replace(/——/g, '=');
    const expected = expectedEquation.trim().replace(/\s+/g, ' ').replace(/→/g, '=').replace(/＝/g, '=').replace(/——/g, '=');
    return { pass: normalized === expected, expected: expectedEquation };
  },

  coefficients(input, expectedArray) {
    if (!input || !input.trim()) return false;
    const parts = input.trim().split(/[,，\s]+/).map(s => parseInt(s, 10));
    if (parts.length !== expectedArray.length) return false;
    return parts.every((p, i) => p === expectedArray[i]);
  },

  choice(input, options, correctIndex) {
    if (input === undefined || input === null || input === '') return false;
    const idx = typeof input === 'number' ? input : parseInt(input, 10);
    return idx === correctIndex;
  },

  sequence(input, expectedOrder) {
    if (!Array.isArray(input)) return false;
    if (input.length !== expectedOrder.length) return false;
    return input.every((item, i) => item === expectedOrder[i]);
  },

  multiChoice(input, correctIndices) {
    if (!Array.isArray(input)) return false;
    if (input.length !== correctIndices.length) return false;
    const sorted = [...input].sort();
    const sortedCorrect = [...correctIndices].sort();
    return sorted.every((v, i) => v === sortedCorrect[i]);
  },

  identifyError(input, errorPositions) {
    if (!input) return false;
    const pos = parseInt(input, 10);
    return errorPositions.includes(pos);
  }
};
