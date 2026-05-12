const { pool } = require("../db");
const { randomUUID } = require("crypto");

async function saveBVATestCases(userId, requirementText, testCases) {
  const id = randomUUID();
  const result = await pool.query(
    `INSERT INTO bva_test_cases (id, user_id, requirement_text, test_cases) VALUES ($1, $2, $3, $4) RETURNING *`,
    [id, userId, requirementText, JSON.stringify(testCases)]
  );

  return {
    ...result.rows[0],
    testCases,
  };
}

async function getBVAHistory(userId, limit = 10) {
  const params = [];
  let query = `SELECT * FROM bva_test_cases`;

  if (userId) {
    params.push(userId);
    query += ` WHERE user_id = $${params.length}`;
  }

  params.push(limit);
  query += ` ORDER BY created_at DESC LIMIT $${params.length}`;

  const result = await pool.query(query, params);

  return result.rows.map((row) => ({
    ...row,
    testCases: row.test_cases,
  }));
}

async function saveDecisionTable(userId, requirementText, decisionTable) {
  const id = randomUUID();
  const result = await pool.query(
    `INSERT INTO decision_table_cases (id, user_id, requirement_text, decision_table) VALUES ($1, $2, $3, $4) RETURNING *`,
    [id, userId, requirementText, JSON.stringify(decisionTable)]
  );

  return {
    ...result.rows[0],
    decisionTable: result.rows[0].decision_table,
  };
}

async function getDecisionTableHistory(userId, limit = 10) {
  const params = [];
  let query = `SELECT * FROM decision_table_cases`;

  if (userId) {
    params.push(userId);
    query += ` WHERE user_id = $${params.length}`;
  }

  params.push(limit);
  query += ` ORDER BY created_at DESC LIMIT $${params.length}`;

  const result = await pool.query(query, params);

  return result.rows.map((row) => ({
    ...row,
    decisionTable: row.decision_table,
  }));
}

module.exports = {
  saveBVATestCases,
  getBVAHistory,
  saveDecisionTable,
  getDecisionTableHistory,
};
