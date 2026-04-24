import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bcrypt from "bcryptjs";
import { db } from "./src/db";
import { ChildrenController } from "./src/modules/children/children.controller";
import { GroupsController } from "./src/modules/groups/groups.controller";
import { StaffController } from "./src/modules/staff/staff.controller";
import { OperationsRepository } from "./src/modules/operations/operations.repository";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.post("/api/auth/login", (req, res) => {
  const { login, password } = req.body;
  db.get('SELECT * FROM users WHERE login = ?', [login], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    res.json({
      id: user.id,
      login: user.login,
      role: user.role,
      full_name: user.full_name
    });
  });
});

app.post("/api/auth/parent-login", (req, res) => {
  const { login, password } = req.body;
  // Parent logins are simple for now, but we could add bcrypt here too if needed
  db.get('SELECT * FROM parent_accounts WHERE login = ?', [login], async (err, account) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!account) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    const match = await bcrypt.compare(password, account.password_hash);
    if (!match) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    res.json({
      id: account.id,
      login: account.login,
      role: 'PARENT',
      full_name: 'Valiahd'
    });
  });
});

const childrenController = new ChildrenController();
app.post("/api/children", childrenController.create);
app.get("/api/children", childrenController.getAll);
app.put("/api/children/:id", childrenController.update);
app.delete("/api/children/:id", childrenController.delete);

const groupsController = new GroupsController();
app.get("/api/groups", groupsController.getAll);
app.post("/api/groups", groupsController.create);
app.put("/api/groups/:id", groupsController.update);
app.delete("/api/groups/:id", groupsController.delete);

const staffController = new StaffController();
app.get("/api/staff", staffController.getAll);
app.post("/api/staff", staffController.create);
app.put("/api/staff/:id", staffController.update);
app.delete("/api/staff/:id", staffController.delete);

const operationsRepo = new OperationsRepository();
app.get("/api/operations", async (req, res) => {
  try {
    const operations = await operationsRepo.findAll(20);
    res.json(operations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/parents", (req, res) => {
  db.all(`
    SELECT 
      pa.id, 
      c.id as childId,
      c.first_name || ' ' || c.last_name as childName, 
      c.birth_certificate_number as childBirthCertificate,
      c.address,
      c.weight,
      c.height,
      c.allergies,
      c.medical_notes,
      f.full_name as fatherName, 
      f.phone as fatherPhone,
      f.passport_no as fatherPassport,
      f.workplace as fatherWorkplace,
      m.full_name as motherName, 
      m.phone as motherPhone,
      m.passport_no as motherPassport,
      m.workplace as motherWorkplace,
      g.name as childGroup,
      pa.login, 
      '********' as password
    FROM parent_accounts pa
    LEFT JOIN children c ON c.parent_account_id = pa.id
    LEFT JOIN parents f ON c.father_id = f.id
    LEFT JOIN parents m ON c.mother_id = m.id
    LEFT JOIN groups g ON c.group_id = g.id
    ORDER BY c.created_at DESC
  `, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.put("/api/parents/:id", async (req, res) => {
  const { login, password } = req.body;
  const { id } = req.params;
  
  try {
    if (password && password !== '********') {
      const passwordHash = await bcrypt.hash(password, 10);
      db.run('UPDATE parent_accounts SET login = ?, password_hash = ? WHERE id = ?', [login, passwordHash, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      });
    } else {
      db.run('UPDATE parent_accounts SET login = ? WHERE id = ?', [login, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/parents/:id", (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM parent_accounts WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// New comprehensive endpoint for Parent Portal
app.get("/api/parent-portal/full-data/:childId", async (req, res) => {
  const { childId } = req.params;
  const data: any = {};

  try {
    const fetch = (sql: string, params: any[]) => new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
    });

    data.payments = await fetch('SELECT * FROM payments WHERE child_id = ? ORDER BY date DESC', [childId]);
    data.attendance = await fetch('SELECT * FROM attendance WHERE child_id = ? ORDER BY date DESC', [childId]);
    data.documents = await fetch('SELECT * FROM documents WHERE child_id = ? ORDER BY created_at DESC', [childId]);
    data.authorizedPickups = await fetch('SELECT * FROM authorized_pickups WHERE child_id = ?', [childId]);
    data.progressReports = await fetch('SELECT * FROM progress_reports WHERE child_id = ? ORDER BY date DESC', [childId]);
    data.vaccinations = await fetch('SELECT * FROM vaccinations WHERE child_id = ? ORDER BY planned_date ASC', [childId]);

    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend API running on http://0.0.0.0:${PORT}`);
});
