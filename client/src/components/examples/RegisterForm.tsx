import RegisterForm from '../RegisterForm';

export default function RegisterFormExample() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <RegisterForm onSubmit={(name, email, password) => {
        console.log('Register:', { name, email, password });
      }} />
    </div>
  );
}
