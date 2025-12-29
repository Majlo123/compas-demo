import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const TeamSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export const TeamListSchema = z.array(TeamSchema);

export const CreateTeamBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const CreateTeamSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  content: TeamSchema,
});

export const TeamMemberSchema = z.object({
  id: z.string().uuid(),
  teamId: z.string().uuid(),
  userId: z.string().uuid(),
  isManager: z.boolean().optional(),
  joinedAt: z.string().datetime(),
});

export const CreateTeamMemberBodySchema = z.object({
  userId: z.string().uuid(),
  isManager: z.boolean().optional(),
});

export const UpdateTeamMemberManagerSchema = z.object({
  isManager: z.boolean(),
});

export const BulkAddTeamMembersSchema = z.object({
  members: z.array(
    z.object({
      userId: z.string().uuid(),
      isManager: z.boolean().optional(),
    }),
  ),
});

export const BulkRemoveTeamMembersSchema = z.object({
  userIds: z.array(z.string().uuid()),
});

export const BulkUpdateTeamMembersManagerSchema = z.object({
  members: z.array(
    z.object({
      userId: z.string().uuid(),
      isManager: z.boolean(),
    }),
  ),
});

export const CreateTeamMemberSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  content: TeamMemberSchema,
});

export type TeamType = z.infer<typeof TeamSchema>;
export type CreateTeamBodyType = z.infer<typeof CreateTeamBodySchema>;
export type TeamMemberType = z.infer<typeof TeamMemberSchema>;
export type CreateTeamMemberBodyType = z.infer<typeof CreateTeamMemberBodySchema>;
