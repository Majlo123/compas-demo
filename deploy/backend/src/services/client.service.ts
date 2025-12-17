import httpStatus from 'http-status';
import { Client } from '@shared/client.types';
import { clientRepository } from 'repos/index';
import { Client as ClientModel, CreateClient } from 'repos/client.model';
import QueryParams from 'repos/utils/query/QueryParams';
import { PaginatedResult } from 'repos/utils/pagination';
import ApiError from 'shared/error/ApiError';

export const listClients = async (query: QueryParams): Promise<PaginatedResult<Client>> => {
  const result = await clientRepository.findAll({ queryParams: query });
  const { teamRepository } = await import('repos/index');
  const allTeams = await teamRepository.findAll({ queryParams: {} as QueryParams });
  
  const clientsWithCounts = await Promise.all(
    result.data.map(async (client) => {
      const projectCount = allTeams.data.filter((team: any) => team.clientId === client.id).length;
      return {
        id: client.id!,
        name: client.name,
        hourlyRate: client.hourlyRate,
        projectCount,
      };
    })
  );
  
  return {
    ...result,
    data: clientsWithCounts,
  };
};

export const getClientById = async (id: string): Promise<Client> => {
  const client = await clientRepository.findById({ id });
  if (!client) {
    throw new ApiError('Client not found', httpStatus.NOT_FOUND);
  }
  return mapClientModelToClient(client);
};

export const createClient = async (data: { name: string; hourlyRate: number }): Promise<Client> => {
  const exists = await clientRepository.findByField('name', data.name);
  if (exists) {
    throw new ApiError('Client with this name already exists', httpStatus.CONFLICT);
  }
  const created = await clientRepository.create({
    name: data.name,
    hourlyRate: data.hourlyRate,
  } as CreateClient);
  return mapClientModelToClient(created);
};

export const updateClient = async (id: string, data: { name: string; hourlyRate: number }): Promise<Client> => {
  const client = await clientRepository.findById({ id });
  if (!client) {
    throw new ApiError('Client not found', httpStatus.NOT_FOUND);
  }
  const updated = await clientRepository.updateById(id, {
    name: data.name,
    hourlyRate: data.hourlyRate,
  } as Partial<ClientModel>);
  if (!updated) {
    throw new ApiError('Failed to update client', httpStatus.INTERNAL_SERVER_ERROR);
  }
  return mapClientModelToClient(updated);
};

export const listClientProjects = async (id: string) => {
  const client = await clientRepository.findById({ id });
  if (!client) {
    throw new ApiError('Client not found', httpStatus.NOT_FOUND);
  }
  const { teamRepository, teamMemberRepository } = await import('repos/index');
  // Get all teams and filter by clientId
  const allTeams = await teamRepository.findAll({ queryParams: {} as QueryParams });
  const clientTeams = allTeams.data.filter((team: any) => team.clientId === id);
  
  // Get member counts for each team
  const projectsWithMembers = await Promise.all(
    clientTeams.map(async (team: any) => {
      const members = await teamMemberRepository.findByTeamId(team.id);
      return {
        id: team.id,
        name: team.name,
        description: team.description,
        memberCount: members.length,
      };
    })
  );
  
  return projectsWithMembers;
};

export const assignProjectToClient = async (clientId: string, projectId: string) => {
  const client = await clientRepository.findById({ id: clientId });
  if (!client) {
    throw new ApiError('Client not found', httpStatus.NOT_FOUND);
  }
  
  const { teamRepository } = await import('repos/index');
  const project = await teamRepository.findById({ id: projectId });
  if (!project) {
    throw new ApiError('Project not found', httpStatus.NOT_FOUND);
  }
  
  if (project.clientId) {
    throw new ApiError('Project is already assigned to a client', httpStatus.CONFLICT);
  }
  
  await teamRepository.updateById(projectId, { clientId } as any);
  return { success: true };
};

export const unassignProjectFromClient = async (clientId: string, projectId: string) => {
  const client = await clientRepository.findById({ id: clientId });
  if (!client) {
    throw new ApiError('Client not found', httpStatus.NOT_FOUND);
  }
  
  const { teamRepository } = await import('repos/index');
  const project = await teamRepository.findById({ id: projectId });
  if (!project) {
    throw new ApiError('Project not found', httpStatus.NOT_FOUND);
  }
  
  if (project.clientId !== clientId) {
    throw new ApiError('Project is not assigned to this client', httpStatus.BAD_REQUEST);
  }
  
  await teamRepository.updateById(projectId, { clientId: null } as any);
  return { success: true };
};

const mapClientModelToClient = (model: ClientModel): Client => ({
  id: model.id!,
  name: model.name,
  hourlyRate: model.hourlyRate,
  projectCount: 0, // Can be calculated from teams/projects if needed
});
