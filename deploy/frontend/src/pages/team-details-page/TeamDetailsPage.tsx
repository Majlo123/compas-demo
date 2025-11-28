import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import Table, { Column, Row } from '@/components/controls/table/Table';
import PageLayout from '@/components/layout/PageLayout';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import CustomDialog from '@/components/dialog/dialog-props';

interface TeamMember extends Row {
  id: string;
  fullName: string;
  email: string;
  isManager: boolean;
}

const TeamDetailsPage: React.FC = () => {
  const [teamName] = useState<string>('Development Team');
  const [teamDescription] = useState<string>('Core development team responsible for building new features');
  const [members, setMembers] = useState<TeamMember[]>([
    {
      _id: '1',
      id: '1',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      isManager: true,
    },
    {
      _id: '2',
      id: '2',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      isManager: false,
    },
    {
      _id: '3',
      id: '3',
      fullName: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      isManager: false,
    },
  ]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTeamManager, setIsTeamManager] = useState(false);

  const handleAddUser = () => {
    setAddUserDialogOpen(true);
  };

  const handleAddUserSubmit = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a user name or email');
      return;
    }

    // TODO: Implement actual user search and add logic
    toast.success(`User "${searchQuery}" added as ${isTeamManager ? 'team manager' : 'team member'}`);
    setAddUserDialogOpen(false);
    setSearchQuery('');
    setIsTeamManager(false);
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    setMemberToRemove({ id: memberId, name: memberName });
    setConfirmDialogOpen(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;

    setMembers(members.filter(m => m.id !== memberToRemove.id));
    toast.success(`Member "${memberToRemove.name}" removed successfully`);
    setMemberToRemove(null);
  };

  const columns: Column[] = [
    {
      accessor: 'fullName',
      header: 'User Name',
    },
    {
      accessor: 'email',
      header: 'Email',
    },
    {
      accessor: 'actions',
      header: 'Actions',
      formatter: (_value: any, row: any) => (
        <div className="flex gap-2 items-center justify-center">
          <Button
            variant="delete"
            size="sm"
            onClick={() => handleRemoveMember(row.id, row.fullName)}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageLayout
        title={teamName}
        action={
          <Button onClick={handleAddUser} className="text-lg font-medium">
            + Add User
          </Button>
        }
        actionPosition="inline"
        emptyMessage="No team members yet"
        emptyDescription="Add members to this team to get started"
        isLoading={false}
        hasError={false}
        isEmpty={members.length === 0}
      >
        {teamDescription && (
          <div className="mb-6 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{teamDescription}</p>
          </div>
        )}
        
        <Table
          columns={columns}
          data={members}
          tableClassName="text-p2 lg:text-p1"
          headerClassName="text-p2 lg:text-p1 font-bold"
          cellClassName="text-p2 lg:text-p1"
        />
      </PageLayout>
      
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Remove Team Member"
        message={`Are you sure you want to remove "${memberToRemove?.name}" from this team? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmRemoveMember}
      />

      <CustomDialog
        title="Add User to Team"
        isOpen={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="userSearch" className="block text-sm font-semibold text-gray-700 mb-2">
              Find User
            </label>
            <input
              id="userSearch"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isManager"
              type="checkbox"
              checked={isTeamManager}
              onChange={(e) => setIsTeamManager(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isManager" className="text-sm font-medium text-gray-700 cursor-pointer">
              Is Team Manager
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setAddUserDialogOpen(false);
                setSearchQuery('');
                setIsTeamManager(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUserSubmit}>
              Add User
            </Button>
          </div>
        </div>
      </CustomDialog>
    </>
  );
};

export default TeamDetailsPage;
