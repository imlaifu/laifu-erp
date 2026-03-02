# ERP 全栈应用

基于 Tauri + Rust + React + TypeScript 的企业资源规划系统。

## 技术栈

- **后端**: Rust + Tauri + SQLite
- **前端**: React + TypeScript + Zustand
- **构建**: Vite + Tauri CLI

## 开发原则

每次开发按顺序执行 6 步：

1. 📦 **数据库 Schema** - `src-tauri/migrations/XXX_module.sql`
2. 🦀 **Rust Commands** - `src-tauri/src/module_commands.rs`
3. 📝 **TypeScript 类型** - `src/types/module.ts`
4. 📡 **API 服务** - `src/services/moduleService.ts`
5. 🗃️ **Zustand Store** - `src/stores/module.ts`
6. 🎨 **UI 组件** - `src/features/module/ModulePage.tsx`

## 项目结构

```
erp/
├── src-tauri/
│   ├── migrations/          # 数据库迁移
│   ├── src/
│   │   ├── lib.rs          # Rust 入口
│   │   └── user_commands.rs # 用户模块命令
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/
│   ├── types/              # TypeScript 类型
│   ├── services/           # API 服务
│   ├── stores/             # Zustand 状态管理
│   └── features/           # UI 组件
├── package.json
├── tsconfig.json
└── TODO.md                 # 开发任务列表
```

## 已完成模块

- ✅ 用户管理 (User Management)
  - 用户 CRUD
  - 角色管理
  - 部门管理
  - 登录认证

## 待开发模块

- [ ] 产品管理 (Product Management)
- [ ] 库存管理 (Inventory Management)
- [ ] 订单管理 (Order Management)
- [ ] 客户管理 (Customer Management)
- [ ] 供应商管理 (Supplier Management)
- [ ] 财务管理 (Finance Management)

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run tauri dev

# 构建
npm run tauri build
```

## 质量要求

- ✅ 真实数据库表
- ✅ Rust 后端 API
- ✅ 完整 CRUD
- ✅ TypeScript 0 错误
- ✅ ESLint 0 错误
- ✅ Git 提交并推送
