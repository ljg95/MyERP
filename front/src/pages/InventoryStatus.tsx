import { ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Inventory.css';

interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    category: string;
    stock: number;
    minStock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    lastUpdated: string;
}

const InventoryStatus = () => {
    const navigate = useNavigate();
    const inventory: InventoryItem[] = [
        { id: 1, name: 'Premium Widget', sku: 'WDG-001', category: 'Widgets', stock: 45, minStock: 20, status: 'In Stock', lastUpdated: '2023-10-25' },
        { id: 2, name: 'Super Gadget', sku: 'GDG-002', category: 'Gadgets', stock: 12, minStock: 15, status: 'Low Stock', lastUpdated: '2023-10-24' },
        { id: 3, name: 'Eco Component', sku: 'CMP-003', category: 'Components', stock: 150, minStock: 50, status: 'In Stock', lastUpdated: '2023-10-23' },
        { id: 4, name: 'Deluxe Tool', sku: 'TOL-004', category: 'Tools', stock: 0, minStock: 10, status: 'Out of Stock', lastUpdated: '2023-10-22' },
        { id: 5, name: 'Basic Part', sku: 'PRT-005', category: 'Parts', stock: 500, minStock: 100, status: 'In Stock', lastUpdated: '2023-10-21' },
    ];

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div>
                    <h1>재고 관리</h1>
                    <p>재고 수준 및 이동 추적</p>
                </div>
                <div className="inventory-stats">
                    <div className="stat-badge success">
                        <CheckCircle size={14} /> 3 재고 있음
                    </div>
                    <div className="stat-badge warning">
                        <ArrowDownRight size={14} /> 1 재고 부족
                    </div>
                    <div className="stat-badge error">
                        <AlertTriangle size={14} /> 1 품절
                    </div>
                </div>
            </div>

            <div className="content-card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>상품명</th>
                                <th>카테고리</th>
                                <th>재고 수준</th>
                                <th>상태</th>
                                <th>최근 업데이트</th>
                                <th>상세</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item.id}>
                                    <td className="text-sm text-gray">{item.sku}</td>
                                    <td className="fw-bold">{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>
                                        <div className="stock-level">
                                            <span className={item.stock <= item.minStock ? 'text-danger' : ''}>
                                                {item.stock}
                                            </span>
                                            <span className="text-xs text-gray"> / {item.minStock} min</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${item.status.toLowerCase().replace(/ /g, '-')}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>{item.lastUpdated}</td>
                                    <td>
                                        <div className="actions">
                                            <button className="icon-btn edit" title="Adjust Stock" onClick={() => navigate(`/inventory/adjust/${item.id}`)}>
                                                <AlertTriangle size={16} />
                                            </button>
                                            <button className="icon-btn" title="View History" onClick={() => navigate('/inventory/history')}>
                                                <ArrowUpRight size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryStatus;
