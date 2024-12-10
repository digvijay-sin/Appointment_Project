import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy, JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
    imports: [
        JwtModule.register({
          secret: 'secretkey',
          signOptions: { expiresIn: '1min' },
        }),
        JwtModule.register({
          secret: 'refreshtoken', 
          signOptions: { expiresIn: '7d' }, 
        })
      ],
      providers: [JwtStrategy, JwtAuthGuard,JwtRefreshStrategy],
      exports: [JwtAuthGuard],
})
export class AuthModule {}
