# 🧪 支付功能测试指南

## ✅ 测试环境就绪！

您的 Stripe 支付系统现在已经完全配置完成，可以立即开始测试！

### 🔐 当前配置状态

- ✅ **测试可发布密钥**: `pk_test_51RVpm5CpAF0X0OGYwS1emqVLMAWCdxjxOLU7f9hi7vpfkCc5rLn4oityVXxSrANXum7GHSutept3BcpR9Fxy4PpO005aZRRHPL`
- ✅ **服务器端密钥**: 已配置 (混合模式)
- ✅ **前端组件**: 支付表单、成功页面已创建
- ✅ **后端API**: 支付处理端点已创建
- ✅ **路由配置**: 支付页面路由已添加

## 🚀 立即开始测试

### 1. 启动开发服务器

```bash
# 启动完整的开发环境（前端 + 后端）
npm run start

# 或者分别启动
npm run dev      # 前端 (localhost:5173)
npm run server   # 后端 (localhost:3000)
```

### 2. 访问测试页面

- **🏠 主页**: http://localhost:5173
- **💳 支付页面**: http://localhost:5173/payment
- **📊 API健康检查**: http://localhost:3000/api/payment/health
- **🧪 测试卡信息**: http://localhost:3000/api/payment/payment-methods

### 3. 执行支付测试

#### 🧪 测试卡号（推荐使用）

| 卡号                  | 用途       | 期望结果                  |
| --------------------- | ---------- | ------------------------- |
| `4242 4242 4242 4242` | 成功支付   | ✅ 支付成功，跳转成功页面 |
| `4000 0000 0000 0002` | 被拒绝的卡 | ❌ 显示"卡被拒绝"错误     |
| `4000 0025 0000 3155` | 需要验证   | 🔄 需要额外验证步骤       |

#### 📝 测试表单信息

- **过期日期**: 任意未来日期 (如: 12/25)
- **CVC**: 任意3位数字 (如: 123)
- **姓名**: 任意姓名
- **邮箱**: 任意有效邮箱格式

#### 🔄 完整测试流程

1. **选择套餐**

   - 访问 http://localhost:5173/payment
   - 选择任意会员套餐（月度/年度/终身）
   - 确认价格显示正确

2. **填写支付信息**

   - 输入测试卡号：`4242 4242 4242 4242`
   - 填写过期日期：`12/25`
   - 输入CVC：`123`
   - 填写姓名和邮箱

3. **提交支付**

   - 点击"立即支付"按钮
   - 观察加载状态和处理过程
   - 等待支付结果

4. **验证结果**
   - 成功：跳转到支付成功页面
   - 失败：显示错误信息

## 🛠️ 故障排除

### ❌ 常见问题及解决方案

#### Q1: 支付表单无法加载

```bash
# 检查前端服务器
curl http://localhost:5173

# 检查后端API
curl http://localhost:3000/api/payment/health
```

**解决方案**:

- 确保两个服务器都在运行
- 检查端口是否被占用
- 重启开发服务器

#### Q2: "Stripe 可发布密钥未配置"错误

**解决方案**:

- 检查 `.env` 文件中的配置
- 确保 `VITE_STRIPE_PUBLISHABLE_KEY` 已正确设置
- 重启开发服务器使环境变量生效

#### Q3: API调用失败

```bash
# 测试API连接
curl -X POST http://localhost:3000/api/payment/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "currency": "usd"}'
```

**解决方案**:

- 检查服务器控制台错误信息
- 确保Stripe SDK已正确安装
- 验证服务器端密钥配置

#### Q4: 支付处理失败

**可能原因**:

- 网络连接问题
- API密钥配置错误
- 请求参数不正确

**解决方案**:

1. 检查浏览器开发者工具的网络标签
2. 查看服务器控制台日志
3. 验证所有环境变量

### 🔍 调试工具

#### 浏览器开发者工具

- **Console**: 查看前端错误和日志
- **Network**: 监控API请求和响应
- **Application**: 检查环境变量和存储

#### 服务器日志

```bash
# 查看服务器实时日志
tail -f server.log

# 或直接查看控制台输出
npm run server
```

#### API测试

```bash
# 健康检查
curl http://localhost:3000/api/payment/health

# 获取测试卡信息
curl http://localhost:3000/api/payment/payment-methods

# 创建支付意图
curl -X POST http://localhost:3000/api/payment/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 1999, "currency": "usd", "metadata": {"test": "true"}}'
```

## 📊 测试检查清单

### ✅ 基础功能测试

- [ ] 前端服务器启动成功 (localhost:5173)
- [ ] 后端服务器启动成功 (localhost:3000)
- [ ] 支付页面加载正常
- [ ] 套餐选择功能正常
- [ ] 支付表单显示正常
- [ ] 价格计算正确

### ✅ 支付流程测试

- [ ] 成功支付测试 (4242424242424242)
- [ ] 失败支付测试 (4000000000000002)
- [ ] 表单验证功能
- [ ] 错误处理和显示
- [ ] 支付成功页面跳转
- [ ] 订单信息显示

### ✅ API功能测试

- [ ] 支付意图创建
- [ ] 支付状态查询
- [ ] 错误处理
- [ ] 健康检查
- [ ] CORS配置

## 🎯 下一步计划

### 🔧 可选优化

1. **获取匹配的测试服务器端密钥**

   - 访问 [Stripe控制台](https://dashboard.stripe.com/apikeys)
   - 切换到"查看测试数据"模式
   - 复制测试服务器端密钥 (sk*test*...)
   - 更新 `.env` 文件

2. **配置Webhook**

   - 在Stripe控制台创建Webhook端点
   - 设置端点URL: `https://your-domain.com/api/payment/webhook`
   - 选择事件: `payment_intent.succeeded`, `payment_intent.payment_failed`

3. **生产环境准备**
   - 获取生产环境密钥对
   - 配置Vercel环境变量
   - 设置生产环境Webhook

### 🚀 功能扩展

- 多币种支持
- 订阅管理
- 退款处理
- 支付分析
- 收据生成

## 📞 获取帮助

### 🐛 如遇问题

1. **查看日志**: 浏览器控制台 + 服务器控制台
2. **测试API**: 使用curl或Postman测试端点
3. **检查配置**: 验证环境变量和密钥
4. **重启服务**: 重新启动开发服务器

### 📚 参考资源

- [Stripe 测试指南](https://stripe.com/docs/testing)
- [Stripe Elements 文档](https://stripe.com/docs/stripe-js)
- [项目支付组件文档](../src/components/payment/README.md)

---

💡 **现在开始测试吧！** 访问 http://localhost:5173/payment 开始您的第一次测试支付。
