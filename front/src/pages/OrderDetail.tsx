import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Mail, Download, Package } from 'lucide-react';
import './Orders.css';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Data - In a real app, fetch based on ID
    const order = {
        id: id || 'ORD-2023-001',
        customer: 'Acme Corp',
        date: '2023-10-25',
        status: 'Completed',
        total: 1250.00,
        items: [
            { id: 1, product: 'Premium Widget', quantity: 5, price: 120.00, total: 600.00 },
            { id: 2, product: 'Basic Part', quantity: 50, price: 12.00, total: 600.00 },
            { id: 3, product: 'Installation Service', quantity: 1, price: 50.00, total: 50.00 },
        ],
        shippingAddress: '123 Industry Way, Tech City, TC 90210',
        billingAddress: '123 Industry Way, Tech City, TC 90210',
        paymentMethod: 'Credit Card (**** 1234)'
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'status-badge-green';
            case 'Processing': return 'status-badge-blue';
            case 'Pending': return 'status-badge-yellow';
            case 'Cancelled': return 'status-badge-red';
            default: return 'status-badge-gray';
        }
    };

    return (
        <div className="page-container">
            <div className="page-header-row">
                <div className="header-left">
                    <button onClick={() => navigate('/orders')} className="back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>주문 상세 정보</h1>
                        <p>주문번호 #{order.id}</p>
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
                                <span className="label">주문일</span>
                                <span className="value">{order.date}</span>
                            </div>
                            <div className="date-item">
                                <span className="label">결제일</span>
                                <span className="value">{order.date}</span>
                            </div>
                            <div className="date-item">
                                <span className="label">배송일</span>
                                <span className="value">{order.status === 'Completed' ? '2023-10-27' : '-'}</span>
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
                                        <th className="text-right">단가</th>
                                        <th className="text-right">수량</th>
                                        <th className="text-right">합계</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="product-cell">
                                                    <div className="product-icon">
                                                        <Package size={16} />
                                                    </div>
                                                    <span>{item.product}</span>
                                                </div>
                                            </td>
                                            <td className="text-right">${item.price.toFixed(2)}</td>
                                            <td className="text-right">{item.quantity}</td>
                                            <td className="text-right fw-bold">${item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={3} className="text-right label-cell">소계</td>
                                        <td className="text-right">${order.total.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="text-right label-cell">세금 (10%)</td>
                                        <td className="text-right">${(order.total * 0.1).toFixed(2)}</td>
                                    </tr>
                                    <tr className="grand-total-row">
                                        <td colSpan={3} className="text-right label-cell">총 합계</td>
                                        <td className="text-right">${(order.total * 1.1).toFixed(2)}</td>
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
                            <p className="fw-bold">{order.customer}</p>
                        </div>
                        <div className="info-group">
                            <label>담당자</label>
                            <p>John Smith</p>
                        </div>
                        <div className="info-group">
                            <label>이메일</label>
                            <p>john@acme.com</p>
                        </div>
                    </div>

                    {/* Shipping & Billing */}
                    <div className="content-card">
                        <h3>배송 및 결제</h3>
                        <div className="info-group">
                            <label>배송지</label>
                            <p>{order.shippingAddress}</p>
                        </div>
                        <div className="info-group">
                            <label>청구지</label>
                            <p>{order.billingAddress}</p>
                        </div>
                        <div className="info-group">
                            <label>결제 수단</label>
                            <p>{order.paymentMethod}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
