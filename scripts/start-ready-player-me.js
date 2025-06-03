#!/usr/bin/env node

/**
 * Ready Player Me 用户管理系统启动脚本
 * 检查环境配置并启动服务
 */

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🚀 Ready Player Me 用户管理系统启动检查')
console.log('='.repeat(50))

// 检查环境文件
const envPath = join(projectRoot, '.env')
console.log('\n📁 检查环境配置:')

if (existsSync(envPath)) {
  console.log('✅ .env 文件已找到')

  try {
    const envContent = readFileSync(envPath, 'utf8')

    // 检查必要的环境变量
    const requiredVars = ['VITE_RPM_SUBDOMAIN', 'VITE_RPM_APPLICATION_ID', 'RPM_API_KEY']

    const missingVars = []

    requiredVars.forEach(varName => {
      if (!envContent.includes(varName)) {
        missingVars.push(varName)
      }
    })

    if (missingVars.length === 0) {
      console.log('✅ 所有必要环境变量已配置')
    } else {
      console.log('❌ 缺少以下环境变量:')
      missingVars.forEach(varName => {
        console.log(`   - ${varName}`)
      })
    }
  } catch (error) {
    console.log('❌ 无法读取 .env 文件:', error.message)
  }
} else {
  console.log('❌ .env 文件未找到')
  console.log('📝 请根据 config/env.example.md 创建 .env 文件')
}

// 检查必要文件
console.log('\n📂 检查项目文件:')

const requiredFiles = [
  'server/index.js',
  'server/api/ready-player-me.js',
  'src/services/readyPlayerMeApi.js',
  'src/components/AvatarCreator.vue',
]

requiredFiles.forEach(filePath => {
  const fullPath = join(projectRoot, filePath)
  if (existsSync(fullPath)) {
    console.log(`✅ ${filePath}`)
  } else {
    console.log(`❌ ${filePath} 未找到`)
  }
})

// 检查package.json脚本
console.log('\n📜 检查启动脚本:')

const packageJsonPath = join(projectRoot, 'package.json')
if (existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    const scripts = packageJson.scripts || {}

    const requiredScripts = ['server', 'server:dev', 'start', 'start:dev']

    requiredScripts.forEach(scriptName => {
      if (scripts[scriptName]) {
        console.log(`✅ npm run ${scriptName}`)
      } else {
        console.log(`❌ npm run ${scriptName} 未配置`)
      }
    })
  } catch (error) {
    console.log('❌ 无法读取 package.json:', error.message)
  }
} else {
  console.log('❌ package.json 未找到')
}

// 显示启动指令
console.log('\n🎯 启动指令:')
console.log('='.repeat(50))
console.log('1. 安装依赖:           npm install')
console.log('2. 配置环境变量:       复制 config/env.example.md 到 .env')
console.log('3. 启动开发服务器:     npm run start:dev')
console.log('4. 访问测试页面:       http://localhost:5175/avatar-test')

// 显示文档链接
console.log('\n📚 相关文档:')
console.log('- 环境配置: config/env.example.md')
console.log('- 完整指南: docs/Ready-Player-Me-访客账户管理.md')
console.log('- 使用指南: docs/Avatar3D使用指南.md')

console.log('\n✨ Ready Player Me 用户管理系统已准备就绪！')
console.log('🔗 Ready Player Me Studio: https://studio.readyplayer.me')
console.log('📖 官方文档: https://docs.readyplayer.me/')

process.exit(0)
