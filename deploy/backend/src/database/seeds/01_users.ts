import { Knex } from 'knex';
import bcrypt from 'bcrypt';

const PASSWORD_HASH = '$2b$10$/VeK2NEiDFLyh9rBMXbcQeRedxbpEli9x8Z9bGV91YMxwN41RtO7S'; // password123

export async function seed(knex: Knex): Promise<void> {
  // Check if users already exist (avoid duplicates)
  const existingUsers = await knex('users').select('email');
  const existingEmails = existingUsers.map(u => u.email);

  const users = [
    { full_name: 'Test User', email: 'test@example.com', password_hash: PASSWORD_HASH, role: 'employee' },
    { full_name: 'Manager User', email: 'manager@example.com', password_hash: PASSWORD_HASH, role: 'employee' },
    { full_name: 'Admin User', email: 'admin@example.com', password_hash: PASSWORD_HASH, role: 'admin' },
    { full_name: 'John Smith', email: 'john.smith@example.com', password_hash: PASSWORD_HASH, role: 'employee' },
    { full_name: 'Sarah Johnson', email: 'sarah.johnson@example.com', password_hash: PASSWORD_HASH, role: 'employee' },
    { full_name: 'Michael Brown', email: 'michael.brown@example.com', password_hash: PASSWORD_HASH, role: 'employee' },
    { full_name: 'Emily Davis', email: 'emily.davis@example.com', password_hash: PASSWORD_HASH, role: 'employee' },
    { full_name: 'David Wilson', email: 'david.wilson@example.com', password_hash: PASSWORD_HASH, role: 'employee' },
  ];

  // Only insert users that don't exist
  const newUsers = users.filter(u => !existingEmails.includes(u.email));
  
  if (newUsers.length > 0) {
    await knex('users').insert(newUsers);
    console.log(`Inserted ${newUsers.length} new users.`);
  } else {
    console.log('All seed users already exist, skipping.');
  }
}
