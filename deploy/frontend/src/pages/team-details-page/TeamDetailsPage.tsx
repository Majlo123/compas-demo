import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import Checkbox from '@/components/controls/Checkbox';
import Table, { Column, Row } from '@/components/controls/table/Table';
import PageLayout from '@/components/layout/PageLayout';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import DialogTeamDetailsForm from '@/components/dialog/DialogTeamDetailsForm';

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
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [deleteSelectedDialogOpen, setDeleteSelectedDialogOpen] = useState(false);
  const [setManagerDialogOpen, setSetManagerDialogOpen] = useState(false);
  const [deleteTeamDialogOpen, setDeleteTeamDialogOpen] = useState(false);

  const handleAddUser = () => {
    setAddUserDialogOpen(true);
  };

  const handleAddUserSubmit = async (data: { userId: string; isManager: boolean }) => {
    toast.success(`User added as ${data.isManager ? 'team manager' : 'team member'}`);
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

  const handleCheckboxChange = (memberId: string) => {
    setSelectedMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedMembers.size === 0) {
      toast.warning('Please select members to delete');
      return;
    }
    setDeleteSelectedDialogOpen(true);
  };

  const confirmDeleteSelected = async () => {
    setMembers(members.filter(m => !selectedMembers.has(m.id)));
    toast.success(`${selectedMembers.size} member(s) deleted`);
    setSelectedMembers(new Set());
  };

  const handleSetManager = () => {
    if (selectedMembers.size === 0) {
      toast.warning('Please select a member to set as manager');
      return;
    }
    if (selectedMembers.size > 1) {
      toast.warning('Please select only one member to set as manager');
      return;
    }
    setSetManagerDialogOpen(true);
  };

  const confirmSetManager = async () => {
    const selectedMemberId = Array.from(selectedMembers)[0];
    const selectedMember = members.find(m => m.id === selectedMemberId);
    toast.success(`${selectedMember?.fullName} set as team manager successfully`);
    setSelectedMembers(new Set());
  };

  const handleDeleteTeam = () => {
    setDeleteTeamDialogOpen(true);
  };

  const confirmDeleteTeam = async () => {
    // TODO: Implement delete team
    toast.success('Team deleted successfully');
  };

  const columns: Column[] = [
    {
      accessor: 'fullName',
      header: 'User Name',
      formatter: (_value: any, row: any) => (
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selectedMembers.has(row.id)}
            onChange={() => handleCheckboxChange(row.id)}
          />
          <span>{row.fullName}</span>
        </div>
      ),
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
          <div className="flex gap-4">
            <Button variant='delete' className="text-lg font-medium" onClick={handleDeleteTeam}>
              Delete Team
            </Button>
            <Button onClick={handleAddUser} className="text-lg font-medium">
              + Add User
            </Button>
          </div>
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

        <div className="flex gap-2">
          <Button
            variant="delete"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={selectedMembers.size === 0}
          >
            Delete Selected
          </Button>
          <Button
            className='text-primary'
            variant="secondary"
            size="sm"
            onClick={handleSetManager}
            disabled={selectedMembers.size === 0}
          >
            Set Manager
          </Button>
        </div>

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

      <ConfirmDialog
        isOpen={deleteSelectedDialogOpen}
        onOpenChange={setDeleteSelectedDialogOpen}
        title="Delete Selected Members"
        message={`Are you sure you want to delete ${selectedMembers.size} selected member(s)? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDeleteSelected}
      />

      <ConfirmDialog
        isOpen={setManagerDialogOpen}
        onOpenChange={setSetManagerDialogOpen}
        title="Set Team Manager"
        message={`Are you sure you want to set the selected member as team manager?`}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="primary"
        onConfirm={confirmSetManager}
      />

      <ConfirmDialog
        isOpen={deleteTeamDialogOpen}
        onOpenChange={setDeleteTeamDialogOpen}
        title="Delete Team"
        message={`Are you sure you want to delete "${teamName}"? This will remove all team members and cannot be undone.`}
        confirmText="Delete Team"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDeleteTeam}
      />

      <DialogTeamDetailsForm
        isOpen={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        onSubmit={handleAddUserSubmit}
      />
    </>
  );
};

export default TeamDetailsPage;
