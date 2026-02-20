import { useState } from 'react';
import { Plus, Search, Eye, FileText, ChevronDown, Slash, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import './Orders.css';

const OrderHistory = () => {
    const navigate = useNavigate();
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

    // Mock Data
    const [orders, setOrders] = useState([
        { id: 'ORD-2023-001', customer: 'QuickRetail Solutions', date: '2023-10-25', total: 1250.00, status: 'Completed', items: 5 },
        { id: 'ORD-2023-002', customer: 'Global Logistics', date: '2023-10-26', total: 450.50, status: 'Processing', items: 2 },
        { id: 'ORD-2023-003', customer: 'TechParts Inc', date: '2023-10-27', total: 3200.00, status: 'Pending', items: 12 },
        { id: 'ORD-2023-004', customer: 'Acme Corp', date: '2023-10-27', total: 150.00, status: 'Cancelled', items: 1 },
        { id: 'ORD-2023-005', customer: 'QuickRetail Solutions', date: '2023-10-28', total: 890.00, status: 'Processing', items: 4 },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'status-badge-green';
            case 'Processing': return 'status-badge-blue';
            case 'Pending': return 'status-badge-yellow';
            case 'Cancelled': return 'status-badge-red';
            default: return 'status-badge-gray';
        }
    };

    const handleCancelClick = (id: string) => {
        setSelectedOrder(id);
        setCancelModalOpen(true);
    };

    const confirmCancel = () => {
        if (selectedOrder) {
            setOrders(orders.map(order =>
                order.id === selectedOrder ? { ...order, status: 'Cancelled' } : order
            ));
            setCancelModalOpen(false);
            setSelectedOrder(null);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div>
                    <h1>주문 관리</h1>
                    <p>고객 주문 조회 및 관리</p>
                </div>
                <Link to="/orders/new" className="primary-btn">
                    <Plus size={18} /> 주문 생성
                </Link>
            </div>

            <div className="content-card">
                <div className="toolbar">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="주문 검색..." />
                    </div>
                    <div className="filters">
                        <select>
                            <option>모든 상태</option>
                            <option>완료</option>
                            <option>처리중</option>
                            <option>대기중</option>
                            <option>취소됨</option>
                        </select>
                        <button className="date-filter-btn">
                            날짜 범위 <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>주문번호</th>
                                <th>고객명</th>
                                <th>날짜</th>
                                <th>품목수</th>
                                <th>총액</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="fw-bold">{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.date}</td>
                                    <td>{order.items}</td>
                                    <td>${order.total.toFixed(2)}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button className="icon-btn view" title="View Details" onClick={() => navigate(`/orders/${order.id}`)}>
                                                <Eye size={16} />
                                            </button>
                                            {order.status !== 'Cancelled' && order.status !== 'Completed' && (
                                                <button className="icon-btn delete" title="Cancel Order" onClick={() => handleCancelClick(order.id)}>
                                                    <Slash size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                title="주문 취소 확인"
                footer={
                    <>
                        <button className="secondary-btn" onClick={() => setCancelModalOpen(false)}>닫기</button>
                        <button className="primary-btn danger" onClick={confirmCancel}>주문 취소</button>
                    </>
                }
            >
                <div className="modal-body-content">
                    <div className="warning-icon-wrapper">
                        <AlertTriangle size={48} className="text-warning" />
                    </div>
                    <p>주문 <strong>{selectedOrder}</strong>을(를) 취소하시겠습니까?</p>
                    <p className="text-sm text-gray">취소된 주문은 되돌릴 수 없으며, 재고가 자동으로 복구됩니다.</p>
                </div>
            </Modal>
        </div>
    );
};

export default OrderHistory;
