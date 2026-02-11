import { useState } from 'react';
import { useAuth } from './useAuth';

export default function Register({ onToggle }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { signUp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const data = await signUp(email, password, fullName);
            if (data?.user?.identities?.length === 0) {
                setError('An account with this email already exists');
            } else {
                setSuccess('Account created! Check your email to confirm your account.');
            }
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <h2>Create your account</h2>
            <p className="auth-subtitle">Start your travel journey today</p>

            <form onSubmit={handleSubmit}>
                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reg-email">Email address</label>
                    <input
                        id="reg-email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reg-password">Password</label>
                    <input
                        id="reg-password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="********"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="auth-btn"
                >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <p className="auth-toggle">
                Already have an account?{' '}
                <button type="button" onClick={onToggle}>Sign in</button>
            </p>
        </div>
    );
}
