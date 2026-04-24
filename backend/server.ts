import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bcrypt from "bcryptjs";
import { db } from "./src/db";
import { ChildrenController } from "./src/modules/children/children.controller";
import { GroupsController } from "./src/modules/groups/groups.controller";
import { StaffController } from "./src/modules/staff/staff.controller";
import { HealthController } from "./src/modules/health/health.controller";
import { OperationsRepository } from "./src/modules/operations/operations.repository";
import crypto from "crypto";

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
  db.get('SELECT * FROM users WHERE login = ?', [login], async (err, user: any) => {
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
  db.get('SELECT pa.*, c.id as child_id, c.first_name || " " || c.last_name as child_name FROM parent_accounts pa LEFT JOIN children c ON c.parent_account_id = pa.id WHERE pa.login = ?', [login], async (err, account: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!account) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    const match = await bcrypt.compare(password, account.password_hash);
    if (!match) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    res.json({
      id: account.id,
      login: account.login,
      role: 'PARENT',
      full_name: account.child_name || 'Valiahd',
      childId: account.child_id
    });
  });
});

app.get("/api/parent-portal/child-info/:childId", (req, res) => {
  const { childId } = req.params;
  db.get(`
    SELECT 
      c.*,
      f.full_name as fatherName, f.phone as fatherPhone, f.passport_no as fatherPassport, f.workplace as fatherWorkplace,
      m.full_name as motherName, m.phone as motherPhone, m.passport_no as motherPassport, m.workplace as motherWorkplace,
      g.name as childGroup
    FROM children c
    LEFT JOIN parents f ON c.father_id = f.id
    LEFT JOIN parents m ON c.mother_id = m.id
    LEFT JOIN groups g ON c.group_id = g.id
    WHERE c.id = ?
  `, [childId], (err, row) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(row);
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

const healthController = new HealthController();
app.post("/api/health/batch", healthController.saveBatch);
app.get("/api/health/history/:groupId", healthController.getHistory);
app.get("/api/health/archive", healthController.getArchive);
app.get("/api/health/allergies", (req, res) => {
  db.all(`
    SELECT c.first_name, c.last_name, c.allergies, g.name as group_name
    FROM children c
    LEFT JOIN groups g ON c.group_id = g.id
    WHERE c.is_allergic = 1 OR (c.allergies IS NOT NULL AND c.allergies != '')
  `, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get("/api/attendance/today-stats", async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const stats: any = {
      total: 0,
      present: 0,
      absent: 0,
      checked: 0,
      notChecked: 0,
      sick: 0,
      healthy: 0,
      age1_3: 0,
      age3_7: 0,
      allergyCount: 0
    };

    const fetchOne = (sql: string, params: any[] = []) => new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    });

    const counts: any = await fetchOne(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN age_category LIKE '%1-3%' THEN 1 ELSE 0 END) as age1_3,
        SUM(CASE WHEN age_category LIKE '%3-7%' THEN 1 ELSE 0 END) as age3_7,
        SUM(CASE WHEN is_allergic = 1 THEN 1 ELSE 0 END) as allergyCount
      FROM children
    `);
    
    stats.total = counts?.total || 0;
    stats.age1_3 = counts?.age1_3 || 0;
    stats.age3_7 = counts?.age3_7 || 0;
    stats.allergyCount = counts?.allergyCount || 0;

    const attendance: any = await fetchOne(`
      SELECT 
        SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'ABSENT' THEN 1 ELSE 0 END) as absent,
        SUM(CASE WHEN status = 'SICK' THEN 1 ELSE 0 END) as sick_attendance
      FROM attendance
      WHERE date = ?
    `, [today]);

    stats.present = attendance?.present || 0;
    stats.absent = attendance?.absent || 0;
    const sickAttendance = attendance?.sick_attendance || 0;

    const health: any = await fetchOne(`
      SELECT 
        COUNT(*) as checked,
        SUM(CASE WHEN is_sick = 1 THEN 1 ELSE 0 END) as sick_health
      FROM health_checks
      WHERE date = ?
    `, [today]);

    stats.checked = health?.checked || 0;
    stats.notChecked = stats.total - stats.checked;
    // Kasal bolalar = Davomatda kasal deb belgilanganlar + Hamshira kasal deb topganlar (takrorlanishni hisobga olmasdan, sodda jamlash)
    stats.sick = Math.max(sickAttendance, health?.sick_health || 0);
    stats.healthy = stats.checked - (health?.sick_health || 0);

    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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
        if (err) {
          console.error("Update parent error:", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
      });
    } else {
      db.run('UPDATE parent_accounts SET login = ? WHERE id = ?', [login, id], function(err) {
        if (err) {
          console.error("Update parent error:", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
      });
    }
  } catch (err: any) {
    console.error("Update parent catch error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/parents/:id", (req, res) => {
  const { id } = req.params;
  
  db.run('UPDATE children SET parent_account_id = NULL WHERE parent_account_id = ?', [id], function(err) {
    if (err) {
      console.error("Error unlinking child from parent account:", err);
      return res.status(500).json({ error: err.message });
    }
    
    db.run('DELETE FROM parent_accounts WHERE id = ?', [id], function(err) {
      if (err) {
        console.error("Delete parent account error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    });
  });
});

app.get("/api/parent-portal/full-data/:childId", async (req, res) => {
  const { childId } = req.params;
  const data: any = {};

  try {
    const fetchAll = (sql: string, params: any[]) => new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
    });
    const fetchOne = (sql: string, params: any[]) => new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    });

    data.payments = await fetchAll('SELECT * FROM payments WHERE child_id = ? ORDER BY date DESC', [childId]);
    data.attendance = await fetchAll('SELECT * FROM attendance WHERE child_id = ? ORDER BY date DESC', [childId]);
    data.documents = await fetchAll('SELECT * FROM documents WHERE child_id = ? ORDER BY created_at DESC', [childId]);
    data.authorizedPickups = await fetchAll('SELECT * FROM authorized_pickups WHERE child_id = ?', [childId]);
    data.progressReports = await fetchAll('SELECT * FROM progress_reports WHERE child_id = ? ORDER BY date DESC', [childId]);
    data.vaccinations = await fetchAll('SELECT * FROM vaccinations WHERE child_id = ? ORDER BY planned_date ASC', [childId]);

    const child: any = await fetchOne('SELECT age_category, is_allergic FROM children WHERE id = ?', [childId]);
    const ageGroup = child?.age_category?.includes('1-3') ? '1-3' : '3-7';
    const dietType = child?.is_allergic ? 'DIETARY' : 'REGULAR';

    const today = new Date().toISOString().split('T')[0];
    data.menu = await fetchAll('SELECT * FROM menus WHERE date = ? AND age_group = ? AND diet_type = ?', [today, ageGroup, dietType]);

    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Attendance API
app.get("/api/attendance/:groupId/:date", (req, res) => {
  const { groupId, date } = req.params;
  db.all('SELECT child_id, status FROM attendance WHERE child_id IN (SELECT id FROM children WHERE group_id = ?) AND date = ?', [groupId, date], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const attendanceMap = rows.reduce((acc: any, row: any) => {
      acc[row.child_id] = row.status.toLowerCase();
      return acc;
    }, {});
    res.json(attendanceMap);
  });
});

app.post("/api/attendance", (req, res) => {
  const { date, group_name, attendance_data } = req.body;
  const isoDate = new Date().toISOString().split('T')[0]; // Use ISO date format for DB consistency

  const childIds = Object.keys(attendance_data);
  let completed = 0;
  let hasError = false;

  if (childIds.length === 0) return res.json({ success: true });

  childIds.forEach(childId => {
    const status = attendance_data[childId].toUpperCase();
    db.run(`
      INSERT INTO attendance (id, child_id, date, status)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(child_id, date) DO UPDATE SET status = excluded.status
    `, [crypto.randomUUID(), childId, isoDate, status], function(err) {
      if (err && !hasError) {
        hasError = true;
        return res.status(500).json({ error: err.message });
      }
      completed++;
      if (completed === childIds.length && !hasError) {
        res.json({ success: true });
      }
    });
  });
});

// Dishes API
app.get("/api/dishes", (req, res) => {
  db.all('SELECT * FROM dishes ORDER BY name ASC', [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/dishes", (req, res) => {
  const { name, image, kcal, iron, carbs, vitamins } = req.body;
  const id = crypto.randomUUID();
  db.run(`
    INSERT INTO dishes (id, name, image, kcal, iron, carbs, vitamins)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [id, name, image, kcal, iron, carbs, vitamins], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true, id });
  });
});

