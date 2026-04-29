require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());

async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

// ---------- Patients ----------
app.get('/patients', async (_req, res) => {
  try {
    const { rows } = await query(
      'SELECT patient_id, full_name, birth_date, gender FROM patients ORDER BY patient_id'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/patients', async (req, res) => {
  try {
    const { full_name, birth_date, gender } = req.body;
    if (!full_name || !birth_date || !gender) {
      return res.status(400).json({ error: 'full_name, birth_date, gender required' });
    }
    const { rows } = await query(
      `INSERT INTO patients (full_name, birth_date, gender) VALUES ($1, $2, $3)
       RETURNING patient_id, full_name, birth_date, gender`,
      [full_name, birth_date, gender]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

// ---------- Doctors ----------
app.get('/doctors', async (_req, res) => {
  try {
    const { rows } = await query(
      'SELECT doctor_id, full_name, specialty FROM doctors ORDER BY doctor_id'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/doctors', async (req, res) => {
  try {
    const { full_name, specialty } = req.body;
    if (!full_name || !specialty) {
      return res.status(400).json({ error: 'full_name, specialty required' });
    }
    const { rows } = await query(
      `INSERT INTO doctors (full_name, specialty) VALUES ($1, $2)
       RETURNING doctor_id, full_name, specialty`,
      [full_name, specialty]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

// ---------- Appointments ----------
app.get('/appointments', async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT appointment_id, patient_id, doctor_id, visit_date, diagnosis
       FROM appointments ORDER BY visit_date DESC`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/appointments', async (req, res) => {
  try {
    const { patient_id, doctor_id, visit_date, diagnosis } = req.body;
    if (!patient_id || !doctor_id || !visit_date) {
      return res.status(400).json({ error: 'patient_id, doctor_id, visit_date required' });
    }
    const { rows } = await query(
      `INSERT INTO appointments (patient_id, doctor_id, visit_date, diagnosis)
       VALUES ($1, $2, $3, $4)
       RETURNING appointment_id, patient_id, doctor_id, visit_date, diagnosis`,
      [patient_id, doctor_id, visit_date, diagnosis ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

// ---------- Treatments ----------
app.get('/treatments', async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT treatment_id, appointment_id, description, cost
       FROM treatments ORDER BY treatment_id`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/treatments', async (req, res) => {
  try {
    const { appointment_id, description, cost } = req.body;
    if (!appointment_id || description === undefined || description === '') {
      return res.status(400).json({ error: 'appointment_id, description required' });
    }
    const c = cost != null ? Number(cost) : 0;
    const { rows } = await query(
      `INSERT INTO treatments (appointment_id, description, cost)
       VALUES ($1, $2, $3)
       RETURNING treatment_id, appointment_id, description, cost`,
      [appointment_id, description, c]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

// ---------- Analytics ----------
app.get('/analytics/appointments', async (_req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        a.appointment_id,
        a.visit_date,
        a.diagnosis,
        a.patient_id,
        a.doctor_id,
        p.full_name AS patient_name,
        d.full_name AS doctor_name,
        d.specialty AS doctor_specialty
      FROM appointments a
      INNER JOIN patients p ON a.patient_id = p.patient_id
      INNER JOIN doctors d ON a.doctor_id = d.doctor_id
      ORDER BY a.visit_date DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/analytics/doctor-load', async (_req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        d.doctor_id,
        d.full_name,
        d.specialty,
        COUNT(a.appointment_id)::int AS appointment_count
      FROM doctors d
      LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
      GROUP BY d.doctor_id, d.full_name, d.specialty
      ORDER BY appointment_count DESC, d.full_name
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/analytics/total-income', async (_req, res) => {
  try {
    const { rows } = await query(`
      SELECT COALESCE(SUM(cost), 0)::numeric AS total_income FROM treatments
    `);
    res.json({ total_income: rows[0].total_income });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/analytics/income-by-doctor', async (_req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        d.doctor_id,
        d.full_name,
        d.specialty,
        COALESCE(SUM(t.cost), 0)::numeric AS total_income
      FROM doctors d
      LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
      LEFT JOIN treatments t ON t.appointment_id = a.appointment_id
      GROUP BY d.doctor_id, d.full_name, d.specialty
      ORDER BY total_income DESC, d.full_name
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/analytics/diagnosis-stats', async (_req, res) => {
  try {
    const { rows } = await query(`
      SELECT
        COALESCE(NULLIF(TRIM(diagnosis), ''), '(не указан)') AS diagnosis,
        COUNT(*)::int AS count
      FROM appointments
      GROUP BY COALESCE(NULLIF(TRIM(diagnosis), ''), '(не указан)')
      ORDER BY count DESC, diagnosis
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`);
});
