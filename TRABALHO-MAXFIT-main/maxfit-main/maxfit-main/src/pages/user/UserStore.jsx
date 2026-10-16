import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import '../../components/Layout.css';
import { api } from '../../utils/api';

const CATEGORIES = ['Todos', 'Suplemento', 'Vestuário', 'Acessório'];

// Normaliza Produto da API (nome, categoria, preco, estoque, imagem) para o formato do front
function normalizeProduto(p) {
  return {
    id:       p.id,
    name:     p.nome,
    category: p.categoria,
    price:    Number(p.preco),
    stock:    p.estoque,
    image:    p.imagem || '📦',
  };
}

export default function UserStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    api.produtos.list()
      .then(list => setProducts(list.map(normalizeProduto)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'Todos' ? products : products.filter(p => p.category === filter);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  return (
    <Layout role="user">
      <div className="page-header">
        <h2>Loja <span>MaxFit</span></h2>
        <p>Suplementos, vestuário e acessórios</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(cat)}
            >{cat}</button>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={() => setCartOpen(true)} style={{ position: 'relative' }}>
          🛒 Carrinho
          {cartCount > 0 && (
            <span style={{ background: 'var(--green)', color: 'var(--black)', borderRadius: '50%', width: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {loading && <p style={{ color: 'var(--text-dim)' }}>Carregando produtos...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {!loading && filtered.map(p => (
          <div key={p.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>{p.image}</div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.name}</h4>
            <span className="badge badge-gray" style={{ marginBottom: 12, display: 'inline-block', width: 'fit-content' }}>{p.category}</span>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ color: 'var(--green)', fontWeight: 800, fontSize: 18 }}>R$ {p.price.toFixed(2)}</span>
                <span style={{ color: 'var(--white-dim)', fontSize: 12 }}>Estoque: {p.stock}</span>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => addToCart(p)}>
                + Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>

      {cartOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setCartOpen(false)}>
          <div className="modal" style={{ maxWidth: 440 }}>
            <h3>🛒 <span>Carrinho</span></h3>
            {cart.length === 0 ? (
              <div className="empty-state" style={{ padding: 32 }}>
                <div className="empty-icon">🛒</div>
                <p>Seu carrinho está vazio.</p>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 24 }}>{item.image}</span>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p>
                        <p style={{ fontSize: 12, color: 'var(--white-dim)' }}>x{item.qty} · R$ {(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>✕</button>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ color: 'var(--green)', fontWeight: 800, fontSize: 20 }}>R$ {total.toFixed(2)}</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => { toast.success('Pedido realizado com sucesso! 🎉'); setCart([]); setCartOpen(false); }}>
                  FINALIZAR PEDIDO
                </button>
              </>
            )}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setCartOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
