import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Inventory.css';

interface InventoryItem {
    id: number;
    productId: number;
    productName: string;
    productCategory: string;
    quantity: number;
    minStock: number;
    status: string; // NORMAL, LOW_STOCK, OUT_OF_STOCK
}

const InventoryStatus = () => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/inventory?page=${currentPage}&size=10`);
            if (!response.ok) {
                throw new Error('재고 데이터를 불러오는데 실패했습니다.');
            }
            const data = await response.json();
            setInventory(data.content);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [currentPage]);

    if (loading && inventory.length === 0) return <div className="page-container"><p>로딩 중...</p></div>;
    if (error) return <div className="page-container"><p className="error-text">에러: {error}</p></div>;

    const normalCount = inventory.filter(i => i.status === 'NORMAL').length;
    const lowCount = inventory.filter(i => i.status === 'LOW_STOCK').length;
    const outCount = inventory.filter(i => i.status === 'OUT_OF_STOCK').length;

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div>
                    <h1>재고 관리</h1>
                    <p>재고 수준 및 이동 추적</p>
                </div>
                <div className="inventory-stats">
                    <div className="stat-badge success">
                        <CheckCircle size={14} /> {normalCount} 정상 수량
                    </div>
                    <div className="stat-badge warning">
                        <ArrowDownRight size={14} /> {lowCount} 재고 부족
                    </div>
                    <div className="stat-badge error">
                        <AlertTriangle size={14} /> {outCount} 품절
                    </div>
                </div>
            </div>

            <div className="content-card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th># 상품번호</th>
                                <th>상품명</th>
                                <th>카테고리</th>
                                <th>재고 수준</th>
                                <th>상태</th>
                                <th>상세</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item.id}>
                                    <td className="text-sm text-gray">{item.productId}</td>
                                    <td className="fw-bold">{item.productName}</td>
                                    <td>{item.productCategory}</td>
                                    <td>
                                        <div className="stock-level">
                                            <span className={item.quantity <= item.minStock ? 'text-danger fw-bold' : 'fw-bold'}>
                                                {item.quantity}
                                            </span>
                                            <span className="text-xs text-gray"> / 최저 {item.minStock} 개</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                                            {item.status === 'NORMAL' ? '정상' : item.status === 'LOW_STOCK' ? '부족' : '품절'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button className="icon-btn edit" title="재고 보정" onClick={() => navigate(`/inventory/adjust/${item.productId}`)}>
                                                <AlertTriangle size={16} />
                                            </button>
                                            <button className="icon-btn" title="이동 이력" onClick={() => navigate(`/inventory/history?productId=${item.productId}`)}>
                                                <ArrowUpRight size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {inventory.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>재고 품목이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination-wrapper">
                        <span className="pagination-info">
                            총 {totalPages} 페이지 중 {currentPage + 1} 페이지
                        </span>
                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            >
                                <ChevronLeft size={16} /> 이전
                            </button>
                            <button
                                className="pagination-btn"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            >
                                다음 <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryStatus;
