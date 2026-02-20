import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock register logic
        console.log('Registering with:', formData);
        navigate('/');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>계정 생성</h2>
                    <p>무료 계정으로 시작하세요</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">이름</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="홍길동"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">이메일 주소</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                placeholder="비밀번호 생성"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">비밀번호 확인</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="비밀번호 확인"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-button">
                        <span>회원가입</span>
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
