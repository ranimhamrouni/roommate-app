import AuthCard from '@/components/ui/auth/AuthCard'
import LoginForm from '@/components/ui/auth/LoginForm';

const LoginPage = () => {
  return (
    <AuthCard title="Welcome back! 👋">
        <LoginForm/>
    </AuthCard>
  )
}

export default LoginPage;
