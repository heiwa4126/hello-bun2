import { build } from "bun";
import dts from "bun-plugin-dts";

import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

// Windowsで `rm -rf ./dist && mkdir -p ./dist &&...` ができないのでTypeScriptで

// ディレクトリパスの定義
const distPath = join(__dirname, "dist");

try {
	// ディレクトリの削除
	rmSync(distPath, { recursive: true, force: true });
	console.log(`Deleted directory: ${distPath}`);
} catch (err) {
	console.error(`Error deleting directory: ${err}`);
}

try {
	// ディレクトリの作成
	mkdirSync(distPath, { recursive: true });
	console.log(`Created directory: ${distPath}`);
} catch (err) {
	console.error(`Error creating directory: ${err}`);
}

async function buildProject() {
	// ESM build
	await build({
		entrypoints: ["./src/index.ts"],
		outdir: "./dist/esm",
		format: "esm",
		target: "node",
		minify: true,
		splitting: true,
		external: ["./node_modules"],
		plugins: [dts()],
	});

	// CJS build with TypeScript compiler
	// Unfortunately bun doesn't support CJS yet.

	console.log("Build completed successfully!");
}

buildProject().catch(console.error);
