const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const port = 8000;

// الاتصال بالداتابيز (اسم الخدمة db من docker-compose)
const pool = new Pool({
  host: "db",
  user: "postgres",
  password: "example",
  database: "postgres",
  port: 5432,
});

// إنشاء جدول تلقائي أول ما السيرفر يشتغل
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      name TEXT,
      position TEXT
    );
  `);
  console.log("Table ready");
};

initDB();

// 🟢 إضافة موظف
app.post("/employees", async (req, res) => {
  const { name, position } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO employees (name, position) VALUES ($1, $2) RETURNING *",
      [name, position]
    );

    res.json({
      message: "Employee created",
      employee: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔵 عرض كل الموظفين
app.get("/employees", async (req, res) => {
  const result = await pool.query("SELECT * FROM employees");
  res.json(result.rows);
});

// 🟡 عرض موظف واحد
app.get("/employees/:id", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT * FROM employees WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Employee not found" });
  }

  res.json(result.rows[0]);
});

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.send("🚀 Company API is running");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`App running on port ${port}`);
});