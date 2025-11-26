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
      // TODO: Replace with actual API call
      // const response = await getTeams();
      
      // Mock data for now
      setTimeout(() => {
        const mockTeams: Team[] = [
          { id: '1', name: 'Engineering', memberCount: 12 },
          { id: '2', name: 'Marketing', memberCount: 8 },
          { id: '3', name: 'Sales', memberCount: 15 },
        ];

        const formattedData: TeamRow[] = mockTeams.map((team) => ({
          _id: team.id,
          name: team.name,
          memberCount: team.memberCount,
        }));
        
        setTeams(formattedData);
        setIsLoading(false);
      }, 500);
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
      // TODO: Replace with actual API call
      // const response = await createTeam(data);
      
      console.log('Creating team:', data.name);
      toast.success(`Team "${data.name}" created successfully`);
      setDialogOpen(false);
      fetchTeams();
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
      // TODO: Replace with actual API call
      // const response = await deleteTeam(teamId);
      
      console.log('Deleting team:', teamId);
      toast.success(`Team "${teamName}" deleted successfully`);
      fetchTeams();
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
