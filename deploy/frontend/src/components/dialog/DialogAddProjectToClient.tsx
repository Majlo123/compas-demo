import { FC, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import CustomDialog from '@/components/dialog/dialog-props';
import Button from '@/components/controls/button/Button';
import { getUnassignedTeams } from '@/api/team/team.actions';
import { assignProjectToClient } from '@/api/client/client.actions';
import { isApiSuccess } from '@/api/shared.types';

type Project = {
  id: string;
  name: string;
  description?: string;
};

type DialogAddProjectToClientProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  clientId: string;
  onProjectAssigned?: () => void;
};

const DialogAddProjectToClient: FC<DialogAddProjectToClientProps> = ({ 
  isOpen, 
  onOpenChange, 
  clientId,
  onProjectAssigned,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUnassignedProjects();
    }
  }, [isOpen]);

  const fetchUnassignedProjects = async () => {
    setIsLoading(true);
    try {
      const response = await getUnassignedTeams();
      if (isApiSuccess(response)) {
        const data = response.content?.data || [];
        setProjects(data);
      } else {
        toast.error(response.error?.message || 'Failed to load projects');
      }
    } catch (error) {
      console.error('Error fetching unassigned projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((p) => 
      p.name.toLowerCase().includes(term) || 
      (p.description && p.description.toLowerCase().includes(term))
    );
  }, [projects, search]);

  const handleAssign = async () => {
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }

    setIsAssigning(true);
    try {
      const response = await assignProjectToClient(clientId, selectedProjectId);
      if (isApiSuccess(response)) {
        toast.success('Project assigned to client successfully');
        setSelectedProjectId('');
        setSearch('');
        onOpenChange(false);
        if (onProjectAssigned) {
          onProjectAssigned();
        }
      } else {
        toast.error(response.error?.message || 'Failed to assign project');
      }
    } catch (error) {
      console.error('Error assigning project:', error);
      toast.error('Failed to assign project');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedProjectId('');
    setSearch('');
    onOpenChange(false);
  };

  return (
    <CustomDialog
      title="Add Existing Project"
      description="Select an unassigned project to add to this client."
      isOpen={isOpen}
      onOpenChange={handleClose}
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div>
          <label htmlFor="project-search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Projects
          </label>
          <input
            id="project-search"
            type="text"
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg bg-transparent border-someGrey p-md text-p2 text-darkGrey"
          />
        </div>

        {/* Projects List */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Projects
          </label>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {search ? 'No projects match your search' : 'No unassigned projects available'}
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`p-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedProjectId === project.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="project-selection"
                          checked={selectedProjectId === project.id}
                          onChange={() => setSelectedProjectId(project.id)}
                          className="cursor-pointer"
                        />
                        <span className="font-medium text-gray-900">{project.name}</span>
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-500 mt-1 ml-6">{project.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssign}
            disabled={!selectedProjectId || isAssigning}
          >
            {isAssigning ? 'Assigning...' : 'Add Project'}
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
};

export default DialogAddProjectToClient;
