import { useState, useEffect } from 'react';
import { Plus, Search, Eye, ChevronDown, Slash, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import './Orders.css';

const OrderHistory = () => {
    const navigate = useNavigate();
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters and Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchOrders = async (pageNumber = 0, search = '') => {
        setLoading(true);
        setError(null);
        try {
            let url = `http://localhost:8080/orders?page=${pageNumber}&size=10`;
            if (search) {
                url += `&keyword=${encodeURIComponent(search)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('주문을 불러오지 못했습니다.');
            const data = await response.json();

            setOrders(data.content || []);
            setTotalPages(data.totalPages || 1);
            setPage(data.number || 0);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page, searchTerm);
    }, [page, searchTerm]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'status-badge-green';
            case 'SHIPPED': return 'status-badge-blue';
            case 'PROCESSING': return 'status-badge-blue';
            case 'PENDING': return 'status-badge-yellow';
            case 'CANCELLED': return 'status-badge-red';
            default: return 'status-badge-gray';
        }
    };

    const handleCancelClick = (order: any) => {
        setSelectedOrder(order);
        setCancelModalOpen(true);
    };

    const confirmCancel = async () => {
        if (selectedOrder) {
            try {
                const response = await fetch(`http://localhost:8080/orders/${selectedOrder.id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'CANCELLED' })
                });

                if (!response.ok) throw new Error('주문 취소에 실패했습니다.');

                fetchOrders(page, searchTerm);
                setCancelModalOpen(false);
                setSelectedOrder(null);
            } catch (err: any) {
                alert(err.message);
            }
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
                        <input
                            type="text"
                            placeholder="주문번호 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {error && <div className="error-banner mb-3" style={{ color: 'red' }}>{error}</div>}

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>주문번호</th>
                                <th>고객명</th>
                                <th>날짜</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center">로딩 중...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={5} className="text-center">주문 내역이 없습니다.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="fw-bold">{order.orderNumber}</td>
                                        <td>{order.partnerId} {/* 백엔드에서 partnerName이 안 온다면 일단 ID표시 */}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
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
                                                {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                                    <button className="icon-btn delete" title="Cancel Order" onClick={() => handleCancelClick(order)}>
                                                        <Slash size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && totalPages > 1 && (
                    <div className="pagination">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                        >
                            이전
                        </button>
                        <span>{page + 1} / {totalPages}</span>
                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        >
                            다음
                        </button>
                    </div>
                )}
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
                    <p>주문 <strong>{selectedOrder?.orderNumber}</strong>을(를) 취소하시겠습니까?</p>
                    <p className="text-sm text-gray">취소된 주문은 상태만 취소됨으로 변경되며, 실제 삭제되진 않습니다.</p>
                </div>
            </Modal>
        </div>
    );
};

export default OrderHistory;
