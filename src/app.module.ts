import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeScriptPlugin } from './plugins/typescript.plugin';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TypeScriptPlugin],
})
export class AppModule {}
