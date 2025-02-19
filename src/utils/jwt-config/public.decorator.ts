import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 *跳出jwt验证
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
