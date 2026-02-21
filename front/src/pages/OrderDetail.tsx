import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Mail, Download, Package } from 'lucide-react';
import './Orders.css';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`http://localhost:8080/orders/${id}`);
                if (!res.ok) throw new Error('주문 정보를 불러오지 못했습니다.');
                const data = await res.json();
                setOrder(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchOrder();
    }, [id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'status-badge-green';
            case 'SHIPPED': return 'status-badge-blue';
            case 'PROCESSING': return 'status-badge-blue';
            case 'PENDING': return 'status-badge-yellow';
            case 'CANCELLED': return 'status-badge-red';
            default: return 'status-badge-gray';
        }
    };

    if (loading) {
        return <div className="page-container"><p>로딩 중...</p></div>;
    }

    if (error || !order) {
        return (
            <div className="page-container">
                <div className="error-banner" style={{ color: 'red' }}>{error || '주문을 찾을 수 없습니다.'}</div>
                <button onClick={() => navigate('/orders')} className="secondary-btn mt-3">돌아가기</button>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div className="header-left">
                    <button onClick={() => navigate('/orders')} className="back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>주문 상세 정보</h1>
                        <p>주문번호 {order.orderNumber}</p>
                    </div>
                </div>
                <div className="button-group">
                    <button className="secondary-btn">
                        <Printer size={18} /> 인쇄
                    </button>
                    <button className="secondary-btn">
                        <Mail size={18} /> 이메일
                    </button>
                    <button className="primary-btn">
                        <Download size={18} /> 명세서 다운로드
                    </button>
                </div>
            </div>

            <div className="content-layout-grid">
                <div className="main-panel">
                    {/* Order Status Card */}
                    <div className="content-card mb-4">
                        <div className="card-header">
                            <h3>주문 상태</h3>
                            <span className={`status-badge ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="order-dates-grid">
                            <div className="date-item">
                                <span className="label">접수일</span>
                                <span className="value">{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="date-item">
                                <span className="label">마지막 업데이트</span>
                                <span className="value">{new Date(order.updatedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="content-card">
                        <h3>주문 품목</h3>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>상품명</th>
                                        <th className="text-right">단가 (₩)</th>
                                        <th className="text-right">수량</th>
                                        <th className="text-right">합계 (₩)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items && order.items.map((item: any) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="product-cell">
                                                    <div className="product-icon">
                                                        <Package size={16} />
                                                    </div>
                                                    <span>{item.productName || `상품 ID: ${item.productId}`}</span>
                                                </div>
                                            </td>
                                            <td className="text-right">{Number(item.unitPrice).toLocaleString()}</td>
                                            <td className="text-right">{item.quantity}</td>
                                            <td className="text-right fw-bold">{Number(item.subTotal).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={3} className="text-right label-cell">소계</td>
                                        <td className="text-right">₩ {Number(order.totalAmount).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="text-right label-cell">부가세 (추정 10%)</td>
                                        <td className="text-right">₩ {(Number(order.totalAmount) * 0.1).toLocaleString()}</td>
                                    </tr>
                                    <tr className="grand-total-row">
                                        <td colSpan={3} className="text-right label-cell">총 합계</td>
                                        <td className="text-right">₩ {(Number(order.totalAmount) * 1.1).toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="side-panel">
                    {/* Customer Info */}
                    <div className="content-card mb-4">
                        <h3>고객 정보</h3>
                        <div className="info-group">
                            <label>고객명</label>
                            <p className="fw-bold">{order.partnerName || `고객 ID: ${order.partnerId}`}</p>
                        </div>
                    </div>

                    {/* Shipping & Billing */}
                    <div className="content-card">
                        <h3>배송 및 결제</h3>
                        <div className="info-group">
                            <label>배송지</label>
                            <p>{order.shippingAddress || '입력된 주소가 없습니다.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
