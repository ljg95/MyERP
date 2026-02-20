import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Products.css';

const ProductList = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchKeyword.trim()) params.append('keyword', searchKeyword.trim());
            if (searchCategory) params.append('category', searchCategory);
            if (searchStatus) params.append('status', searchStatus);
            params.append('page', currentPage.toString());
            params.append('size', '10');

            const response = await fetch(`http://localhost:8080/products?${params.toString()}`);
            if (!response.ok) {
                throw new Error('데이터를 불러오는데 실패했습니다.');
            }
            const data = await response.json();

            // Spring Boot DTO 구조를 기존 프론트엔드 구조에 맞게 매핑
            const mappedData = data.content.map((item: any) => ({
                id: item.id,
                name: item.name,
                category: item.category || 'N/A',
                price: item.price,
                stock: item.stockQuantity,
                status: item.status
            }));

            setProducts(mappedData);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage, searchCategory, searchStatus]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('정말로 이 상품을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`http://localhost:8080/products/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('상품 삭제에 실패했습니다.');
            }

            // 삭제 성공 시 목록 업데이트
            setProducts(products.filter(p => p.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <div className="page-container"><p>로딩 중...</p></div>;
    if (error) return <div className="page-container"><p className="error-text">에러: {error}</p></div>;

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div>
                    <h1>상품 관리</h1>
                    <p>상품 목록 관리</p>
                </div>
                <Link to="/products/new" className="primary-btn">
                    <Plus size={18} /> 상품 등록
                </Link>
            </div>

            <div className="content-card">
                <div className="toolbar">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="search-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="상품명 검색..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setCurrentPage(0);
                                        fetchProducts();
                                    }
                                }}
                            />
                        </div>
                        <button
                            className="primary-btn"
                            style={{ marginLeft: '8px', padding: '0.5rem 1rem' }}
                            onClick={() => {
                                setCurrentPage(0);
                                fetchProducts();
                            }}
                        >
                            검색
                        </button>
                    </div>
                    <div className="filters">
                        <select
                            value={searchCategory}
                            onChange={(e) => {
                                setSearchCategory(e.target.value);
                                setCurrentPage(0);
                            }}
                        >
                            <option value="">모든 카테고리</option>
                            <option value="Widgets">Widgets</option>
                            <option value="Gadgets">Gadgets</option>
                            <option value="Components">Components</option>
                        </select>
                        <select
                            value={searchStatus}
                            onChange={(e) => {
                                setSearchStatus(e.target.value);
                                setCurrentPage(0);
                            }}
                        >
                            <option value="">모든 상태</option>
                            <option value="In Stock">재고 있음</option>
                            <option value="Low Stock">재고 부족</option>
                            <option value="Out of Stock">품절</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>상품명</th>
                                <th>카테고리</th>
                                <th>가격</th>
                                <th>재고</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>#{product.id}</td>
                                    <td className="fw-bold">{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <span className={`status-badge ${product.status.toLowerCase().replace(/ /g, '-')}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <Link to={`/products/${product.id}`} className="icon-btn edit">
                                                <Edit size={16} />
                                            </Link>
                                            <button className="icon-btn delete" onClick={() => handleDelete(product.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem', gap: '1rem' }}>
                    <button
                        className="back-btn"
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        이전
                    </button>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                        {currentPage + 1} / {totalPages || 1} 페이지
                    </span>
                    <button
                        className="back-btn"
                        disabled={currentPage >= totalPages - 1 || totalPages === 0}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
