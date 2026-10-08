import { SetMetadata } from '@nestjs/common';

export const REQUIRE_CHURCH_SCOPE_KEY = 'require_church_scope';
export const RequireChurchScope = () => SetMetadata(REQUIRE_CHURCH_SCOPE_KEY, true);
