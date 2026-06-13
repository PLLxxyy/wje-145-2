import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type Script } from '../api';
import { Stars, DifficultyTag } from '../components/Shared';

export default function MyWishlist() {
  const navigate = useNavigate();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [unwishingId, setUnwishingId] = useState<number | null>(null);

  const load = async () => {
    try {
      const { scripts } = await api.getMyWishlist();
      setScripts(scripts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleUnwish = async (id: number) => {
    setUnwishingId(id);
    try {
      await api.unwishScript(id);
      setScripts(prev => prev.filter(s => s.id !== id));
    } finally {
      setUnwishingId(null);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#808098' }}>加载中...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h1 className="page-title">我的想玩</h1>
        <button className="btn btn-secondary btn-small" onClick={() => navigate('/scripts')}>
          浏览更多剧本 &rarr;
        </button>
      </div>
      <p className="page-subtitle">你收藏的剧本，随时可以安排起来</p>

      {scripts.length === 0 ? (
        <div className="empty-state">
          <p>还没有想玩的剧本</p>
          <span style={{ fontSize: '0.9rem' }}>去剧本列表逛逛，遇到感兴趣的就标记一下吧</span>
        </div>
      ) : (
        <div className="card-grid">
          {scripts.map(script => (
            <div key={script.id} style={{ position: 'relative' }}>
              <Link to={`/scripts/${script.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="card-title">{script.title}</div>
                    <button
                      className="wish-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnwish(script.id);
                      }}
                      disabled={unwishingId === script.id}
                      title="取消想玩"
                    >
                      ❤️
                    </button>
                  </div>
                  <div className="card-info">
                    <DifficultyTag difficulty={script.difficulty} />
                    <span className="card-tag">{script.duration}分钟</span>
                    <span className="card-tag">{script.min_players}-{script.max_players}人</span>
                  </div>
                  <Stars score={script.avg_score} count={script.rating_count} />
                  <p className="card-desc" style={{ marginTop: '0.6rem' }}>{script.description}</p>
                  {script.wished_at && (
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      收藏于 {new Date(script.wished_at).toLocaleDateString('zh-CN')}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
