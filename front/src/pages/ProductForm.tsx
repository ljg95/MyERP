import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import './Products.css';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<{
        name: string;
        category: string;
        price: number | string;
        stock: number | string;
        description: string;
        status: string;
    }>({
        name: isEditMode ? 'Premium Widget' : '',
        category: isEditMode ? 'Widgets' : '',
        price: isEditMode ? 120.00 : '',
        stock: isEditMode ? 45 : '',
        description: isEditMode ? 'A high quality widget.' : '',
        status: isEditMode ? 'In Stock' : 'In Stock'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Saving product:', formData);
        navigate('/products');
    };

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div className="header-left">
                    <button onClick={() => navigate('/products')} className="back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>{isEditMode ? '상품 수정' : '새 상품 등록'}</h1>
                        <p>{isEditMode ? `상품 수정 중 #${id}` : '카탈로그에 새 상품 추가'}</p>
                    </div>
                </div>
            </div>

            <div className="content-card form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="section-title">기본 정보</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>상품명</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>카테고리</label>
                                <select name="category" value={formData.category} onChange={handleChange}>
                                    <option value="">카테고리 선택</option>
                                    <option value="Widgets">Widgets</option>
                                    <option value="Gadgets">Gadgets</option>
                                    <option value="Components">Components</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>상세 설명</label>
                            <textarea
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">가격 및 재고</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>가격 (₩)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>초기 재고</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>상태</label>
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="In Stock">재고 있음</option>
                                    <option value="Low Stock">재고 부족</option>
                                    <option value="Out of Stock">품절</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate('/products')}>
                            취소
                        </button>
                        <button type="submit" className="primary-btn">
                            <Save size={18} /> 상품 저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
