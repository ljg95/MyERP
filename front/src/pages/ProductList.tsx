import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Products.css';

const ProductList = () => {
    // Mock Data
    const products = [
        { id: 1, name: 'Premium Widget', category: 'Widgets', price: 120.00, stock: 45, status: 'In Stock' },
        { id: 2, name: 'Super Gadget', category: 'Gadgets', price: 299.99, stock: 12, status: 'Low Stock' },
        { id: 3, name: 'Eco Component', category: 'Components', price: 45.50, stock: 150, status: 'In Stock' },
        { id: 4, name: 'Deluxe Tool', category: 'Tools', price: 89.00, stock: 0, status: 'Out of Stock' },
        { id: 5, name: 'Basic Part', category: 'Parts', price: 12.00, stock: 500, status: 'In Stock' },
    ];

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
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="상품 검색..." />
                    </div>
                    <div className="filters">
                        <select>
                            <option>모든 카테고리</option>
                            <option>Widgets</option>
                            <option>Gadgets</option>
                        </select>
                        <select>
                            <option>모든 상태</option>
                            <option>재고 있음</option>
                            <option>재고 부족</option>
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
                                            <button className="icon-btn delete">
                                                <Trash2 size={16} />
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

export default ProductList;
