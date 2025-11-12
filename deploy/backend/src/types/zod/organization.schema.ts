import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { BaseResponseSchema, ContentResponseSchema } from 'types/zod/shared.schema';
import { z } from 'zod';

extendZodWithOpenApi(z);

const organizationBaseFields = {
  name: z.string().min(1, 'Organization name is required'),
  domain: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
};

const organizationSystemFields = {
  id: z.string(),
};

export const CreateOrganizationSchema = z.object(organizationBaseFields).openapi({
  description: 'Request body for creating an organization',
  example: {
    name: 'Acme Corp',
    domain: 'acme.com',
    address: '123 Market Street',
    email: 'info@acme.com',
    phone: '+1 555-123-4567',
  },
});

export const OrganizationSchema = z.object({
  ...organizationSystemFields,
  ...organizationBaseFields,
});

const exampleOrganization = {
  id: 'org1',
  name: 'Acme Corp',
  domain: 'acme.com',
  address: '123 Market Street',
  email: 'info@acme.com',
  phone: '+1 555-123-4567',
};

const exampleOrganizationArray = [
  exampleOrganization,
  {
    id: 'org2',
    name: 'Globex Ltd',
    domain: 'globex.com',
    address: '456 Elm Street',
    email: 'contact@globex.com',
    phone: '+1 555-987-6543',
  },
];

const exampleOrganizationUpdated = {
  ...exampleOrganization,
  name: 'Acme Corp Updated',
};

const organizationResponse = (
  description: string,
  example: z.infer<typeof OrganizationSchema>,
): typeof BaseResponseSchema =>
  ContentResponseSchema(z.object({ organization: OrganizationSchema })).openapi({
    description,
    example: {
      success: true,
      content: {
        organization: example,
      },
    },
  });

const organizationArrayResponse = (
  description: string,
  example: Array<z.infer<typeof OrganizationSchema>>,
): typeof BaseResponseSchema =>
  ContentResponseSchema(z.object({ organizations: z.array(OrganizationSchema) })).openapi({
    description,
    example: {
      success: true,
      content: {
        organizations: example,
      },
    },
  });

export const CreateOrganizationSuccessSchema = organizationResponse(
  'Successful response with created organization',
  exampleOrganization,
);

export const FindOrganizationByIdSuccessSchema = organizationResponse(
  'Successful response with organization details',
  exampleOrganization,
);

export const FindAllOrganizationsSuccessSchema = organizationArrayResponse(
  'Successful response with all organizations',
  exampleOrganizationArray,
);

export const UpdateOrganizationSuccessSchema = organizationResponse(
  'Successful response with updated organization',
  exampleOrganizationUpdated,
);

export const DeleteOrganizationSuccessSchema = organizationResponse(
  'Successful response with deleted organization',
  exampleOrganizationUpdated,
);
