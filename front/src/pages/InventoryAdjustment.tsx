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

    // 1. 초기 폼 세팅: productId를 통해 백엔드에서 단건 재고 정보를 가져옵니다.
    useEffect(() => {
        const fetchInventory = async () => {
            if (!id) return;
            try {
                // 특정 상품의 재고 조회를 위해 단건 엔드포인트 호출
                const response = await fetch(`http://localhost:8080/inventory/${id}`);
                if (!response.ok) {
                    throw new Error('재고 정보를 불러오는데 실패했습니다.');
                }
                const data = await response.json();

                // 받아온 데이터로 폼 기본값을 세팅합니다 (상품명, 현재고)
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

    // 2. 폼 제출: 사용자가 선택한 [조정 유형]과 [수량]을 바탕으로 최종 재고 증감을 결정하여 백엔드에 전송합니다.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const qty = Number(formData.quantity);
            let quantityChanged = 0;

            // 조정 유형에 따른 실제 변동 수량(quantityChanged) 계산 로직
            if (formData.adjustmentType === 'Inbound') {
                quantityChanged = qty; // 입고: 플러스
            } else if (formData.adjustmentType === 'Outbound') {
                quantityChanged = -qty; // 출고: 마이너스
            } else {
                quantityChanged = qty; // 보정: 사용자가 입력한 값 그대로 (음수/양수 모두 가능)
            }

            // 요청 Payload 생성 (DTO 구조 매핑)
            const payload = {
                productId: Number(id),
                quantityChanged,
                reason: formData.reason,
                referenceId: formData.reference
            };

            // 재고 조정 /inventory/adjust 로 POST 전송
            const response = await fetch('http://localhost:8080/inventory/adjust', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('재고 조정에 실패했습니다.');
            }

            // 제출 성공 시 목록 페이지로 라우팅
            navigate('/inventory');
        } catch (err: any) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    // 3. UI 헬퍼: 현재 입력된 값을 기준으로 '반영 후 예상 재고'를 화면에 미리 보여주기 위한 계산 함수
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
