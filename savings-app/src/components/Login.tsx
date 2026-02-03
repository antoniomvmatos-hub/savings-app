import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ajusta para a porta correta que estás a usar no Visual Studio
      const response = await axios.post('https://localhost:7219/api/auth/login', {
        username,
        password
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      onLoginSuccess(token);
    } catch (error) {
      alert('Credenciais inválidas!');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <form onSubmit={handleLogin} style={{ background: '#f4f4f4', padding: '2rem', borderRadius: '8px' }}>
        <h2>Login - Savings App</h2>
        <input type="text" placeholder="Utilizador" onChange={e => setUsername(e.target.value)} style={{marginBottom: '10px', display: 'block', width: '100%'}} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{marginBottom: '10px', display: 'block', width: '100%'}} />
        <button type="submit" className="button primary">Entrar</button>
      </form>
    </div>
  );
};

export default Login;