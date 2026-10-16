import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTransactions } from '../../contexts/TransactionContext';
import Layout from '../../components/Layout';
import { SkeletonCard } from '../../components/Skeleton';
import '../../components/Layout.css';
import '../../components/Skeleton.css';
import { api } from '../../utils/api';

const emptyForm = { name: '', category: 'Suplemento', price: '', stock: '', image: '' };

const CATEGORIES = ['Todos', 'Suplemento', 'Vestuário', 'Acessório'];
const ICONS = ['📦', '💪', '🥤', '👕', '🩳', '🎽', '⚡', '🔥', '🏋️', '🧴', '🥗', '🍎'];
const PAGE_SIZE = 6;

// Normaliza Produto da API (nome, categoria, preco, estoque, imagem) para o formato do front
function normalizeProduto(p) {
  return {
    id:       p.id,
    name:     p.nome,
    category: p.categoria,
    price:    Number(p.preco),
    stock:    p.estoque,
    image:    p.imagem || '',
  };
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Todos');
  const [page, setPage] = useState(1);
  const { addLog } = useTransactions();

  useEffect(() => {
    api.produtos.list()
      .then(list => setProducts(list.map(normalizeProduto)))
      .catch(err => toast.error(err.message || 'Erro ao carregar produtos.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchCat = catFilter === 'Todos' || p.category === catFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openNew() { setForm(emptyForm); setEditId(null); setModal(true); }
  function openEdit(p) { setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, image: p.image }); setEditId(p.id); setModal(true); }

  async function save() {
    if (!form.name || !form.price) { toast.error('Preencha nome e preço.'); return; }
    const payload = {
      nome:      form.name,
      categoria: form.category,
      preco:     Number(form.price),
      estoque:   Number(form.stock) || 0,
      imagem:    form.image,
    };
    try {
      if (editId) {
        const updated = await api.produtos.update(editId, payload);
        setProducts(prev => prev.map(p => p.id === editId ? normalizeProduto(updated) : p));
        toast.success('Produto atualizado!');
      } else {
        const created = await api.produtos.create(payload);
        setProducts(prev => [...prev, normalizeProduto(created)]);
        toast.success('Produto cadastrado!');
      }
      setModal(false);
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar produto.');
    }
  }

  async function remove(id) {
    try {
      await api.produtos.remove(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Produto removido.');
    } catch (err) {
      toast.error(err.message || 'Erro ao remover produto.');
    }
  }

  async function quickSell(p) {
    if (p.stock <= 0) { toast.error('Estoque esgotado!'); return; }
    try {
      const updated = await api.produtos.update(p.id, {
        nome: p.name, categoria: p.category, preco: p.price, estoque: p.stock - 1, imagem: p.image,
      });
      setProducts(prev => prev.map(x => x.id === p.id ? normalizeProduto(updated) : x));
      addLog(p);
      toast.success(`Venda de "${p.name}" registrada!`);
    } catch (err) {
      toast.error(err.message || 'Erro ao registrar venda.');
    }
  }

  return (
    <Layout role="admin">
      <div className="page-header">
        <h2>Gestão de <span>Produtos</span></h2>
        <p>{products.length} produtos cadastrados</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input style={{ maxWidth: 240 }} placeholder="Buscar produto..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {CATEGORIES.map(c => (
            <button key={c} className={`btn btn-sm ${catFilter === c ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setCatFilter(c); setPage(1); }}>{c}</button>
          ))}
        </div>
        <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={openNew}>+ Novo Produto</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        {!loading && paginated.map(p => {
          const lowStock = p.stock < 10;
          return (
            <div key={p.id} className="card" style={{ padding: 20, borderColor: lowStock ? 'rgba(255,59,59,0.4)' : undefined }}>
              <div style={{ fontSize: 40, marginBottom: 12, textAlign: 'center' }}>{p.image || '📦'}</div>
              {lowStock && (
                <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: 6, padding: '4px 8px', fontSize: 11, color: 'var(--red)', textAlign: 'center', marginBottom: 8, fontWeight: 700 }}>
                  ESTOQUE CRITICO
                </div>
              )}
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{p.name}</h4>
              <span className="badge badge-gray" style={{ marginBottom: 12, display: 'inline-block' }}>{p.category}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ color: 'var(--green)', fontWeight: 800, fontSize: 18 }}>R$ {Number(p.price).toFixed(2)}</span>
                <span style={{ color: lowStock ? 'var(--red)' : 'var(--text-dim)', fontSize: 13, fontWeight: lowStock ? 700 : 400 }}>Estoque: {p.stock}</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => openEdit(p)}>Editar</button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => quickSell(p)}>Vender</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}></button>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
          <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹ Anterior</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
          <button className="btn btn-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Próximo ›</button>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <h3>{editId ? 'Editar' : 'Novo'} <span>Produto</span></h3>
            <div className="form-grid">
              <div className="field-group full">
                <label>Nome do Produto</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Whey Protein 1kg" />
              </div>
              <div className="field-group">
                <label>Categoria</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  <option>Suplemento</option><option>Vestuário</option><option>Acessório</option>
                </select>
              </div>
              <div className="field-group">
                <label>Preço (R$)</label>
                <input type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0.00" />
              </div>
              <div className="field-group">
                <label>Estoque</label>
                <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} placeholder="0" />
              </div>
              <div className="field-group full">
                <label>Icone</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  {ICONS.map(em => (
                    <button key={em} type="button" className={`btn btn-sm ${form.image === em ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: 18, padding: '6px 10px' }} onClick={() => setForm(p => ({ ...p, image: em }))}>{em}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={save}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
