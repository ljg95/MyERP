import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import './Partners.css';

/**
 * PartnerForm
 * 거래처(공급사, 고객사, 물류 등) 정보를 생성하거나 수정하는 컴포넌트입니다.
 * Partner Service의 REST API(POST/PUT /partners)와 연동됩니다.
 */
const PartnerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'Supplier',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        status: 'Active'
    });

    useEffect(() => {
        const fetchPartner = async () => {
            if (!isEditMode) return;
            try {
                const response = await fetch(`http://localhost:8080/partners/${id}`);
                if (!response.ok) throw new Error('거래처 정보를 불러오는데 실패했습니다.');
                const data = await response.json();
                setFormData({
                    name: data.name || '',
                    type: data.type || 'Supplier',
                    contactPerson: data.contactPerson || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    status: data.status || 'Active'
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPartner();
    }, [isEditMode, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const url = isEditMode
                ? `http://localhost:8080/partners/${id}`
                : `http://localhost:8080/partners`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('거래처 저장에 실패했습니다.');
            }

            navigate('/partners');
        } catch (err: any) {
            setError(err.message);
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="page-container"><p>로딩 중...</p></div>;

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div className="header-left">
                    <button onClick={() => navigate('/partners')} className="back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>{isEditMode ? '거래처 수정' : '새 거래처 등록'}</h1>
                        <p>{isEditMode ? `거래처 정보 수정 #${id}` : '새로운 파트너사 등록'}</p>
                    </div>
                </div>
            </div>

            {error && <div className="error-text" style={{ padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

            <div className="content-card form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="section-title">기본 정보</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>거래처명</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="예: Acme Corp"
                                />
                            </div>

                            <div className="form-group">
                                <label>유형</label>
                                <select name="type" value={formData.type} onChange={handleChange}>
                                    <option value="Supplier">공급사 (Supplier)</option>
                                    <option value="Customer">고객사 (Customer)</option>
                                    <option value="Logistics">물류 (Logistics)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>상태</label>
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="Active">활성</option>
                                    <option value="Inactive">비활성</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">연락처 정보</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>담당자명</label>
                                <input
                                    type="text"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    required
                                    placeholder="예: 홍길동"
                                />
                            </div>

                            <div className="form-group">
                                <label>이메일</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="example@company.com"
                                />
                            </div>

                            <div className="form-group">
                                <label>전화번호</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+82 10-1234-5678"
                                />
                            </div>
                        </div>

                        <div className="form-group mt-3">
                            <label>주소</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="서울특별시 강남구 테헤란로 123"
                                className="full-width"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate('/partners')} disabled={isSaving}>
                            취소
                        </button>
                        <button type="submit" className="primary-btn" disabled={isSaving}>
                            <Save size={18} /> {isSaving ? '저장 중...' : '거래처 저장'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PartnerForm;
