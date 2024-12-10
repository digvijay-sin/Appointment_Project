import { SetMetadata } from '@nestjs/common';
import { Roles } from './roles.enum';


export const RolesDecorator= (...roles: Roles[]) => SetMetadata('roles', roles);