app.delete("/api/dishes/:id", (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM dishes WHERE id = ?', [id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

// Menu API
app.get("/api/menu/:date", (req, res) => {
  const { date } = req.params;
  db.all('SELECT * FROM menus WHERE date = ?', [date], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/menu", (req, res) => {
  const { date, meal_name, meal_type, nutrition, age_group, diet_type } = req.body;
  const id = crypto.randomUUID();
  db.run(`
    INSERT INTO menus (id, date, meal_name, meal_type, age_group, diet_type, iron, carbohydrates, vitamins, calories)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(date, meal_type, age_group, diet_type) DO UPDATE SET
      meal_name = excluded.meal_name,
      iron = excluded.iron,
      carbohydrates = excluded.carbohydrates,
      vitamins = excluded.vitamins,
      calories = excluded.calories
  `, [
    id, date, meal_name, meal_type, 
    age_group || '3-7', 
    diet_type || 'REGULAR', 
    nutrition.iron || 0, 
    nutrition.carbs || 0, 
    nutrition.vitamins || '', 
    nutrition.kcal || 0
  ], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true, id });
  });
});

// Kitchen API
app.get("/api/kitchen/tasks/:date", (req, res) => {
  const { date } = req.params;
  db.all(`
    SELECT kt.*, m.id as menu_id, m.meal_name, m.meal_type, m.age_group, m.diet_type 
    FROM menus m
    LEFT JOIN kitchen_tasks kt ON kt.menu_id = m.id
    WHERE m.date = ?
  `, [date], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/kitchen/tasks/:menuId/status", (req, res) => {
  const { menuId } = req.params;
  const { status, temperature, start_time, end_time, served_time } = req.body;
  const id = crypto.randomUUID();

  db.run(`
    INSERT INTO kitchen_tasks (id, menu_id, status, temperature, start_time, end_time, served_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(menu_id) DO UPDATE SET
      status = excluded.status,
      temperature = COALESCE(excluded.temperature, temperature),
      start_time = COALESCE(excluded.start_time, start_time),
      end_time = COALESCE(excluded.end_time, end_time),
      served_time = COALESCE(excluded.served_time, served_time)
  `, [id, menuId, status, temperature, start_time, end_time, served_time], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend API running on http://0.0.0.0:${PORT}`);
});

// Database initialization for Warehouse
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL,
    brand TEXT,
    min_stock REAL DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS inventory_batches (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    quantity REAL NOT NULL,
    price_per_unit REAL,
    total_price REAL,
    received_date TEXT NOT NULL,
    expiry_date TEXT,
    supplier TEXT,
    storage_location TEXT,
    storage_temp REAL,
    notes TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS inventory_transactions (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'IN' or 'OUT'
    quantity REAL NOT NULL,
    price REAL,
    date TEXT NOT NULL,
    batch_id TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);
});

// Inventory API Endpoints
app.get("/api/inventory/products", (req, res) => {
  db.all(`
    SELECT p.*, IFNULL(SUM(b.quantity), 0) as total_quantity 
    FROM products p
    LEFT JOIN inventory_batches b ON p.id = b.product_id
    GROUP BY p.id
  `, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/inventory/products", (req, res) => {
  const { name, category, unit, brand, min_stock } = req.body;
  const id = crypto.randomUUID();
  db.run(`INSERT INTO products (id, name, category, unit, brand, min_stock) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, category, unit, brand, min_stock || 0],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ success: true, id });
    }
  );
});

app.put("/api/inventory/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, category, unit, brand, min_stock } = req.body;
  db.run(`
    UPDATE products 
    SET name = ?, category = ?, unit = ?, brand = ?, min_stock = ?
    WHERE id = ?
  `, [name, category, unit, brand, min_stock, id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

app.get("/api/inventory/batches", (req, res) => {
  db.all(`
    SELECT b.*, p.name as product_name, p.unit 
    FROM inventory_batches b
    JOIN products p ON b.product_id = p.id
    WHERE b.quantity > 0
    ORDER BY b.expiry_date ASC
  `, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/inventory/stock-in", (req, res) => {
  const { 
    product_id, quantity, batch_number, invoice_number, 
    price_per_unit, total_price, expiry_date, supplier, 
    received_date, storage_location, storage_temp, notes 
  } = req.body;
  
  const batch_id = crypto.randomUUID();
  const trans_id = crypto.randomUUID();
  const today = received_date || new Date().toISOString().split('T')[0];

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    db.run(`
      INSERT INTO inventory_batches (
        id, product_id, batch_number, invoice_number, quantity, 
        price_per_unit, total_price, received_date, expiry_date, 
        supplier, storage_location, storage_temp, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      batch_id, product_id, batch_number, invoice_number, quantity, 
      price_per_unit, total_price, today, expiry_date, 
      supplier, storage_location, storage_temp, notes
    ]);

    db.run(`
      INSERT INTO inventory_transactions (id, product_id, type, quantity, price, date, batch_id)
      VALUES (?, ?, 'IN', ?, ?, ?, ?)
    `, [trans_id, product_id, quantity, price_per_unit, today, batch_id]);

    db.run("COMMIT", (err) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ success: true });
    });
  });
});

