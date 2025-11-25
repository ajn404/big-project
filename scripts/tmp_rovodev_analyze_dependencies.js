#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 分析项目依赖大小...\n');

// 分析函数
function analyzePackageJson(filePath, projectName) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const deps = packageJson.dependencies || {};
    const devDeps = packageJson.devDependencies || {};
    
    console.log(`📦 ${projectName}:`);
    console.log(`   依赖数量: ${Object.keys(deps).length}`);
    console.log(`   开发依赖数量: ${Object.keys(devDeps).length}`);
    console.log(`   总依赖数量: ${Object.keys({...deps, ...devDeps}).length}`);
    
    // 分析大型依赖
    const heavyDeps = [
      '@react-three/fiber', '@react-three/drei', 'three',
      'react', 'react-dom', 'framer-motion',
      '@apollo/client', 'graphql',
      'katex', 'highlight.js', 'react-markdown',
      '@nestjs/core', '@nestjs/common', 'typeorm',
      'webpack', 'vite', 'typescript'
    ];
    
    const foundHeavy = [];
    heavyDeps.forEach(dep => {
      if (deps[dep] || devDeps[dep]) {
        foundHeavy.push(dep);
      }
    });
    
    if (foundHeavy.length > 0) {
      console.log(`   🐘 大型依赖: ${foundHeavy.join(', ')}`);
    }
    console.log('');
    
    return {
      dependencies: Object.keys(deps).length,
      devDependencies: Object.keys(devDeps).length,
      heavyDeps: foundHeavy
    };
  } catch (error) {
    console.error(`❌ 无法读取 ${filePath}:`, error.message);
    return null;
  }
}

// 分析各个项目
const projects = [
  { path: 'package.json', name: '根项目' },
  { path: 'apps/frontend/package.json', name: '前端' },
  { path: 'apps/backend/package.json', name: '后端' },
  { path: 'packages/ui-components/package.json', name: 'UI组件库' },
  { path: 'packages/shared-types/package.json', name: '共享类型' }
];

let totalDeps = 0;
let totalDevDeps = 0;
const allHeavyDeps = new Set();

projects.forEach(project => {
  if (fs.existsSync(project.path)) {
    const result = analyzePackageJson(project.path, project.name);
    if (result) {
      totalDeps += result.dependencies;
      totalDevDeps += result.devDependencies;
      result.heavyDeps.forEach(dep => allHeavyDeps.add(dep));
    }
  }
});

console.log('📊 总结:');
console.log(`   总依赖数量: ${totalDeps}`);
console.log(`   总开发依赖数量: ${totalDevDeps}`);
console.log(`   所有大型依赖: ${Array.from(allHeavyDeps).join(', ')}`);
console.log('');

// 分析node_modules大小
console.log('📁 目录大小分析:');
try {
  const rootSize = execSync('du -sh node_modules 2>/dev/null || echo "0M"', { encoding: 'utf8' }).trim();
  console.log(`   根目录node_modules: ${rootSize.split('\t')[0]}`);
  
  const frontendSize = execSync('du -sh apps/frontend/node_modules 2>/dev/null || echo "0M"', { encoding: 'utf8' }).trim();
  console.log(`   前端node_modules: ${frontendSize.split('\t')[0]}`);
  
  const backendSize = execSync('du -sh apps/backend/node_modules 2>/dev/null || echo "0M"', { encoding: 'utf8' }).trim();
  console.log(`   后端node_modules: ${backendSize.split('\t')[0]}`);
} catch (error) {
  console.log('   无法获取目录大小信息');
}

console.log('');
console.log('💡 优化建议:');
console.log('   1. 考虑移除不必要的依赖');
console.log('   2. 使用Tree Shaking减少打包大小');
console.log('   3. 考虑CDN加载大型库');
console.log('   4. 分析bundle大小找出重复依赖');
console.log('   5. 使用pnpm的严格模式避免幽灵依赖');

console.log('');
console.log('🚀 运行bundle分析:');
console.log('   前端: cd apps/frontend && pnpm run build:analyze');
console.log('   后端: cd apps/backend && pnpm run analyze');