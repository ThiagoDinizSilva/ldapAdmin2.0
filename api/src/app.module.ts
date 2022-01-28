import { Module } from '@nestjs/common';
import { AuthModule } from './models/auth';
import { GrupoModule } from './models/grupo/grupo.module';
import { UsuarioModule } from './models/usuario/usuario.module';

@Module({
  imports: [UsuarioModule, GrupoModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
