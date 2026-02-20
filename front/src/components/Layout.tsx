import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    Warehouse,
    Menu,
    LogOut,
    ArrowUpRight,
    X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import './Layout.css';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    // Close sidebar on route change for mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    return (
        <div className="layout-container">
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="header-logo-section">
                        <Warehouse className="logo-icon" />
                        {isSidebarOpen && <span className="logo-text">MyERP</span>}
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        className="mobile-close-btn"
                        onClick={() => setIsSidebarOpen(false)}
                        style={{ display: window.innerWidth <= 768 && isSidebarOpen ? 'block' : 'none' }}
                    >
                        <X size={20} color="white" />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        {isSidebarOpen && <span>대시보드</span>}
                    </Link>

                    <div className="nav-group">
                        <div className="nav-group-title">{isSidebarOpen && '관리'}</div>

                        <Link to="/products" className={`nav-item ${isActive('/products') ? 'active' : ''}`}>
                            <Package size={20} />
                            {isSidebarOpen && <span>상품 관리</span>}
                        </Link>

                        <Link to="/partners" className={`nav-item ${isActive('/partners') ? 'active' : ''}`}>
                            <Users size={20} />
                            {isSidebarOpen && <span>거래처 관리</span>}
                        </Link>

                        <Link to="/orders" className={`nav-item ${isActive('/orders') ? 'active' : ''}`}>
                            <ShoppingCart size={20} />
                            {isSidebarOpen && <span>주문 관리</span>}
                        </Link>

                        <Link to="/inventory" className={`nav-item ${location.pathname === '/inventory' ? 'active' : ''}`}>
                            <Warehouse size={20} />
                            {isSidebarOpen && <span>재고 현황</span>}
                        </Link>

                        <Link to="/inventory/history" className={`nav-item ${isActive('/inventory/history') ? 'active' : ''}`}>
                            <ArrowUpRight size={20} />
                            {isSidebarOpen && <span>입출고 이력</span>}
                        </Link>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item logout-btn">
                        <LogOut size={20} />
                        {isSidebarOpen && <span>로그아웃</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-wrapper">
                <header className="top-header">
                    <button onClick={toggleSidebar} className="menu-btn">
                        <Menu size={24} />
                    </button>
                    <div className="header-user">
                        <span>Admin User</span>
                        <div className="avatar">A</div>
                    </div>
                </header>

                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
