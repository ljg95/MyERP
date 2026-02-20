import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login logic
        console.log('Logging in with:', email, password);
        navigate('/');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>환영합니다</h2>
                    <p>계정에 로그인하세요</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">이메일 주소</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                placeholder="이메일을 입력하세요"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                placeholder="비밀번호를 입력하세요"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-button">
                        <span>로그인</span>
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p>계정이 없으신가요? <Link to="/register">회원가입</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
