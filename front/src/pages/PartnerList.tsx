import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Phone, Mail, MapPin, Trash2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../components/Modal';
import './Partners.css';

const PartnerList = () => {
    const navigate = useNavigate();

    // States
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('All');

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<any | null>(null);

    const fetchPartners = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm.trim()) params.append('keyword', searchTerm.trim());
            if (searchType !== 'All') params.append('type', searchType);
            params.append('page', currentPage.toString());
            params.append('size', '10');

            const response = await fetch(`http://localhost:8080/partners?${params.toString()}`);
            if (!response.ok) {
                throw new Error('데이터를 불러오는데 실패했습니다.');
            }
            const data = await response.json();
            setPartners(data.content);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, [currentPage, searchType]);

    const handleDeleteClick = (partner: any) => {
        setSelectedPartner(partner);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedPartner) return;

        try {
            const response = await fetch(`http://localhost:8080/partners/${selectedPartner.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('삭제에 실패했습니다.');
            }

            setDeleteModalOpen(false);
            setSelectedPartner(null);
            fetchPartners(); // Reload list
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading && partners.length === 0) return <div className="page-container"><p>로딩 중...</p></div>;
    if (error) return <div className="page-container"><p className="error-text">에러: {error}</p></div>;

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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="search-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="거래처명 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setCurrentPage(0);
                                        fetchPartners();
                                    }
                                }}
                            />
                        </div>
                        <button
                            className="primary-btn"
                            style={{ marginLeft: '8px', padding: '0.5rem 1rem' }}
                            onClick={() => {
                                setCurrentPage(0);
                                fetchPartners();
                            }}
                        >
                            검색
                        </button>
                    </div>
                    <div className="filters">
                        <select value={searchType} onChange={(e) => {
                            setSearchType(e.target.value);
                            setCurrentPage(0);
                        }}>
                            <option value="All">모든 유형</option>
                            <option value="Supplier">공급사 (Supplier)</option>
                            <option value="Customer">고객사 (Customer)</option>
                            <option value="Logistics">물류 (Logistics)</option>
                        </select>
                    </div>
                </div>

                <div className="partners-grid">
                    {partners.map((partner) => (
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
                                    <button className="icon-btn delete" onClick={() => handleDeleteClick(partner)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="partner-details">
                                <div className="detail-row">
                                    <span className="detail-label">담당자:</span>
                                    <span className="detail-value">{partner.contactPerson || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <Mail size={14} className="detail-icon" />
                                    {partner.email ? <a href={`mailto:${partner.email}`} className="detail-link">{partner.email}</a> : <span>-</span>}
                                </div>
                                <div className="detail-row">
                                    <Phone size={14} className="detail-icon" />
                                    {partner.phone ? <a href={`tel:${partner.phone}`} className="detail-link">{partner.phone}</a> : <span>-</span>}
                                </div>
                                <div className="detail-row">
                                    <MapPin size={14} className="detail-icon" />
                                    <span className="detail-value">{partner.address || '-'}</span>
                                </div>
                            </div>

                            <div className="partner-footer">
                                <span className={`status-dot ${partner.status?.toLowerCase() === 'active' ? 'active' : 'inactive'}`}></span>
                                <span className="status-text">{partner.status === 'Active' ? '활성' : '비활성'}</span>
                            </div>
                        </div>
                    ))}
                    {partners.length === 0 && !loading && (
                        <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1', color: '#6b7280' }}>
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination-wrapper">
                        <span className="pagination-info">
                            총 {totalPages} 페이지 중 {currentPage + 1} 페이지
                        </span>
                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            >
                                <ChevronLeft size={16} /> 이전
                            </button>
                            <button
                                className="pagination-btn"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            >
                                다음 <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
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
                    <p>정말로 <strong>{selectedPartner?.name}</strong> 거래처를 삭제하시겠습니까?</p>
                    <p className="text-sm text-gray">이 작업은 되돌릴 수 없으며, 관련된 모든 데이터가 논리적으로 삭제 처리됩니다.</p>
                </div>
            </Modal>
        </div>
    );
};

export default PartnerList;
