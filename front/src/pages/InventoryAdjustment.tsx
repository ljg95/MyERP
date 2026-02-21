import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import './Inventory.css';

const InventoryAdjustment = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // productId

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        productName: '',
        currentStock: 0,
        adjustmentType: 'Inbound',
        quantity: 0,
        reason: '',
        reference: ''
    });

    useEffect(() => {
        const fetchInventory = async () => {
            if (!id) return;
            try {
                const response = await fetch(`http://localhost:8080/inventory/${id}`);
                if (!response.ok) {
                    throw new Error('재고 정보를 불러오는데 실패했습니다.');
                }
                const data = await response.json();
                setFormData(prev => ({
                    ...prev,
                    productName: data.productName,
                    currentStock: data.quantity
                }));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const qty = Number(formData.quantity);
            let quantityChanged = 0;

            if (formData.adjustmentType === 'Inbound') {
                quantityChanged = qty;
            } else if (formData.adjustmentType === 'Outbound') {
                quantityChanged = -qty;
            } else {
                quantityChanged = qty; // For correction, assuming user enters the offset (could be negative)
            }

            const payload = {
                productId: Number(id),
                quantityChanged,
                reason: formData.reason,
                referenceId: formData.reference
            };

            const response = await fetch('http://localhost:8080/inventory/adjust', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('재고 조정에 실패했습니다.');
            }

            navigate('/inventory');
        } catch (err: any) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    const calculateNewStock = () => {
        const qty = Number(formData.quantity) || 0;
        if (formData.adjustmentType === 'Inbound') return formData.currentStock + qty;
        if (formData.adjustmentType === 'Outbound') return formData.currentStock - qty;
        return formData.currentStock + qty;
    };

    if (loading) return <div className="page-container"><p>로딩 중...</p></div>;

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div className="header-left">
                    <button onClick={() => navigate('/inventory')} className="back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>재고 조정</h1>
                        <p>수동 재고 입/출고 및 보정 ({formData.productName})</p>
                    </div>
                </div>
            </div>

            <div className="content-card form-card">
                {error && <div className="error-text mb-4">에러: {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="section-title">조정 내역</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>조정 유형</label>
                                <select
                                    name="adjustmentType"
                                    value={formData.adjustmentType}
                                    onChange={handleChange}
                                >
                                    <option value="Inbound">입고 (Inbound)</option>
                                    <option value="Outbound">출고 (Outbound)</option>
                                    <option value="Correction">보정 (Correction offset)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>현재 재고</label>
                                <input
                                    type="text"
                                    value={formData.currentStock}
                                    disabled
                                    className="bg-gray-100"
                                />
                            </div>

                            <div className="form-group">
                                <label>조정 수량</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                    placeholder="변동 수량 입력 (음수 가능)"
                                />
                            </div>

                            <div className="form-group">
                                <label>예상 재고</label>
                                <input
                                    type="text"
                                    value={calculateNewStock()}
                                    disabled
                                    className="bg-gray-100 fw-bold"
                                />
                            </div>
                        </div>

                        <div className="form-group mt-3">
                            <label>참조</label>
                            <input
                                type="text"
                                name="reference"
                                value={formData.reference}
                                onChange={handleChange}
                                placeholder="예: PO-001 또는 주문번호"
                                className="full-width mb-3"
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label>사유 <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="예: 정기 재고 조사 차이 보정"
                                required
                                className="full-width"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate('/inventory')} disabled={submitting}>
                            취소
                        </button>
                        <button type="submit" className="primary-btn" disabled={submitting}>
                            <Save size={18} /> {submitting ? '저장 중...' : '조정 내역 저장'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryAdjustment;
