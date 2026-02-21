import { useState, useEffect } from 'react';
import { Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './Inventory.css';

interface StockMovement {
    id: number;
    productId: number;
    quantityChanged: number;
    type: string; // INBOUND, OUTBOUND, ADJUSTMENT
    reason: string;
    referenceId: string;
    createdAt: string;
}

const InventoryHistory = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialProductId = queryParams.get('productId') || '';

    const [history, setHistory] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(initialProductId);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            let url = `http://localhost:8080/inventory/history?page=${currentPage}&size=15`;
            if (searchTerm.trim() && !isNaN(Number(searchTerm))) {
                url += `&productId=${searchTerm.trim()}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('이력 데이터를 불러오는데 실패했습니다.');
            }
            const data = await response.json();
            setHistory(data.content);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [currentPage]);

    // Format date string to local string
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div>
                    <h1>입출고 이력</h1>
                    <p>재고 이동 내역 조회</p>
                </div>
            </div>

            <div className="content-card">
                <div className="toolbar" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="search-wrapper" style={{ width: '300px' }}>
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="상품 번호로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setCurrentPage(0);
                                    fetchHistory();
                                }
                            }}
                        />
                    </div>
                    <button
                        className="primary-btn"
                        style={{ marginLeft: '8px', padding: '0.5rem 1rem' }}
                        onClick={() => {
                            setCurrentPage(0);
                            fetchHistory();
                        }}
                    >
                        검색
                    </button>
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>
                ) : error ? (
                    <div className="error-text" style={{ padding: '1rem' }}>에러: {error}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>일시</th>
                                    <th># 상품번호</th>
                                    <th>유형</th>
                                    <th>변동 수량</th>
                                    <th>참조 번호</th>
                                    <th>사유</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id}>
                                        <td className="text-sm text-gray">{formatDate(item.createdAt)}</td>
                                        <td className="fw-bold">{item.productId}</td>
                                        <td>
                                            <span className={`movement-type ${(item.type || '').toLowerCase()}`}>
                                                {item.type === 'INBOUND' && <ArrowDown size={14} className="text-success" />}
                                                {item.type === 'OUTBOUND' && <ArrowUp size={14} className="text-danger" />}
                                                {item.type === 'INBOUND' ? '입고' : item.type === 'OUTBOUND' ? '출고' : '조정'}
                                            </span>
                                        </td>
                                        <td className={item.quantityChanged < 0 ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                                            {item.quantityChanged > 0 ? '+' : ''}{item.quantityChanged}
                                        </td>
                                        <td className="text-gray text-sm">{item.referenceId || '-'}</td>
                                        <td className="text-sm">{item.reason || '-'}</td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>조회된 이력이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

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

export default InventoryHistory;
