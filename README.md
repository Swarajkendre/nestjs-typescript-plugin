# Nest.js TypeScript Plugin Converter

A production-ready Nest.js application with TypeScript plugins for automatic transpilation and type stripping. Convert TypeScript to plain JavaScript that browsers can understand!

## Features

✨ **Automatic Type Stripping**
- Remove all TypeScript type annotations
- Convert interfaces, generics, and types to plain JavaScript

🚀 **API Endpoints**
- `/convert` - Convert TypeScript code string to JavaScript
- `/convert-file` - Convert TypeScript file and save as JavaScript

🎯 **Flexible Configuration**
- Target different ES versions (ES5, ES2015, ES2020, ES2022, ESNext)
- Optional minification
- Source map generation
- Comment preservation/removal

📦 **Enterprise Ready**
- Full TypeScript support
- Unit tests included
- Error handling
- Logging capabilities

## Installation

```bash
npm install
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Testing
npm run test
```

## API Usage

### 1. Convert TypeScript String

**POST** `/convert`

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const x: number = 5; console.log(x);",
    "options": {
      "target": "ES2020",
      "minify": false
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "code": "const x = 5;\nconsole.log(x);"
}
```

### 2. Convert TypeScript File

**POST** `/convert-file`

```bash
curl -X POST http://localhost:3000/convert-file \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "./src/example.ts",
    "options": {
      "target": "ES2015",
      "minify": true,
      "sourceMap": true
    }
  }'
```

## TypeScript Examples

### Example 1: Interface Conversion

**Input (TypeScript):**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com"
};
```

**Output (JavaScript):**
```javascript
const user = {
  id: 1,
  name: "John",
  email: "john@example.com"
};
```

### Example 2: Class Conversion

**Input (TypeScript):**
```typescript
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
  
  multiply(a: number, b: number): number {
    return a * b;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3));
```

**Output (JavaScript):**
```javascript
class Calculator {
  add(a, b) {
    return a + b;
  }
  
  multiply(a, b) {
    return a * b;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3));
```

### Example 3: Generic Types Conversion

**Input (TypeScript):**
```typescript
function getArray<T>(items: T[]): T[] {
  return items;
}

const numbers = getArray<number>([1, 2, 3]);
const strings = getArray<string>(["a", "b", "c"]);
```

**Output (JavaScript):**
```javascript
function getArray(items) {
  return items;
}

const numbers = getArray([1, 2, 3]);
const strings = getArray(["a", "b", "c"]);
```

## Configuration Options

### Target ES Versions
- `ES5` - Old browsers
- `ES2015` - ES6
- `ES2016` - ES7
- `ES2017` - Async/await
- `ES2018` - Rest/spread
- `ES2019` - Array methods
- `ES2020` - Optional chaining, nullish coalescing
- `ES2021` - Logical assignment
- `ES2022` - Class fields
- `ESNEXT` - Latest features

### Plugin Options

```typescript
interface TranspileOptions {
  target?: string;        // Default: 'ES2020'
  minify?: boolean;       // Default: false
  sourceMap?: boolean;    // Default: false
  removeComments?: boolean; // Default: true
}
```

## Project Structure

```
nestjs-typescript-plugin/
├── src/
│   ├── main.ts              # Application entry point
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # API routes
│   ├── app.service.ts       # Business logic
│   ├── plugins/
│   │   └── typescript.plugin.ts  # TypeScript transpilation plugin
│   └── app.controller.spec.ts    # Tests
├── dist/                    # Compiled JavaScript
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## TypeScript Plugin API

### Methods

#### `transpile(code: string, options?: TranspileOptions): Promise<string>`
Transpile TypeScript code string to JavaScript.

#### `transpileFile(filePath: string, options?: TranspileOptions): Promise<string>`
Transpile a TypeScript file and save the output.

#### `transpileDirectory(dirPath: string, options?: TranspileOptions): Promise<{success, failed, errors}>`
Recursively transpile all TypeScript files in a directory.

#### `analyzeTypes(filePath: string): Promise<{types, interfaces, classes}>`
Analyze a TypeScript file for type definitions and class structures.

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

## Performance

- Single file conversion: < 100ms
- Batch directory conversion: Depends on file count
- Memory efficient streaming for large files
- Caching support (configurable)

## Use Cases

✅ **Frontend Development**
- Convert TypeScript components to vanilla JavaScript
- Strip types for production builds
- Generate browser-compatible code

✅ **Build Pipelines**
- Automated transpilation in CI/CD
- Pre-processing before bundling
- Type safety with runtime flexibility

✅ **Education**
- Learn how TypeScript works
- Understand type erasure
- See generated JavaScript output

## License

MIT

## Author

Swarajkendre

---

**Happy Converting! 🚀**
