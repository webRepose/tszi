// services/expertScoringEngine.js

const threatLevels = {
  low: 1,
  medium: 2,
  high: 3
};

const normalize = (v) => v?.toString().toLowerCase().trim();

const calculateRatingScore = (tool) => {
  if (!tool.rating) return 0;

  const { effectiveness, scalability, support, complexity } = tool.rating;

  return (
    effectiveness * 0.4 +
    scalability * 0.3 +
    support * 0.2 -
    complexity * 0.1
  );
};

export const scoreExpertTool = (tool, criteria) => {
  let score = 0;

  // 1️⃣ Тип объекта
  if (criteria.object && tool.targetObjects?.includes(criteria.object)) {
    score += 3;
  }

  // 2️⃣ Уровень угроз (иерархия)
  if (criteria.threat && tool.minThreat) {
    const toolThreat = threatLevels[normalize(tool.minThreat)];
    const userThreat = threatLevels[normalize(criteria.threat)];

    if (toolThreat >= userThreat) {
      score += 3;
    }
  }

  // 3️⃣ Криптография
  if (criteria.crypto) {
    if (tool.supportsCrypto) score += 2;
  }

  // 4️⃣ Стандарт
  if (
    criteria.standard &&
    tool.standards?.map(normalize).includes(normalize(criteria.standard))
  ) {
    score += 2;
  }

  // 5️⃣ Тип внедрения
  if (
    criteria.deployment &&
    tool.deployment?.includes(criteria.deployment)
  ) {
    score += 1;
  }

  // 6️⃣ Количество сотрудников
  if (criteria.employees && tool.minEmployees) {
    if (criteria.employees >= tool.minEmployees) {
      score += 2;
    }
  }

  // 7️⃣ Рейтинг
  score += calculateRatingScore(tool);

  const index = Math.min(Math.round(score * 10), 100);

  return {
    ...tool,
    score,
    index
  };
};