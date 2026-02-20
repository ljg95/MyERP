import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import './Inventory.css';

const InventoryAdjustment = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        productName: 'Premium Widget', // Mock data, in real app fetch by ID
        currentStock: 45,
        adjustmentType: 'Inbound',
        quantity: 0,
        reason: '',
        reference: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting adjustment:', formData);
        navigate('/inventory');
    };

    const calculateNewStock = () => {
        const qty = parseInt(formData.quantity.toString()) || 0;
        if (formData.adjustmentType === 'Inbound') return formData.currentStock + qty;
        if (formData.adjustmentType === 'Outbound') return formData.currentStock - qty;
        return formData.currentStock + qty; // For correction, logic depends on diff, simplifying here
    };

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
                                    <option value="Correction">보정 (Correction)</option>
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
                                    min="1"
                                    required
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
                            <label>참조 / 사유</label>
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
                        <button type="button" className="cancel-btn" onClick={() => navigate('/inventory')}>
                            취소
                        </button>
                        <button type="submit" className="primary-btn">
                            <Save size={18} /> 조정 내역 저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryAdjustment;
