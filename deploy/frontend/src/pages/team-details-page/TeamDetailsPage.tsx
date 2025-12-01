import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import Checkbox from '@/components/controls/Checkbox';
import Table, { Column, Row } from '@/components/controls/table/Table';
import PageLayout from '@/components/layout/PageLayout';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import DialogTeamDetailsForm from '@/components/dialog/DialogTeamDetailsForm';
import ManagerBadgeIcon from '@/components/images/ManagerBadgeIcon';
import { getTeam, listTeamMembers, bulkRemoveTeamMembers, bulkUpdateTeamMembersManager, deleteTeam } from '@/api/team/team.actions';
import { isApiSuccess } from '@/api/shared.types';

interface TeamMember extends Row {
  id: string;
  fullName: string;
  email: string;
  isManager: boolean;
}

const TeamDetailsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  
  const [teamName, setTeamName] = useState<string>('');
  const [teamDescription, setTeamDescription] = useState<string>('');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [deleteSelectedDialogOpen, setDeleteSelectedDialogOpen] = useState(false);
  const [setManagerDialogOpen, setSetManagerDialogOpen] = useState(false);
  const [deleteTeamDialogOpen, setDeleteTeamDialogOpen] = useState(false);

  useEffect(() => {
    if (!teamId) {
      navigate('/teams-list');
      return;
    }
    fetchTeamData();
  }, [teamId]);

  const fetchTeamData = async () => {
    if (!teamId) return;

    setIsLoading(true);
    setHasError(false);

    try {
      const [teamResponse, membersResponse] = await Promise.all([
        getTeam(teamId),
        listTeamMembers(teamId)
      ]);

      if (teamResponse.success && teamResponse.content) {
        setTeamName(teamResponse.content.name);
        setTeamDescription(teamResponse.content.description);
      } else {
        toast.error('Failed to load team details');
        setHasError(true);
      }

      if (isApiSuccess(membersResponse)) {
        const formattedMembers = membersResponse.content.map((member: any) => ({
          _id: member.userId,
          id: member.userId,
          fullName: member.fullName || 'Unknown User',
          email: member.email || '',
          isManager: member.isManager || false,
        }));
        setMembers(formattedMembers);
      } else {
        toast.error('Failed to load team members');
      }
    } catch (error) {
      toast.error('An error occurred while loading team data');
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    console.log('selectedMembers: ', selectedMembers);
    setAddUserDialogOpen(true);
  };

  const handleAddUserSubmit = async (data: { userId: string; isManager: boolean }) => {
    toast.success(`User added as ${data.isManager ? 'team manager' : 'team member'}`);
  };

  const handleAddUserSuccess = () => {
    fetchTeamData();
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    setMemberToRemove({ id: memberId, name: memberName });
    setConfirmDialogOpen(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove || !teamId) return;

    try {
      const response = await bulkRemoveTeamMembers(teamId, [memberToRemove.id]);
      if (isApiSuccess(response)) {
        setMembers(members.filter(m => m.id !== memberToRemove.id));
        toast.success(`Member "${memberToRemove.name}" removed successfully`);
      } else {
        toast.error('Failed to remove member');
      }
    } catch (error) {
      toast.error('An error occurred while removing member');
    }
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
    if (!teamId) return;

    try {
      const userIds = Array.from(selectedMembers);
      const response = await bulkRemoveTeamMembers(teamId, userIds);
      if (isApiSuccess(response)) {
        setMembers(members.filter(m => !selectedMembers.has(m.id)));
        toast.success(`${selectedMembers.size} member(s) deleted`);
        setSelectedMembers(new Set());
      } else {
        toast.error('Failed to delete members');
      }
    } catch (error) {
      toast.error('An error occurred while deleting members');
    }
  };

  const handleSetManager = () => {
    if (selectedMembers.size === 0) {
      toast.warning('Please select a member to set as manager');
      return;
    }
    setSetManagerDialogOpen(true);
  };

  const confirmSetManager = async () => {
    if (!teamId) return;

    try {
      const selectedMemberIds = Array.from(selectedMembers);
      const updates = selectedMemberIds.map(userId => ({ userId, isManager: true }));
      
      const response = await bulkUpdateTeamMembersManager(teamId, updates);
      
      if (isApiSuccess(response)) {
        setMembers(members.map(m => 
          selectedMembers.has(m.id) ? { ...m, isManager: true } : m
        ));
        toast.success(`${selectedMembers.size} member(s) set as team manager successfully`);
        setSelectedMembers(new Set());
      } else {
        toast.error('Failed to set team manager');
      }
    } catch (error) {
      toast.error('An error occurred while setting team manager');
    }
  };

  const handleDeleteTeam = () => {
    setDeleteTeamDialogOpen(true);
  };

  const confirmDeleteTeam = async () => {
    if (!teamId) return;

    try {
      const response = await deleteTeam(teamId);
      if (isApiSuccess(response)) {
        toast.success('Team deleted successfully');
        navigate('/teams-list');
      } else {
        toast.error('Failed to delete team');
      }
    } catch (error) {
      toast.error('An error occurred while deleting team');
    }
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
          <div className="flex items-center gap-2">
            <span>{row.fullName}</span>
            {row.isManager && (
              <span title="Manager">
                <ManagerBadgeIcon className="text-yellow-500" />
              </span>
            )}
          </div>
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
        description={teamDescription}
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
        isLoading={isLoading}
        hasError={hasError}
        isEmpty={members.length === 0}
      >

        <div className={`flex gap-2 mt-[-15px] ${selectedMembers.size === 0 ? 'invisible' : 'visible'}`}>
          <Button
            variant="delete"
            size="sm"
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </Button>
          <Button
            className='text-primary'
            variant="secondary"
            size="sm"
            onClick={handleSetManager}
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
        message={`Are you sure you want to set the selected ${selectedMembers.size} member as team manager?`}
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
        onSuccess={handleAddUserSuccess}
      />
    </>
  );
};

export default TeamDetailsPage;
