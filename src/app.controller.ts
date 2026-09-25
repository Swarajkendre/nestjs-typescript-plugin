import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeScriptPlugin } from './plugins/typescript.plugin';

interface ConvertRequest {
  code: string;
  options?: {
    target?: string;
    minify?: boolean;
  };
}

interface ConvertResponse {
  success: boolean;
  code?: string;
  error?: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly tsPlugin: TypeScriptPlugin,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('convert')
  async convertTypeScript(
    @Body() request: ConvertRequest,
  ): Promise<ConvertResponse> {
    try {
      const result = await this.tsPlugin.transpile(request.code, request.options);
      return {
        success: true,
        code: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Post('convert-file')
  async convertFile(
    @Body() request: { filePath: string; options?: any },
  ): Promise<ConvertResponse> {
    try {
      const result = await this.tsPlugin.transpileFile(
        request.filePath,
        request.options,
      );
      return {
        success: true,
        code: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
