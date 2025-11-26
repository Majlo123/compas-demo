import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import Table, { Column, Row } from '@/components/controls/table/Table';
import PageLayout from '@/components/layout/PageLayout';
import BadgeIconXCircle from '@/components/images/BadgeIconXCircle';
import StatusBadge from '@/components/controls/badge/StatusBadge';
import DialogTeamForm from '@/components/dialog/DialogTeamForm';

interface Team {
  id: string;
  name: string;
  memberCount: number;
}

interface TeamRow extends Row {
  name: string;
  memberCount: number;
}

const TeamsListPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const { getTeams } = await import('@/api/team/team.actions');
      const { isApiSuccess } = await import('@/api/shared.types');

      const response = await getTeams();

      if (isApiSuccess(response)) {
        const formattedData: TeamRow[] = response.content.data.map((team) => ({
          _id: team.id,
          name: team.name,
          memberCount: team.memberCount || 0,
        }));
        setTeams(formattedData);
      } else {
        setHasError(true);
        toast.error(response.error?.message || 'Failed to load teams.');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setHasError(true);
      toast.error('Failed to load teams. Please try again.');
      setIsLoading(false);
    }
  };

  const handleNewTeam = () => {
    setDialogOpen(true);
  };

  const handleFormSubmit = async (data: { name: string }) => {
    try {
      const { createTeam } = await import('@/api/team/team.actions');
      const { isApiSuccess } = await import('@/api/shared.types');

      const response = await createTeam({ name: data.name, description: (data as any).description });

      if (isApiSuccess(response)) {
        toast.success(response.message || `Team "${data.name}" created successfully`);
        setDialogOpen(false);
        fetchTeams();
      } else {
        toast.error(response.error?.message || 'Failed to create team');
        throw new Error(response.error?.message || 'Failed to create team');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create team');
      throw error;
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!window.confirm(`Are you sure you want to delete team "${teamName}"?`)) {
      return;
    }

    try {
      const { deleteTeam } = await import('@/api/team/team.actions');
      const { isApiSuccess } = await import('@/api/shared.types');

      const response = await deleteTeam(teamId);

      if (isApiSuccess(response)) {
        toast.success(response.message || `Team "${teamName}" deleted successfully`);
        fetchTeams();
      } else {
        toast.error(response.error?.message || 'Failed to delete team.');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Failed to delete team. Please try again.');
    }
  };

  const columns: Column[] = [
    {
      accessor: 'name',
      header: 'Team Name',
    },
    {
      accessor: 'memberCount',
      header: 'Members',
      formatter: (value: number) => `${value} ${value === 1 ? 'member' : 'members'}`,
    },
    {
      accessor: 'actions',
      header: 'Actions',
      formatter: (_value: any, row: any) => (
        <div className="flex gap-2 items-center justify-center">
          <div
            onClick={() => handleDeleteTeam(row._id, row.name)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            title="Delete team"
          >
            <StatusBadge status="declined" className="rounded-md">
              <BadgeIconXCircle className="w-4 h-4" />
              <span className="text-sm font-medium ml-1">Delete</span>
            </StatusBadge>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Teams"
      action={
        <Button onClick={handleNewTeam} className="text-lg font-medium">
          + New Team
        </Button>
      }
      actionPosition="inline"
      emptyMessage="No teams yet"
      emptyDescription="Click 'New Team' to create your first team"
      isLoading={isLoading}
      hasError={hasError}
      isEmpty={teams.length === 0}
      onRetry={fetchTeams}
    >
      <Table
        columns={columns}
        data={teams}
        tableClassName="text-p2 lg:text-p1"
        headerClassName="text-p2 lg:text-p1 font-bold"
        cellClassName="text-p2 lg:text-p1"
      />
      <DialogTeamForm
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleFormSubmit}
      />
    </PageLayout>
  );
};

export default TeamsListPage;
