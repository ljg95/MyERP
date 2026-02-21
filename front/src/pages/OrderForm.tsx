import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import './Orders.css';

interface OrderItem {
    id: number;
    productId: number | '';
    quantity: number;
    price: number;
}

const OrderForm = () => {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [items, setItems] = useState<OrderItem[]>([
        { id: Date.now(), productId: '', quantity: 1, price: 0 }
    ]);

    const [formData, setFormData] = useState({
        partnerId: '',
        shippingAddress: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    useEffect(() => {
        const fetchFormData = async () => {
            setLoadingData(true);
            try {
                // Fetch Customers (Partners with type=Customer)
                const cRes = await fetch('http://localhost:8080/partners?type=Customer&size=100');
                if (cRes.ok) {
                    const cData = await cRes.json();
                    setCustomers(cData.content || []);
                }

                // Fetch Products
                const pRes = await fetch('http://localhost:8080/products?size=500');
                if (pRes.ok) {
                    const pData = await pRes.json();
                    // Status가 Active 나 정상인 것만 가져오면 좋지만 기본적으로 다 가져옴
                    setProducts(pData.content || []);
                }
            } catch (err: any) {
                setError('기초 데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoadingData(false);
            }
        };
        fetchFormData();
    }, []);

    const addItem = () => {
        setItems([...items, { id: Date.now(), productId: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (id: number) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleItemChange = (id: number, field: keyof OrderItem, value: any) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                // 만약 상품이 변경되었다면 해당 상품의 단가를 자동으로 채움
                if (field === 'productId' && value !== '') {
                    const matchedProduct = products.find(p => p.id === Number(value));
                    if (matchedProduct) {
                        updatedItem.price = matchedProduct.price;
                    }
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.partnerId) {
            alert('고객을 선택해주세요.');
            return;
        }

        // 상품이 선택되지 않은 줄 확인
        const invalidItems = items.filter(item => item.productId === '' || item.quantity <= 0);
        if (invalidItems.length > 0) {
            alert('모든 품목의 상품 및 수량을 올바르게 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const orderRequestPayload = {
            partnerId: Number(formData.partnerId),
            shippingAddress: formData.shippingAddress || 'Not Provided',
            items: items.map(item => ({
                productId: Number(item.productId),
                quantity: item.quantity
            }))
        };

        try {
            const response = await fetch('http://localhost:8080/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderRequestPayload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || '주문 생성에 실패했습니다.');
            }

            // 성공
            navigate('/orders');
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    if (loadingData) {
        return <div className="page-container"><p>로딩 중...</p></div>;
    }

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div className="header-left">
                    <button onClick={() => navigate('/orders')} className="back-btn" type="button">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>새 주문 생성</h1>
                        <p>주문 내역 입력 및 상품 추가</p>
                    </div>
                </div>
            </div>

            {error && <div className="error-banner" style={{ marginBottom: '1rem', color: 'red' }}>{error}</div>}

            <form onSubmit={handleSubmit} className="order-form-layout">
                <div className="order-main">
                    <div className="content-card form-section">
                        <h3 className="section-title">주문 상세</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>고객</label>
                                <select
                                    value={formData.partnerId}
                                    onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                                    required
                                >
                                    <option value="">고객 선택</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>주문 일자</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    readOnly // 보통 자동 생성되므로 수정 불가로 두거나 폼 데이터로만 사용합니다
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>배송지 주소 (Shipping Address)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="고객의 배송지 주소를 입력하세요"
                                value={formData.shippingAddress}
                                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>비고</label>
                            <textarea
                                rows={2}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="content-card form-section">
                        <div className="section-header-row">
                            <h3 className="section-title mb-0">주문 품목</h3>
                            <button type="button" className="secondary-btn small" onClick={addItem}>
                                <Plus size={14} /> 품목 추가
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="items-table">
                                <thead>
                                    <tr>
                                        <th>상품</th>
                                        <th style={{ width: 100 }}>수량</th>
                                        <th style={{ width: 120 }}>단가 (₩)</th>
                                        <th style={{ width: 120 }}>합계 (₩)</th>
                                        <th style={{ width: 50 }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <select
                                                    className="table-input"
                                                    value={item.productId}
                                                    onChange={(e) => handleItemChange(item.id, 'productId', e.target.value)}
                                                    required
                                                >
                                                    <option value="">상품 선택...</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} (재고: {p.stock})</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="table-input"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="table-input"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.price}
                                                    readOnly // 단가는 상품에서 자동으로 가져옵니다.
                                                />
                                            </td>
                                            <td className="text-right">
                                                {(item.quantity * item.price).toLocaleString()}
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    className="icon-btn delete"
                                                    onClick={() => removeItem(item.id)}
                                                    disabled={items.length === 1}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="order-sidebar">
                    <div className="content-card summary-card">
                        <h3>주문 요약</h3>
                        <div className="summary-row">
                            <span>소계</span>
                            <span>₩ {calculateTotal().toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>부가세 (10%)</span>
                            <span>₩ {(calculateTotal() * 0.1).toLocaleString()}</span>
                        </div>
                        <div className="summary-total">
                            <span>총계</span>
                            <span>₩ {(calculateTotal() * 1.1).toLocaleString()}</span>
                        </div>
                        <button type="submit" className="primary-btn w-100 mt-4" disabled={isSubmitting}>
                            {isSubmitting ? '처리 중...' : <><Save size={18} /> 주문 제출</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;
