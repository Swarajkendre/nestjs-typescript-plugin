import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeScriptPlugin } from './plugins/typescript.plugin';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let tsPlugin: TypeScriptPlugin;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, TypeScriptPlugin],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    tsPlugin = app.get<TypeScriptPlugin>(TypeScriptPlugin);
  });

  describe('root', () => {
    it('should return welcome message', () => {
      expect(appController.getHello()).toBe(
        'Welcome to Nest.js TypeScript Plugin Converter',
      );
    });
  });

  describe('convertTypeScript', () => {
    it('should convert TypeScript to JavaScript', async () => {
      const tsCode = 'const x: number = 5; console.log(x);';
      const result = await appController.convertTypeScript({
        code: tsCode,
      });

      expect(result.success).toBe(true);
      expect(result.code).toContain('const x = 5');
    });

    it('should handle errors', async () => {
      const result = await appController.convertTypeScript({
        code: 'invalid {{',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