app.post("/api/inventory/stock-out", (req, res) => {
  const { product_id, quantity, date } = req.body;
  const today = date || new Date().toISOString().split('T')[0];
  let remainingToOut = quantity;

  db.all(`SELECT * FROM inventory_batches WHERE product_id = ? AND quantity > 0 ORDER BY expiry_date ASC`, [product_id], (err, batches: any[]) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const totalAvailable = batches.reduce((sum, b) => sum + b.quantity, 0);
    if (totalAvailable < quantity) return res.status(400).json({ error: "Omborda yetarli mahsulot yo'q" });

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      for (const batch of batches) {
        if (remainingToOut <= 0) break;
        const take = Math.min(batch.quantity, remainingToOut);
        db.run(`UPDATE inventory_batches SET quantity = quantity - ? WHERE id = ?`, [take, batch.id]);
        remainingToOut -= take;
      }
      db.run(`
        INSERT INTO inventory_transactions (id, product_id, type, quantity, date)
        VALUES (?, ?, 'OUT', ?, ?)
      `, [crypto.randomUUID(), product_id, quantity, today]);

      db.run("COMMIT", (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ success: true });
      });
    });
  });
});

app.get("/api/inventory/transactions", (req, res) => {
  db.all(`
    SELECT t.*, p.name as product_name, p.unit, p.category
    FROM inventory_transactions t
    JOIN products p ON t.product_id = p.id
    ORDER BY t.date DESC, t.id DESC
    LIMIT 100
  `, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});
