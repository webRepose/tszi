const normalize = (text) =>
  text?.toString().toLowerCase().trim() || "";

const stemWords = (text) =>
  normalize(text)
    .split(/\s+/)
    .filter(w => w.length > 2)
    .map(w => w.slice(0, 5));

const calculateSemanticScore = (tool, goal) => {
  const words = stemWords(goal);

  const textToSearch = [
    ...(tool.tags || []),
    ...(tool.features || []),
    tool.description || "",
    tool.fullDescription || "",
    tool.expertComment || ""
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;

  words.forEach(w => {
    if (textToSearch.includes(w)) score += 1;
  });

  return score;
};

const calculateCriteriaScore = (tool, options) => {
  let score = 0;

  if (options.budget !== "any" && tool.budgetLevel === options.budget)
    score += 2;

  if (options.threat && tool.minThreat === options.threat)
    score += 2;

  if (options.crypto && tool.supportsCrypto)
    score += 2;

  if (
    options.object &&
    tool.targetObjects?.includes(options.object)
  )
    score += 2;

  if (
    options.standard &&
    tool.standards?.includes(options.standard)
  )
    score += 2;

  return score;
};

const calculateRatingScore = (tool) => {
  if (!tool.rating) return 0;

  return (
    tool.rating.effectiveness * 0.5 +
    tool.rating.scalability * 0.3 +
    tool.rating.support * 0.2 -
    tool.rating.complexity * 0.1
  );
};

export const scoreTool = (tool, goal, options = {}) => {
  const semantic = calculateSemanticScore(tool, goal);
  const criteria = calculateCriteriaScore(tool, options);
  const rating = calculateRatingScore(tool);

  const total = semantic * 3 + criteria * 2 + rating;

  return {
    ...tool,
    score: total,
    semanticScore: semantic,
    criteriaScore: criteria,
    ratingScore: rating,
    index: Math.min(Math.round(total * 10), 100) // 0–100%
  };
};