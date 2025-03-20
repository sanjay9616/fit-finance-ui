import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch('https://fit-finance.onrender.com/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      setMessage(`User created successfully: ${data.name}`);
      setFormData({ name: '', email: '', password: '' });
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold">Welcome to My Next.js App</h2>
      <p className="mt-4">This is a simple app using a reusable layout with Header and Footer.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          className="border p-2 w-full"
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 w-full"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 w-full"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">Create User</button>
      </form>

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}
