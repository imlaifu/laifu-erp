# ERP 模块开发任务列表

## 开发原则
每次开发按顺序执行 6 步：
1. 📦 数据库 Schema - `src-tauri/migrations/XXX_module.sql`
2. 🦀 Rust Commands - `src-tauri/src/module_commands.rs`
3. 📝 TypeScript 类型 - `src/types/module.ts`
4. 📡 API 服务 - `src/services/moduleService.ts`
5. 🗃️ Zustand Store - `src/stores/module.ts`
6. 🎨 UI 组件 - `src/features/module/ModulePage.tsx`

## 待开发模块

### [x] 1. 用户管理 (User Management) ✅
- 用户 CRUD
- 角色权限
- 登录认证
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/001_users.sql`
  - `src-tauri/src/user_commands.rs`
  - `src/types/user.ts`
  - `src/services/userService.ts`
  - `src/stores/user.ts`
  - `src/features/user/UserPage.tsx`

### [x] 2. 产品管理 (Product Management) ✅
- 产品信息
- 产品分类
- 价格管理
- 库存管理
- 库存流水
- 仓库管理
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/002_products.sql`
  - `src-tauri/src/product_commands.rs`
  - `src/types/product.ts`
  - `src/services/productService.ts`
  - `src/stores/product.ts`
  - `src/features/product/ProductPage.tsx`

### [x] 3. 库存管理 (Inventory Management) ✅
- 库存数量
- 入库出库
- 库存预警
- 库存盘点
- 库存调拨
- 库存统计
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/003_inventory.sql`
  - `src-tauri/src/inventory_commands.rs`
  - `src/types/inventory.ts`
  - `src/services/inventoryService.ts`
  - `src/stores/inventory.ts`
  - `src/features/inventory/InventoryPage.tsx`

### [x] 4. 订单管理 (Order Management) ✅
- 销售订单
- 采购订单
- 订单状态跟踪
- 客户管理
- 供应商管理
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/004_orders.sql`
  - `src-tauri/src/order_commands.rs`
  - `src/types/order.ts`
  - `src/services/orderService.ts`
  - `src/stores/order.ts`
  - `src/features/order/OrderPage.tsx`

### [x] 5. 客户管理 (Customer Management) ✅
- 客户信息
- 联系记录
- 客户分级
- 客户标签
- 跟进计划
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/005_customers.sql`
  - `src-tauri/src/customer_commands.rs`
  - `src/types/customer.ts`
  - `src/services/customerService.ts`
  - `src/stores/customer.ts`
  - `src/features/customer/CustomerPage.tsx`

### [x] 6. 供应商管理 (Supplier Management) ✅
- 供应商信息
- 联系人管理
- 联系记录
- 供应商评估
- 供应产品管理
- 供应商分级
- 供应商标签
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/006_suppliers.sql`
  - `src-tauri/src/supplier_commands.rs`
  - `src/types/supplier.ts`
  - `src/services/supplierService.ts`
  - `src/stores/supplier.ts`
  - `src/features/supplier/SupplierPage.tsx`

### [x] 7. 财务管理 (Finance Management) ✅
- 收支记录
- 财务报表
- 发票管理
- 会计科目
- 收支分类
- 应收应付
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/007_finance.sql`
  - `src-tauri/src/finance_commands.rs`
  - `src/types/finance.ts`
  - `src/services/financeService.ts`
  - `src/stores/finance.ts`
  - `src/features/finance/FinancePage.tsx`

### [x] 8. 报表管理 (Reports Management) ✅
- Dashboard 概览
- 销售报表
- 库存报表
- 财务报表
- 数据导出
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/008_reports.sql`
  - `src-tauri/src/reports_commands.rs`
  - `src/types/reports.ts`
  - `src/services/reportsService.ts`
  - `src/stores/reports.ts`
  - `src/features/reports/ReportsPage.tsx`

---
**当前进度**: 8/8 模块完成
**最新完成**: 报表管理模块 (2026-03-03)
**下一阶段**: 第二阶段 - 扩展模块开发

---

# 第二阶段 - 扩展模块

### [x] 9. 人力资源管理 (HR Management) ✅
- 员工信息
- 考勤管理
- 薪资计算
- 请假审批
- 绩效管理
- 培训记录
- **优先级**: 高
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/009_hr.sql`
  - `src-tauri/src/hr_commands.rs`
  - `src/types/hr.ts`
  - `src/services/hrService.ts`
  - `src/stores/hr.ts`
  - `src/features/hr/HRPage.tsx`

### [x] 10. 项目管理 (Project Management) ✅
- 项目立项
- 任务分配
- 进度跟踪
- 工时记录
- 项目成本
- 项目文档
- **优先级**: 高
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/010_projects.sql`
  - `src-tauri/src/project_commands.rs`
  - `src/types/project.ts`
  - `src/services/projectService.ts`
  - `src/stores/project.ts`
  - `src/features/project/ProjectPage.tsx`

### [x] 11. 采购管理 (Procurement Management) ✅
- 采购申请
- 采购订单
- 供应商比价
- 入库验收
- 采购合同
- 采购统计
- **优先级**: 中
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/011_procurement.sql`
  - `src-tauri/src/procurement_commands.rs`
  - `src/types/procurement.ts`
  - `src/services/procurementService.ts`
  - `src/stores/procurement.ts`
  - `src/features/procurement/ProcurementPage.tsx`

### [x] 12. 销售管理 (Sales Management) ✅
- 销售机会
- 报价管理
- 销售合同
- 销售预测
- 佣金计算
- 销售业绩
- **优先级**: 中
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/012_sales.sql`
  - `src-tauri/src/sales_commands.rs`
  - `src/types/sales.ts`
  - `src/services/salesService.ts`
  - `src/stores/sales.ts`
  - `src/features/sales/SalesPage.tsx`

### [x] 13. 系统设置 (System Settings) ✅
- 系统参数
- 数据字典
- 日志管理
- 备份恢复
- 权限配置
- 操作审计
- **优先级**: 高
- **完成时间**: 2026-03-03
- **文件**:
  - `src-tauri/migrations/013_settings.sql`
  - `src-tauri/src/settings_commands.rs`
  - `src/types/settings.ts`
  - `src/services/settingsService.ts`
  - `src/stores/settings.ts`
  - `src/features/settings/SettingsPage.tsx`

---
**第二阶段进度**: 5/5 模块完成 ✅
**最新完成**: 系统设置模块 (2026-03-03)
**状态**: 第二阶段全部完成！
