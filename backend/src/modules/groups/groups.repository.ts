import { db } from '../../db';
import crypto from 'crypto';
import { OperationsRepository } from '../operations/operations.repository';

export class GroupsRepository {
  async findAll(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM groups", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async findById(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM groups WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(data: any): Promise<any> {
    const id = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO groups (id, name, teacher_name, capacity, age_limit) VALUES (?, ?, ?, ?, ?)",
        [id, data.name, data.teacher_name, data.capacity, data.age_limit],
        async function (err) {
          if (err) reject(err);
          else {
            await OperationsRepository.log('CREATE', 'GROUP', data.name, 'Yangi guruh yaratildi');
            resolve({ id, ...data });
          }
        }
      );
    });
  }

  async update(id: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE groups SET name = ?, teacher_name = ?, capacity = ?, age_limit = ? WHERE id = ?",
        [data.name, data.teacher_name, data.capacity, data.age_limit, id],
        async function (err) {
          if (err) reject(err);
          else {
            await OperationsRepository.log('UPDATE', 'GROUP', data.name, 'Guruh ma\'lumotlari tahrirlandi');
            resolve({ id, ...data });
          }
        }
      );
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.get("SELECT name FROM groups WHERE id = ?", [id], (err, group) => {
        if (err) return reject(err);
        if (!group) return resolve();

        db.run("DELETE FROM groups WHERE id = ?", [id], async (err) => {
          if (err) {
            if (err.message.includes('FOREIGN KEY constraint failed')) {
              reject(new Error('Guruhda bolalar yoki xodimlar borligi sababli uni o\'chirib bo\'lmaydi'));
            } else {
              reject(err);
            }
          } else {
            await OperationsRepository.log('DELETE', 'GROUP', group.name, 'Guruh o\'chirib tashlandi');
            resolve();
          }
        });
      });
    });
  }
}
