import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Get user IDs
  const users = await knex('users').select('id', 'email');
  const userMap = new Map(users.map(u => [u.email, u.id]));

  // Check existing leave requests
  const existingCount = await knex('leave_requests').count('id as count').first();
  if (existingCount && Number(existingCount.count) > 0) {
    console.log('Leave requests already exist, skipping seed.');
    return;
  }

  const leaveRequests: any[] = [];

  // Test User leave requests
  const testUserId = userMap.get('test@example.com');
  if (testUserId) {
    leaveRequests.push(
      { user_id: testUserId, type: 'vacation', start_date: '2025-12-23', end_date: '2025-12-30', status: 'pending', reason: 'Christmas vacation' },
      { user_id: testUserId, type: 'sick', start_date: '2025-11-10', end_date: '2025-11-11', status: 'approved', reason: 'Flu symptoms' },
      { user_id: testUserId, type: 'personal', start_date: '2025-10-15', end_date: '2025-10-15', status: 'declined', reason: 'Personal appointment' },
      { user_id: testUserId, type: 'vacation', start_date: '2025-10-01', end_date: '2025-10-05', status: 'approved', reason: 'Fall break' },
      { user_id: testUserId, type: 'vacation', start_date: '2026-06-15', end_date: '2026-06-22', status: 'pending', reason: 'Summer vacation' },
      { user_id: testUserId, type: 'sick', start_date: '2025-08-05', end_date: '2025-08-06', status: 'approved', reason: 'Doctor appointment' }
    );
  }

  // John Smith leave requests
  const johnId = userMap.get('john.smith@example.com');
  if (johnId) {
    leaveRequests.push(
      { user_id: johnId, type: 'vacation', start_date: '2025-12-23', end_date: '2025-12-30', status: 'pending', reason: 'Holiday vacation' },
      { user_id: johnId, type: 'sick', start_date: '2025-11-10', end_date: '2025-11-11', status: 'approved', reason: 'Medical appointment' },
      { user_id: johnId, type: 'personal', start_date: '2025-10-15', end_date: '2025-10-15', status: 'declined', reason: 'Personal matter' },
      { user_id: johnId, type: 'vacation', start_date: '2026-01-05', end_date: '2026-01-10', status: 'pending', reason: 'New year break' },
      { user_id: johnId, type: 'other', start_date: '2025-09-20', end_date: '2025-09-22', status: 'approved', reason: 'Conference attendance' }
    );
  }

  // Sarah Johnson leave requests
  const sarahId = userMap.get('sarah.johnson@example.com');
  if (sarahId) {
    leaveRequests.push(
      { user_id: sarahId, type: 'vacation', start_date: '2025-12-15', end_date: '2025-12-22', status: 'approved', reason: 'Winter holidays' },
      { user_id: sarahId, type: 'sick', start_date: '2025-11-05', end_date: '2025-11-06', status: 'approved', reason: 'Cold and fever' },
      { user_id: sarahId, type: 'personal', start_date: '2025-11-25', end_date: '2025-11-25', status: 'pending', reason: 'Family event' },
      { user_id: sarahId, type: 'vacation', start_date: '2026-02-10', end_date: '2026-02-14', status: 'pending', reason: 'Ski trip' },
      { user_id: sarahId, type: 'other', start_date: '2025-10-01', end_date: '2025-10-01', status: 'declined', reason: 'Moving day' }
    );
  }

  // Michael Brown leave requests
  const michaelId = userMap.get('michael.brown@example.com');
  if (michaelId) {
    leaveRequests.push(
      { user_id: michaelId, type: 'vacation', start_date: '2025-11-28', end_date: '2025-12-01', status: 'approved', reason: 'Thanksgiving break' },
      { user_id: michaelId, type: 'sick', start_date: '2025-10-20', end_date: '2025-10-21', status: 'approved', reason: 'Stomach flu' },
      { user_id: michaelId, type: 'personal', start_date: '2025-12-05', end_date: '2025-12-05', status: 'pending', reason: 'Car service appointment' },
      { user_id: michaelId, type: 'vacation', start_date: '2026-03-15', end_date: '2026-03-20', status: 'pending', reason: 'Spring break' },
      { user_id: michaelId, type: 'other', start_date: '2025-09-10', end_date: '2025-09-11', status: 'declined', reason: 'Personal project' }
    );
  }

  // Emily Davis leave requests
  const emilyId = userMap.get('emily.davis@example.com');
  if (emilyId) {
    leaveRequests.push(
      { user_id: emilyId, type: 'vacation', start_date: '2025-12-20', end_date: '2025-12-27', status: 'pending', reason: 'Christmas with family' },
      { user_id: emilyId, type: 'sick', start_date: '2025-11-12', end_date: '2025-11-13', status: 'approved', reason: 'Dental procedure' },
      { user_id: emilyId, type: 'personal', start_date: '2025-10-25', end_date: '2025-10-25', status: 'approved', reason: 'Wedding attendance' },
      { user_id: emilyId, type: 'vacation', start_date: '2026-04-05', end_date: '2026-04-12', status: 'pending', reason: 'Easter vacation' },
      { user_id: emilyId, type: 'other', start_date: '2025-09-15', end_date: '2025-09-16', status: 'declined', reason: 'Home renovation' }
    );
  }

  // David Wilson leave requests
  const davidId = userMap.get('david.wilson@example.com');
  if (davidId) {
    leaveRequests.push(
      { user_id: davidId, type: 'vacation', start_date: '2025-11-18', end_date: '2025-11-22', status: 'approved', reason: 'Long weekend trip' },
      { user_id: davidId, type: 'sick', start_date: '2025-10-30', end_date: '2025-10-31', status: 'approved', reason: 'Back pain treatment' },
      { user_id: davidId, type: 'personal', start_date: '2025-12-10', end_date: '2025-12-10', status: 'pending', reason: 'School event' },
      { user_id: davidId, type: 'vacation', start_date: '2026-05-01', end_date: '2026-05-05', status: 'pending', reason: 'May holiday' },
      { user_id: davidId, type: 'other', start_date: '2025-09-25', end_date: '2025-09-26', status: 'declined', reason: 'Volunteer work' }
    );
  }

  if (leaveRequests.length > 0) {
    await knex('leave_requests').insert(leaveRequests);
    console.log(`Inserted ${leaveRequests.length} leave requests.`);
  }
}
