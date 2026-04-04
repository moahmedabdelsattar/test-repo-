const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// تأكد أن المنفذ هنا 8000 كما في الـ Dockerfile والـ Compose
const port = 3000;

const pool = new Pool({
  host: process.env.DB_HOST || "db", // استخدام متغيرات البيئة أفضل
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "example",
  database: process.env.DB_NAME || "postgres",
  port: 5432,
});

// تحسين: محاولة الاتصال أكثر من مرة حتى تجهز الداتابيز
const initDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS employees (
          id SERIAL PRIMARY KEY,
          name TEXT,
          position TEXT
        );
      `);
      console.log("✅ Database & Table ready");
      break;
    } catch (err) {
      console.log("❌ Database not ready yet, retrying...", retries);
      retries -= 1;
      // انتظر 5 ثواني قبل المحاولة القادمة
      await new Promise(res => setTimeout(res, 5000));
    }
  }
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
  try {
    const result = await pool.query("SELECT * FROM employees");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟡 عرض موظف واحد
app.get("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM employees WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Company API is running on Docker!");
});

// تحديد 0.0.0.0 ضروري جداً ليعمل داخل الحاوية
app.listen(port, "0.0.0.0", () => {
  console.log(`App running on port ${port}`);
});