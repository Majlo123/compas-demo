import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/controls/button/Button';
import Table, { Column, Row } from '@/components/controls/table/Table';
import PageLayout from '@/components/layout/PageLayout';
import TableIconEdit from '@/components/images/TableIconEdit';
import DialogTeamForm from '@/components/dialog/DialogTeamForm';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import { createTeam, getTeams, deleteTeam } from '@/api/team/team.actions';
import { isApiSuccess } from '@/api/shared.types';
interface TeamRow extends Row {
  name: string;
  memberCount: number;
}

const TeamsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<{ id: string; name: string } | null>(null);
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
      const response = await getTeams();

      if (isApiSuccess(response)) {
        const formattedData: TeamRow[] = response.content.data.map((team: any) => ({
          _id: team.id,
          name: team.name,
          memberCount: team.memberCount || 0,
        }));
        setTeams(formattedData);
      } else {
        setHasError(true);
        toast.error(response.error?.message || 'Failed to load projects.');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setHasError(true);
      toast.error('Failed to load projects. Please try again.');
      setIsLoading(false);
    }
  };

  const handleNewTeam = () => {
    setDialogOpen(true);
  };

  const handleFormSubmit = async (data: { name: string }) => {
    try {
      const response = await createTeam({ name: data.name, description: (data as any).description });

      if (isApiSuccess(response)) {
        toast.success(response.message || `Project "${data.name}" created successfully`);
        setDialogOpen(false);
        fetchTeams();
      } else {
        throw new Error(response.error?.message || 'Failed to create project');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create project');
      throw error;
    }
  };

  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      const response = await deleteTeam(teamToDelete.id);

      if (isApiSuccess(response)) {
        toast.success(response.message || `Project "${teamToDelete.name}" deleted successfully`);
        fetchTeams();
      } else {
        toast.error(response.error?.message || 'Failed to delete project.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project. Please try again.');
    } finally {
      setTeamToDelete(null);
    }
  };

  const columns: Column[] = [
    {
      accessor: 'name',
      header: 'Project Name',
    },
    {
      accessor: 'memberCount',
      header: 'Members',
      formatter: (value: number) => `${value} ${value === 1 ? 'member' : 'members'}`,
    },
    {
      accessor: 'actions',
      header: 'Actions',
      formatter: (_value: any, row: TeamRow) => (
        <div className="flex gap-2 items-center justify-center">
          <Button
            variant="edit"
            size="sm"
            onClick={() => navigate(`/team-details/${row._id}`)}
            Icon={TableIconEdit}
          >
            <span className='self-center'>Edit</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageLayout
        title="Projects"
        action={
          <Button onClick={handleNewTeam} className="text-lg font-medium">
            + New Project
          </Button>
        }
        actionPosition="inline"
        emptyMessage="No projects yet"
        emptyDescription="Click 'New Project' to create your first project"
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
        </PageLayout>
        <DialogTeamForm
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleFormSubmit}
        />
        <ConfirmDialog
          isOpen={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          title="Delete Project"
          message={`Are you sure you want to delete project "${teamToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={confirmDeleteTeam}
        />
      </>
  );
};

export default TeamsListPage;
