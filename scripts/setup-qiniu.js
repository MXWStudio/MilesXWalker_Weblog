#!/usr/bin/env node

/**
 * 七牛云配置设置脚本
 * 自动配置qshell工具和验证配置
 * @author MilesXWalkerStudio
 * @version 1.0.0
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 配置常量
const QSHELL_PATH = '/Users/neo/Cursor project/qshell'
const CONFIG_FILE = path.join(__dirname, '../config/qiniu-cloud.env')
const ENV_FILE = path.join(__dirname, '../.env')

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

const log = (message, color = 'reset') => {
  console.log(colors[color] + message + colors.reset)
}

const success = message => log('✅ ' + message, 'green')
const error = message => log('❌ ' + message, 'red')
const warning = message => log('⚠️  ' + message, 'yellow')
const info = message => log('ℹ️  ' + message, 'blue')

// 检查qshell工具
function checkQshellTool() {
  info('检查qshell工具...')

  try {
    if (!fs.existsSync(QSHELL_PATH)) {
      error('qshell工具不存在于指定路径: ' + QSHELL_PATH)
      return false
    }

    // 检查qshell版本
    const version = execSync(`"${QSHELL_PATH}" version`, { encoding: 'utf8' })
    success(`qshell工具已找到，版本: ${version.trim()}`)
    return true
  } catch (err) {
    error('qshell工具检查失败: ' + err.message)
    return false
  }
}

// 配置qshell账户
function configureQshellAccount() {
  info('配置qshell账户...')

  try {
    // 检查当前账户状态
    try {
      const account = execSync(`"${QSHELL_PATH}" account`, { encoding: 'utf8' })
      success('qshell账户已配置:')
      console.log(account)
      return true
    } catch (err) {
      warning('qshell账户未配置，需要手动配置')

      // 提供配置指导
      log('\n请按以下步骤配置qshell账户:', 'cyan')
      log('1. 获取七牛云AccessKey和SecretKey:', 'yellow')
      log('   - 访问: https://portal.qiniu.com/user/key', 'yellow')
      log('   - 复制AccessKey和SecretKey', 'yellow')
      log('', 'reset')
      log('2. 执行以下命令配置账户:', 'yellow')
      log(`   "${QSHELL_PATH}" account <AccessKey> <SecretKey> <Name>`, 'yellow')
      log('   例如:', 'yellow')
      log(`   "${QSHELL_PATH}" account your_access_key your_secret_key myaccount`, 'yellow')
      log('', 'reset')

      return false
    }
  } catch (err) {
    error('配置qshell账户失败: ' + err.message)
    return false
  }
}

// 检查环境变量配置
function checkEnvConfiguration() {
  info('检查环境变量配置...')

  try {
    // 检查.env文件是否存在
    if (!fs.existsSync(ENV_FILE)) {
      warning('.env文件不存在，正在创建...')

      // 如果配置模板存在，复制内容
      if (fs.existsSync(CONFIG_FILE)) {
        const configContent = fs.readFileSync(CONFIG_FILE, 'utf8')
        fs.writeFileSync(ENV_FILE, configContent)
        success('.env文件已创建，请配置七牛云相关参数')
      } else {
        // 创建基础配置
        const basicConfig = `# 七牛云配置
QINIU_ACCESS_KEY=your_access_key_here
QINIU_SECRET_KEY=your_secret_key_here
QINIU_BUCKET=your_bucket_name_here
QINIU_DOMAIN=your_domain_here
VITE_QINIU_DOMAIN=your_domain_here
VITE_ENABLE_QINIU=true
`
        fs.writeFileSync(ENV_FILE, basicConfig)
        warning('.env文件已创建，请配置七牛云相关参数')
      }
    } else {
      success('.env文件已存在')
    }

    // 检查必要的环境变量
    const envContent = fs.readFileSync(ENV_FILE, 'utf8')
    const requiredVars = ['QINIU_ACCESS_KEY', 'QINIU_SECRET_KEY', 'QINIU_BUCKET', 'QINIU_DOMAIN']

    const missingVars = requiredVars.filter(varName => {
      const hasVar =
        envContent.includes(`${varName}=`) &&
        !envContent.includes(`${varName}=your_`) &&
        !envContent.includes(`${varName}=\n`)
      return !hasVar
    })

    if (missingVars.length > 0) {
      warning('以下环境变量需要配置:')
      missingVars.forEach(varName => {
        log(`  - ${varName}`, 'yellow')
      })
      return false
    } else {
      success('环境变量配置完整')
      return true
    }
  } catch (err) {
    error('检查环境变量配置失败: ' + err.message)
    return false
  }
}

// 测试七牛云连接
function testQiniuConnection() {
  info('测试七牛云连接...')

  try {
    // 读取环境变量
    require('dotenv').config({ path: ENV_FILE })

    const accessKey = process.env.QINIU_ACCESS_KEY
    const bucket = process.env.QINIU_BUCKET

    if (!accessKey || accessKey.includes('your_')) {
      warning('请先配置正确的环境变量')
      return false
    }

    // 使用qshell测试连接
    const listCommand = `"${QSHELL_PATH}" listbucket "${bucket}" --limit 1`
    const result = execSync(listCommand, { encoding: 'utf8' })

    success('七牛云连接测试成功')
    return true
  } catch (err) {
    error('七牛云连接测试失败: ' + err.message)

    // 提供调试信息
    log('\n可能的原因:', 'yellow')
    log('1. AccessKey或SecretKey配置错误', 'yellow')
    log('2. 存储空间名称错误', 'yellow')
    log('3. 存储空间不存在或无权限访问', 'yellow')
    log('4. 网络连接问题', 'yellow')

    return false
  }
}

// 创建存储空间（可选）
function createBucket() {
  info('检查存储空间...')

  try {
    require('dotenv').config({ path: ENV_FILE })
    const bucket = process.env.QINIU_BUCKET

    if (!bucket || bucket.includes('your_')) {
      warning('请先配置存储空间名称')
      return false
    }

    // 检查存储空间是否存在
    try {
      const listCommand = `"${QSHELL_PATH}" listbucket "${bucket}" --limit 1`
      execSync(listCommand, { encoding: 'utf8' })
      success(`存储空间 "${bucket}" 已存在且可访问`)
      return true
    } catch (err) {
      warning(`存储空间 "${bucket}" 不存在或无法访问`)

      log('\n请在七牛云控制台创建存储空间:', 'cyan')
      log('1. 访问: https://portal.qiniu.com/kodo/bucket', 'yellow')
      log('2. 点击"新建存储空间"', 'yellow')
      log(`3. 输入存储空间名称: ${bucket}`, 'yellow')
      log('4. 选择存储区域', 'yellow')
      log('5. 选择访问控制（建议选择"公开"用于图片等静态文件）', 'yellow')

      return false
    }
  } catch (err) {
    error('检查存储空间失败: ' + err.message)
    return false
  }
}

// 显示配置总结
function showConfigurationSummary() {
  log('\n' + '='.repeat(50), 'cyan')
  log('七牛云配置总结', 'cyan')
  log('='.repeat(50), 'cyan')

  try {
    require('dotenv').config({ path: ENV_FILE })

    const config = {
      qshell工具路径: QSHELL_PATH,
      AccessKey: process.env.QINIU_ACCESS_KEY ? '已配置' : '未配置',
      SecretKey: process.env.QINIU_SECRET_KEY ? '已配置' : '未配置',
      存储空间: process.env.QINIU_BUCKET || '未配置',
      访问域名: process.env.QINIU_DOMAIN || '未配置',
      功能开关: process.env.VITE_ENABLE_QINIU || 'false',
    }

    Object.entries(config).forEach(([key, value]) => {
      const color = value.includes('未配置') ? 'red' : 'green'
      log(`${key}: ${value}`, color)
    })
  } catch (err) {
    error('显示配置总结失败: ' + err.message)
  }

  log('='.repeat(50), 'cyan')
}

// 显示使用指南
function showUsageGuide() {
  log('\n' + '📖 使用指南', 'cyan')
  log('='.repeat(30), 'cyan')

  log('1. 启动开发服务器:', 'yellow')
  log('   npm run dev', 'green')
  log('', 'reset')

  log('2. 访问文件上传页面:', 'yellow')
  log('   http://localhost:5173/storage', 'green')
  log('', 'reset')

  log('3. 测试文件上传功能:', 'yellow')
  log('   - 拖拽文件到上传区域', 'green')
  log('   - 或点击选择文件按钮', 'green')
  log('', 'reset')

  log('4. 查看更多配置:', 'yellow')
  log('   - 编辑 .env 文件', 'green')
  log('   - 查看 config/qiniu-cloud.env 了解所有选项', 'green')
  log('', 'reset')

  log('相关文档:', 'yellow')
  log('- 七牛云控制台: https://portal.qiniu.com/', 'blue')
  log('- qshell工具文档: https://developer.qiniu.com/kodo/tools/1302/qshell', 'blue')
}

// 主函数
function main() {
  log('\n🚀 七牛云配置向导', 'magenta')
  log('='.repeat(40), 'magenta')

  let allPassed = true

  // 1. 检查qshell工具
  if (!checkQshellTool()) {
    allPassed = false
  }

  // 2. 配置qshell账户
  if (!configureQshellAccount()) {
    allPassed = false
  }

  // 3. 检查环境变量配置
  if (!checkEnvConfiguration()) {
    allPassed = false
  }

  // 4. 检查存储空间
  if (!createBucket()) {
    allPassed = false
  }

  // 5. 测试连接
  if (!testQiniuConnection()) {
    allPassed = false
  }

  // 显示总结
  showConfigurationSummary()

  if (allPassed) {
    success('\n🎉 七牛云配置完成！')
    showUsageGuide()
  } else {
    warning('\n⚠️  配置尚未完成，请根据上述提示进行配置')

    log('\n下次运行此脚本:', 'cyan')
    log('npm run setup:qiniu', 'green')
  }
}

// 运行主函数
if (require.main === module) {
  main()
}

module.exports = {
  checkQshellTool,
  configureQshellAccount,
  checkEnvConfiguration,
  testQiniuConnection,
  createBucket,
}
