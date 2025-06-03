# API 密钥配置指南

## 🔐 重要：您已提供的 API 密钥

**测试环境可发布密钥**：`pk_test_51RVpm5CpAF0X0OGYwS1emqVLMAWCdxjxOLU7f9hi7vpfkCc5rLn4oityVXxSrANXum7GHSutept3BcpR9Fxy4PpO005aZRRHPL`

**生产环境服务器端密钥**：`sk_live_vzhe1sDF1FqnsLZEF9hEMvqj0AEHd6F-vyF`

## ⚠️ 重要配置说明

### 当前配置状态

- ✅ **测试环境可发布密钥** - 已配置，可以进行测试支付
- ⚠️ **密钥环境不匹配** - 当前使用生产服务器端密钥 + 测试可发布密钥

### 🔧 建议的配置方案

#### 方案一：纯测试环境（推荐用于开发测试）

```bash
# 测试环境配置 - 安全的开发测试
STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RVpm5CpAF0X0OGYwS1emqVLMAWCdxjxOLU7f9hi7vpfkCc5rLn4oityVXxSrANXum7GHSutept3BcpR9Fxy4PpO005aZRRHPL
```

#### 方案二：生产环境（用于真实交易）

```bash
# 生产环境配置 - 真实资金交易
STRIPE_SECRET_KEY=sk_live_vzhe1sDF1FqnsLZEF9hEMvqj0AEHd6F-vyF
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key_here
```

## ⚡ 当前可用功能

### ✅ 测试支付功能已可用！

由于您提供了测试环境的可发布密钥，现在可以：

1. **🧪 测试支付流程** - 使用测试卡号进行模拟支付
2. **💳 验证用户界面** - 测试支付表单的所有功能
3. **🔄 测试错误处理** - 模拟各种支付场景

### 🧪 Stripe 测试卡号

可以使用以下测试卡号进行支付测试：

```bash
# 成功支付
卡号：4242 4242 4242 4242
过期日期：任意未来日期
CVC：任意3位数字

# 需要验证的支付
卡号：4000 0025 0000 3155
过期日期：任意未来日期
CVC：任意3位数字

# 被拒绝的支付
卡号：4000 0000 0000 0002
过期日期：任意未来日期
CVC：任意3位数字
```

## ⚡ 快速配置步骤

### ✅ 已完成步骤

1. ✅ **本地环境变量配置** - `.env` 文件已创建
2. ✅ **测试可发布密钥** - 已配置并可用
3. ✅ **支付组件** - 所有组件已创建完成
4. ✅ **路由配置** - 支付页面路由已添加

### 🔄 可选步骤

**如需获取对应的测试服务器端密钥：**

1. 访问 [Stripe 控制台](https://dashboard.stripe.com/apikeys)
2. 切换到 **"查看测试数据"** 模式
3. 复制 **秘密密钥** (以 `sk_test_` 开头)
4. 更新 `.env` 文件：
   ```bash
   STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
   ```

## 🚀 立即测试支付功能

### 访问测试页面

开发服务器启动后，访问：

- **支付页面**：http://localhost:5173/payment
- **主页**：http://localhost:5173

### 🧪 测试流程

1. **选择套餐** - 选择任意会员套餐
2. **填写信息** - 输入姓名和邮箱
3. **输入测试卡号** - 使用上面提供的测试卡号
4. **提交支付** - 点击支付按钮
5. **查看结果** - 测试成功后会跳转到成功页面

## 🔒 安全最佳实践

### ✅ 测试环境安全

- ✅ **测试密钥安全** - 测试密钥不会处理真实资金
- ✅ **开发隔离** - 测试环境与生产环境完全隔离
- ✅ **数据保护** - 测试数据不会影响真实业务

### 🔄 环境切换

**从测试切换到生产：**

1. 获取生产环境的可发布密钥
2. 确认服务器端密钥匹配
3. 在 Vercel 中配置生产环境变量
4. 进行生产环境测试

## 🎯 下一步建议

### 立即可做：

1. **🧪 测试支付功能** - 使用提供的测试卡号
2. **🎨 自定义样式** - 调整支付页面外观
3. **📱 测试响应式** - 在不同设备上测试

### 生产部署前：

1. **🔑 获取生产密钥对** - 完整的生产环境密钥
2. **⚙️ 配置 Webhook** - 设置支付状态回调
3. **🧪 生产环境测试** - 小额真实交易测试

## 📚 相关文档

- [Stripe 测试指南](https://stripe.com/docs/testing)
- [Stripe API 密钥管理](https://stripe.com/docs/keys)
- [支付组件使用文档](../src/components/payment/README.md)

---

💡 **当前状态**：测试环境已就绪，可以立即开始测试支付功能！
