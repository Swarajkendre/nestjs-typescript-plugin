import { Injectable } from '@nestjs/common';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface TranspileOptions {
  target?: string;
  minify?: boolean;
  sourceMap?: boolean;
  removeComments?: boolean;
}

@Injectable()
export class TypeScriptPlugin {
  /**
   * Transpile TypeScript code to JavaScript
   * Strips type annotations and converts to JavaScript
   */
  async transpile(
    code: string,
    options: TranspileOptions = {},
  ): Promise<string> {
    const {
      target = 'ES2020',
      minify = false,
      sourceMap = false,
      removeComments = true,
    } = options;

    const compilerOptions: ts.CompilerOptions = {
      target: this.getScriptTarget(target),
      module: ts.ModuleKind.CommonJS,
      removeComments: removeComments,
      sourceMap: sourceMap,
    };

    const result = ts.transpileModule(code, {
      compilerOptions,
    });

    return result.outputText;
  }

  /**
   * Transpile a TypeScript file to JavaScript
   */
  async transpileFile(
    filePath: string,
    options: TranspileOptions = {},
  ): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const code = fs.readFileSync(filePath, 'utf-8');
    const jsCode = await this.transpile(code, options);

    // Write to output file
    const outputPath = filePath.replace(/\.ts$/, '.js');
    fs.writeFileSync(outputPath, jsCode, 'utf-8');

    return jsCode;
  }

  /**
   * Transpile entire directory recursively
   */
  async transpileDirectory(
    dirPath: string,
    options: TranspileOptions = {},
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;
    let failed = 0;

    const processDirectory = (dir: string) => {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          processDirectory(filePath);
        } else if (file.endsWith('.ts') && !file.endsWith('.spec.ts')) {
          try {
            this.transpileFile(filePath, options);
            success++;
          } catch (error) {
            failed++;
            errors.push(
              `${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
          }
        }
      }
    };

    processDirectory(dirPath);
    return { success, failed, errors };
  }

  /**
   * Get TypeScript ScriptTarget from string
   */
  private getScriptTarget(target: string): ts.ScriptTarget {
    const targetMap: { [key: string]: ts.ScriptTarget } = {
      ES5: ts.ScriptTarget.ES5,
      ES2015: ts.ScriptTarget.ES2015,
      ES2016: ts.ScriptTarget.ES2016,
      ES2017: ts.ScriptTarget.ES2017,
      ES2018: ts.ScriptTarget.ES2018,
      ES2019: ts.ScriptTarget.ES2019,
      ES2020: ts.ScriptTarget.ES2020,
      ES2021: ts.ScriptTarget.ES2021,
      ES2022: ts.ScriptTarget.ES2022,
      ESNEXT: ts.ScriptTarget.ESNext,
    };

    return targetMap[target.toUpperCase()] || ts.ScriptTarget.ES2020;
  }

  /**
   * Analyze TypeScript file for types and interfaces
   */
  async analyzeTypes(filePath: string): Promise<any> {
    const code = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      code,
      ts.ScriptTarget.Latest,
      true,
    );

    const types: any[] = [];
    const interfaces: any[] = [];
    const classes: any[] = [];

    const visit = (node: ts.Node) => {
      if (ts.isInterfaceDeclaration(node)) {
        interfaces.push({
          name: node.name.text,
          members: node.members.length,
        });
      } else if (ts.isClassDeclaration(node)) {
        classes.push({
          name: node.name?.text,
          members: node.members.length,
        });
      } else if (ts.isTypeAliasDeclaration(node)) {
        types.push({
          name: node.name.text,
        });
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return { types, interfaces, classes };
  }
}
