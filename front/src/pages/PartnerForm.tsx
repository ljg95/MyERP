import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import './Partners.css';

const PartnerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<{
        name: string;
        type: string;
        contact: string;
        email: string;
        phone: string;
        address: string;
        status: string;
    }>({
        name: '',
        type: 'Supplier',
        contact: '',
        email: '',
        phone: '',
        address: '',
        status: 'Active'
    });

    useEffect(() => {
        if (isEditMode) {
            // Mock data fetch for edit mode
            if (id === '1') {
                setFormData({
                    name: 'Acme Corp',
                    type: 'Supplier',
                    contact: 'John Smith',
                    email: 'john@acme.com',
                    phone: '+1 (555) 123-4567',
                    address: '123 Industry Way, Tech City',
                    status: 'Active'
                });
            }
        }
    }, [isEditMode, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Saving partner:', formData);
        navigate('/partners');
    };

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
                                    name="contact"
                                    value={formData.contact}
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
                        <button type="button" className="cancel-btn" onClick={() => navigate('/partners')}>
                            취소
                        </button>
                        <button type="submit" className="primary-btn">
                            <Save size={18} /> 거래처 저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PartnerForm;
