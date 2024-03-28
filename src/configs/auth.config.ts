import { ConfigService } from '@nestjs/config';

export const getAuthConfig = (configService: ConfigService) => ({
  secret: configService.get('JWT_SECRET'),
  signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
});
