import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'users.json');

const SEED_USERS = [
  { id: 0, name: "Super Admin", email: "superadmin@lgoms.gov.np", roleId: 0, branchId: 1, departmentId: 1, status: "Active", joined: "2082/01/01", username: "superadmin", password: "admin123", employeeCode: "EMP-000", mfaStatus: "Enabled", lastLogin: "2082/04/12 11:00 AM", avatar: null },
  { id: 1, name: "Admin User",  email: "admin@lgoms.gov.np",      roleId: 1, branchId: 1, departmentId: 1, status: "Active",   joined: "2082/03/15", username: "admin", password: "admin123", employeeCode: "EMP-001", mfaStatus: "Enabled", lastLogin: "2082/04/10 10:23 AM", avatar: null },
  { id: 2, name: "Narayan Pmai", email: "narayanpmai@gmail.com",  roleId: 1, branchId: 1, departmentId: 1, status: "Active",   joined: "2083/04/04", username: "narayanpmai", password: "admin123", employeeCode: "EMP-002", mfaStatus: "Disabled", lastLogin: null, avatar: null },
  { id: 3, name: "Ram Bahadur", email: "ram.ward1@lgoms.gov.np",  roleId: 2, branchId: 3, departmentId: 3, status: "Active",   joined: "2082/01/20", username: "ram_ward1", password: "ward123", employeeCode: "EMP-003", mfaStatus: "Disabled", lastLogin: "2082/04/09 14:10 PM", avatar: null },
  { id: 4, name: "Sita Sharma", email: "sita.op@lgoms.gov.np",    roleId: 3, branchId: 2, departmentId: 2, status: "Active",   joined: "2081/11/05", username: "sita_op", password: "op123", employeeCode: "EMP-004", mfaStatus: "Enabled", lastLogin: "2082/04/11 09:15 AM", avatar: null },
];

function readUsers() {
  try {
    const dataDir = path.dirname(dataFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify(SEED_USERS, null, 2));
      return SEED_USERS;
    }
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  } catch (err) {
    console.error("Error reading users:", err);
    return SEED_USERS;
  }
}

function writeUsers(users: any[]) {
  try {
    const dataDir = path.dirname(dataFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (err) {
    console.error("Error writing users:", err);
    return false;
  }
}

export async function GET() {
  return NextResponse.json(readUsers());
}

export async function POST(req: Request) {
  try {
    const users = await req.json();
    if (Array.isArray(users)) {
      writeUsers(users);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "Expected an array of users" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
