import { DollarSign, Package, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="page-header">
                <h1>대시보드</h1>
                <p>사업 성과 개요</p>
            </div>

            {/* Summary Cards: 핵심 비즈니스 지표(KPI)를 상단에 요약하여 보여줍니다. */}
            <div className="summary-grid">
                <div className="summary-card">
                    <div className="card-icon blue">
                        <DollarSign size={24} />
                    </div>
                    <div className="card-info">
                        <h3>총 매출</h3>
                        <p className="card-value">$124,500</p>
                        <span className="card-trend positive">
                            <TrendingUp size={14} /> +12.5% 지난달 대비
                        </span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-icon purple">
                        <ShoppingBag size={24} />
                    </div>
                    <div className="card-info">
                        <h3>총 주문</h3>
                        <p className="card-value">1,240</p>
                        <span className="card-trend positive">
                            <TrendingUp size={14} /> +5.2% 지난달 대비
                        </span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-icon orange">
                        <Package size={24} />
                    </div>
                    <div className="card-info">
                        <h3>총 상품</h3>
                        <p className="card-value">356</p>
                        <span className="card-trend neutral">
                            <span>0% 지난달 대비</span>
                        </span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-icon red">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="card-info">
                        <h3>재고 부족 상품</h3>
                        <p className="card-value">12</p>
                        <span className="card-trend negative">
                            <span>확인 필요</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* detailed sections */}
            <div className="dashboard-grid">
                <div className="dashboard-card large">
                    <div className="card-header">
                        <h3>매출 개요</h3>
                        <select className="card-action">
                            <option>이번 주</option>
                            <option>이번 달</option>
                            <option>올 해</option>
                        </select>
                    </div>
                    <div className="chart-placeholder">
                        {/* Mock Chart Bars */}
                        <div className="mock-chart">
                            {[60, 45, 75, 50, 80, 70, 90].map((height, i) => (
                                <div key={i} className="chart-bar-wrapper">
                                    <div className="chart-bar" style={{ height: `${height}%` }}></div>
                                    <span className="chart-label">{['월', '화', '수', '목', '금', '토', '일'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>최근 활동</h3>
                        <button className="view-all-btn">모두 보기</button>
                    </div>
                    <ul className="activity-list">
                        <li className="activity-item">
                            <div className="activity-icon green">S</div>
                            <div className="activity-details">
                                <span className="activity-title">New Order #1024</span>
                                <span className="activity-time">2 mins ago</span>
                            </div>
                            <span className="activity-amount">+$120.00</span>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon blue">I</div>
                            <div className="activity-details">
                                <span className="activity-title">Stock Updated</span>
                                <span className="activity-time">1 hour ago</span>
                            </div>
                            <span className="activity-amount">Manufacturer A</span>
                        </li>
                        <li className="activity-item">
                            <div className="activity-icon purple">U</div>
                            <div className="activity-details">
                                <span className="activity-title">New User Registered</span>
                                <span className="activity-time">3 hours ago</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
