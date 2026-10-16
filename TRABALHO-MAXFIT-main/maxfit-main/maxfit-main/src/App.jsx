import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminWorkouts from './pages/admin/AdminWorkouts';
import AdminDiets from './pages/admin/AdminDiets';
import AdminProducts from './pages/admin/AdminProducts';
import RegisterPersonal from './pages/admin/RegisterPersonal';
import RegisterAdmin from './pages/admin/RegisterAdmin';
import UserDashboard from './pages/user/UserDashboard';
import UserWorkouts from './pages/user/UserWorkouts';
import UserDiet from './pages/user/UserDiet';
import UserStore from './pages/user/UserStore';

function RequireAuth({ children, role }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (role) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(auth.role)) return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Home />} />

      {/* Autenticação */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas exclusivas de Admin */}
      <Route path="/admin"                    element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/products"           element={<RequireAuth role="admin"><AdminProducts /></RequireAuth>} />
      <Route path="/admin/register/personal"  element={<RequireAuth role="admin"><RegisterPersonal /></RequireAuth>} />
      <Route path="/admin/register/admin"     element={<RequireAuth role="admin"><RegisterAdmin /></RequireAuth>} />

      {/* Rotas compartilhadas entre Admin e Personal */}
      <Route path="/admin/users"    element={<RequireAuth role={['admin', 'personal']}><AdminUsers /></RequireAuth>} />
      <Route path="/admin/workouts" element={<RequireAuth role={['admin', 'personal']}><AdminWorkouts /></RequireAuth>} />
      <Route path="/admin/diets"    element={<RequireAuth role={['admin', 'personal']}><AdminDiets /></RequireAuth>} />

      {/* Rotas do Aluno */}
      <Route path="/dashboard"          element={<RequireAuth role="user"><UserDashboard /></RequireAuth>} />
      <Route path="/dashboard/workouts" element={<RequireAuth role="user"><UserWorkouts /></RequireAuth>} />
      <Route path="/dashboard/diet"     element={<RequireAuth role="user"><UserDiet /></RequireAuth>} />
      <Route path="/dashboard/store"    element={<RequireAuth role="user"><UserStore /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
