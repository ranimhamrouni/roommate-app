import AuthCard from '@/components/auth/AuthCard'
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = () => {
  return (
    <AuthCard title="Welcome back! 👋">
        <LoginForm/>
    </AuthCard>
  )
}

export default LoginPage;
