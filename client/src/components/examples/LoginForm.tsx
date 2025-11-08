import LoginForm from '../LoginForm';

export default function LoginFormExample() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm onSubmit={(email, password) => {
        console.log('Login:', { email, password });
      }} />
    </div>
  );
}
