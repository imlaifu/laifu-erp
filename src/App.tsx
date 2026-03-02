import { useState } from 'react';
import { UserPage } from './features/user/UserPage';
import { ProductPage } from './features/product/ProductPage';
import { InventoryPage } from './features/inventory/InventoryPage';
import { OrderPage } from './features/order/OrderPage';

type Module = 'user' | 'product' | 'inventory' | 'order';

export function App() {
  const [currentModule, setCurrentModule] = useState<Module>('order');

  const modules: { id: Module; name: string }[] = [
    { id: 'user', name: '用户管理' },
    { id: 'product', name: '产品管理' },
    { id: 'inventory', name: '库存管理' },
    { id: 'order', name: '订单管理' },
  ];

  const renderModule = () => {
    switch (currentModule) {
      case 'user':
        return <UserPage />;
      case 'product':
        return <ProductPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'order':
        return <OrderPage />;
      default:
        return <OrderPage />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 侧边栏 */}
      <aside style={{
        width: '200px',
        backgroundColor: '#1a1a2e',
        color: 'white',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '30px', 
          paddingLeft: '20px',
          color: '#00d9ff'
        }}>
          ERP 系统
        </h1>
        <nav>
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setCurrentModule(module.id)}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 20px',
                textAlign: 'left',
                backgroundColor: currentModule === module.id ? '#16213e' : 'transparent',
                color: currentModule === module.id ? '#00d9ff' : '#a0a0a0',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentModule !== module.id) {
                  e.currentTarget.style.backgroundColor = '#0f3460';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (currentModule !== module.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#a0a0a0';
                }
              }}
            >
              {module.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* 主内容区 */}
      <main style={{
        flex: 1,
        backgroundColor: '#f5f5f5',
        overflow: 'auto',
        padding: '20px',
      }}>
        {renderModule()}
      </main>
    </div>
  );
}
