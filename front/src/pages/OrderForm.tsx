import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import './Orders.css';

interface OrderItem {
    id: number;
    product: string;
    quantity: number;
    price: number;
}

const OrderForm = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<OrderItem[]>([
        { id: 1, product: '', quantity: 1, price: 0 }
    ]);

    const [formData, setFormData] = useState({
        customer: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const addItem = () => {
        setItems([...items, { id: Date.now(), product: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (id: number) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleItemChange = (id: number, field: keyof OrderItem, value: any) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Order submitted:', { ...formData, items });
        navigate('/orders');
    };

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div className="header-left">
                    <button onClick={() => navigate('/orders')} className="back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>새 주문 생성</h1>
                        <p>주문 내역 입력 및 상품 추가</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="order-form-layout">
                <div className="order-main">
                    <div className="content-card form-section">
                        <h3 className="section-title">주문 상세</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>고객</label>
                                <select
                                    value={formData.customer}
                                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                    required
                                >
                                    <option value="">고객 선택</option>
                                    <option value="QuickRetail Solutions">QuickRetail Solutions</option>
                                    <option value="Global Logistics">Global Logistics</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>주문 일자</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
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

                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>상품</th>
                                    <th style={{ width: 100 }}>수량</th>
                                    <th style={{ width: 120 }}>가격 (₩)</th>
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
                                                value={item.product}
                                                onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Product...</option>
                                                <option value="Premium Widget">Premium Widget</option>
                                                <option value="Super Gadget">Super Gadget</option>
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
                                                onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                required
                                            />
                                        </td>
                                        <td className="text-right">
                                            {(item.quantity * item.price).toFixed(2)}
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

                <div className="order-sidebar">
                    <div className="content-card summary-card">
                        <h3>주문 요약</h3>
                        <div className="summary-row">
                            <span>소계</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>부가세 (10%)</span>
                            <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="summary-total">
                            <span>총계</span>
                            <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                        </div>
                        <button type="submit" className="primary-btn w-100 mt-4">
                            <Save size={18} /> 주문 제출
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;
