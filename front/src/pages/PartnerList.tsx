import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Phone, Mail, MapPin, Trash2, AlertTriangle } from 'lucide-react';
import Modal from '../components/Modal';
import './Partners.css';

const PartnerList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<number | null>(null);

    // Mock Data
    const [partners, setPartners] = useState([
        {
            id: 1,
            name: 'Acme Corp',
            type: 'Supplier',
            contact: 'John Smith',
            email: 'john@acme.com',
            phone: '+1 (555) 123-4567',
            address: '123 Industry Way, Tech City',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Global Logistics',
            type: 'Logistics',
            contact: 'Sarah Johnson',
            email: 'sarah@globallog.com',
            phone: '+1 (555) 987-6543',
            address: '456 Shipping Ln, Harbor Town',
            status: 'Active'
        },
        {
            id: 3,
            name: 'TechParts Inc',
            type: 'Supplier',
            contact: 'Mike Brown',
            email: 'mike@techparts.com',
            phone: '+1 (555) 456-7890',
            address: '789 Circuit Blvd, Silicon Valley',
            status: 'Inactive'
        },
        {
            id: 4,
            name: 'QuickRetail Solutions',
            type: 'Customer',
            contact: 'Emily Davis',
            email: 'emily@quickretail.com',
            phone: '+1 (555) 222-3333',
            address: '321 Market St, Commerce City',
            status: 'Active'
        },
    ]);

    const handleDeleteClick = (id: number) => {
        setSelectedPartner(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedPartner) {
            setPartners(partners.filter(p => p.id !== selectedPartner));
            setDeleteModalOpen(false);
            setSelectedPartner(null);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div>
                    <h1>거래처 관리</h1>
                    <p>거래처, 고객 및 물류 파트너 관리</p>
                </div>
                <button className="primary-btn" onClick={() => navigate('/partners/new')}>
                    <Plus size={18} /> 거래처 등록
                </button>
            </div>

            <div className="content-card">
                <div className="toolbar">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="거래처 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filters">
                        <select>
                            <option>모든 유형</option>
                            <option>공급사 (Supplier)</option>
                            <option>고객사 (Customer)</option>
                            <option>물류 (Logistics)</option>
                        </select>
                        <select>
                            <option>모든 상태</option>
                            <option>활성</option>
                            <option>비활성</option>
                        </select>
                    </div>
                </div>

                <div className="partners-grid">
                    {partners.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((partner) => (
                        <div key={partner.id} className="partner-card">
                            <div className="partner-header">
                                <div className="partner-info">
                                    <h3>{partner.name}</h3>
                                    <span className={`partner-type ${partner.type.toLowerCase()}`}>{partner.type}</span>
                                </div>
                                <div className="card-actions">
                                    <button className="icon-btn edit" onClick={() => navigate(`/partners/${partner.id}`)}>
                                        <MoreVertical size={18} />
                                    </button>
                                    <button className="icon-btn delete" onClick={() => handleDeleteClick(partner.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="partner-details">
                                <div className="detail-row">
                                    <span className="detail-label">담당자:</span>
                                    <span className="detail-value">{partner.contact}</span>
                                </div>
                                <div className="detail-row">
                                    <Mail size={14} className="detail-icon" />
                                    <a href={`mailto:${partner.email}`} className="detail-link">{partner.email}</a>
                                </div>
                                <div className="detail-row">
                                    <Phone size={14} className="detail-icon" />
                                    <a href={`tel:${partner.phone}`} className="detail-link">{partner.phone}</a>
                                </div>
                                <div className="detail-row">
                                    <MapPin size={14} className="detail-icon" />
                                    <span className="detail-value">{partner.address}</span>
                                </div>
                            </div>

                            <div className="partner-footer">
                                <span className={`status-dot ${partner.status.toLowerCase()}`}></span>
                                <span className="status-text">{partner.status === 'Active' ? '활성' : '비활성'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="거래처 삭제 확인"
                footer={
                    <>
                        <button className="secondary-btn" onClick={() => setDeleteModalOpen(false)}>취소</button>
                        <button className="primary-btn danger" onClick={confirmDelete}>삭제</button>
                    </>
                }
            >
                <div className="modal-body-content">
                    <div className="warning-icon-wrapper">
                        <AlertTriangle size={48} className="text-warning" />
                    </div>
                    <p>정말로 <strong>{partners.find(p => p.id === selectedPartner)?.name}</strong> 거래처를 삭제하시겠습니까?</p>
                    <p className="text-sm text-gray">이 작업은 되돌릴 수 없으며, 관련된 모든 데이터가 영구적으로 삭제될 수 있습니다.</p>
                </div>
            </Modal>
        </div>
    );
};

export default PartnerList;
