import { Global, Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ChurchScopeGuard } from '../../common/guards/church-scope.guard';

@Global()
@Module({
  controllers: [IdentityController],
  providers: [IdentityService, AuthGuard, RolesGuard, ChurchScopeGuard],
  exports: [IdentityService, AuthGuard, RolesGuard, ChurchScopeGuard],
})
export class IdentityModule {}
