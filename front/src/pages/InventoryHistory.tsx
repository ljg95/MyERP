import { Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import './Inventory.css';

interface StockMovement {
    id: number;
    date: string;
    product: string;
    type: 'Inbound' | 'Outbound' | 'Adjustment';
    quantity: number;
    reference: string;
}

const InventoryHistory = () => {
    const history: StockMovement[] = [
        { id: 1, date: '2023-10-25', product: 'Premium Widget', type: 'Inbound', quantity: 50, reference: 'PO-001' },
        { id: 2, date: '2023-10-25', product: 'Super Gadget', type: 'Outbound', quantity: 5, reference: 'ORD-2023-001' },
        { id: 3, date: '2023-10-24', product: 'Basic Part', type: 'Inbound', quantity: 200, reference: 'PO-002' },
        { id: 4, date: '2023-10-24', product: 'Eco Component', type: 'Adjustment', quantity: -2, reference: 'Audit' },
        { id: 5, date: '2023-10-23', product: 'Deluxe Tool', type: 'Outbound', quantity: 1, reference: 'ORD-2023-002' },
    ];

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div>
                    <h1>입출고 이력</h1>
                    <p>재고 이동 내역 조회</p>
                </div>
                <button className="secondary-btn">
                    <Filter size={16} /> 필터
                </button>
            </div>

            <div className="content-card">
                <div className="toolbar">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="상품 또는 참조 검색..." />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <th>상품</th>
                                <th>유형</th>
                                <th>수량</th>
                                <th>참조</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.date}</td>
                                    <td className="fw-bold">{item.product}</td>
                                    <td>
                                        <span className={`movement-type ${item.type.toLowerCase()}`}>
                                            {item.type === 'Inbound' && <ArrowDown size={14} />}
                                            {item.type === 'Outbound' && <ArrowUp size={14} />}
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className={item.type === 'Outbound' || (item.type === 'Adjustment' && item.quantity < 0) ? 'text-danger' : 'text-success'}>
                                        {item.quantity > 0 ? '+' : ''}{item.quantity}
                                    </td>
                                    <td className="text-gray text-sm">{item.reference}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryHistory;
