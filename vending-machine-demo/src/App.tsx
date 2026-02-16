import { useState, useMemo } from 'react'
import './App.css'

// Types
interface Product {
  id: string
  name: string
  category: 'mvp' | 'service' | 'ip'
  status: 'available' | 'in-progress' | 'deployed'
  progress: number
  description: string
  features: string[]
  stack: string[]
  metrics?: {
    users?: number
    uptime?: string
    requests?: string
  }
}

// Mock data for the vending machine inventory
const products: Product[] = [
  {
    id: 'mvp-1',
    name: 'Codex CLI',
    category: 'mvp',
    status: 'deployed',
    progress: 100,
    description: 'Terminal-based AI coding agent for seamless development',
    features: ['Interactive TUI', 'Full Auto Mode', 'Model Context Protocol'],
    stack: ['Rust', 'TypeScript', 'Node.js'],
    metrics: { users: 15000, uptime: '99.9%', requests: '1.2M/mo' }
  },
  {
    id: 'mvp-2',
    name: 'DTG Logger',
    category: 'mvp',
    status: 'deployed',
    progress: 100,
    description: 'Event logging system with Sentient Cents minting',
    features: ['Real-time capture', 'Privacy-first', 'Fair compensation'],
    stack: ['Cloudflare Workers', 'GitHub Actions', 'CSV'],
    metrics: { users: 500, uptime: '99.7%', requests: '500K/mo' }
  },
  {
    id: 'mvp-3',
    name: 'Vending Machine UI',
    category: 'mvp',
    status: 'in-progress',
    progress: 85,
    description: 'Visual showcase for the Codex ecosystem products',
    features: ['Dark mode', 'Card filtering', 'Responsive design'],
    stack: ['React', 'TypeScript', 'Vite']
  },
  {
    id: 'service-1',
    name: 'API Gateway',
    category: 'service',
    status: 'deployed',
    progress: 100,
    description: 'Unified API access point for all Codex services',
    features: ['Rate limiting', 'Authentication', 'Load balancing'],
    stack: ['Node.js', 'Express', 'Redis'],
    metrics: { uptime: '99.95%', requests: '5M/mo' }
  },
  {
    id: 'service-2',
    name: 'Analytics Pipeline',
    category: 'service',
    status: 'deployed',
    progress: 100,
    description: 'Automated data processing and analytics',
    features: ['CSV processing', 'Balance calculation', 'Proof ledger'],
    stack: ['Python', 'GitHub Actions', 'Pandas'],
    metrics: { uptime: '99.8%', requests: '200K/mo' }
  },
  {
    id: 'service-3',
    name: 'Monitoring Stack',
    category: 'service',
    status: 'in-progress',
    progress: 65,
    description: 'Real-time monitoring and alerting system',
    features: ['Metrics tracking', 'Alert system', 'Dashboard'],
    stack: ['Prometheus', 'Grafana', 'AlertManager']
  },
  {
    id: 'ip-1',
    name: 'Zero Loss Framework',
    category: 'ip',
    status: 'deployed',
    progress: 100,
    description: 'Privacy-first design principles and implementation',
    features: ['Zero Surprise', 'Full transparency', 'User control'],
    stack: ['Documentation', 'Policy', 'Standards']
  },
  {
    id: 'ip-2',
    name: 'Sentient Cents Protocol',
    category: 'ip',
    status: 'deployed',
    progress: 100,
    description: 'Fair compensation model for user engagement',
    features: ['Minting rules', 'Value calculation', 'Distribution'],
    stack: ['Algorithm', 'Smart contracts', 'Documentation']
  },
  {
    id: 'ip-3',
    name: 'Sandbox Security Model',
    category: 'ip',
    status: 'in-progress',
    progress: 90,
    description: 'Multi-platform sandboxing architecture',
    features: ['Apple Seatbelt', 'Landlock', 'Seccomp'],
    stack: ['Rust', 'C', 'Linux kernel APIs']
  }
]

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const stats = useMemo(() => {
    const deployed = products.filter(p => p.status === 'deployed').length
    const inProgress = products.filter(p => p.status === 'in-progress').length
    const avgProgress = Math.round(products.reduce((acc, p) => acc + p.progress, 0) / products.length)
    return { deployed, inProgress, avgProgress, total: products.length }
  }, [])

  return (
    <div className="app">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="badge">🚀 Live Demo</div>
          <h1 className="hero-title">
            Codex Vending Machine
          </h1>
          <p className="hero-subtitle">
            Your one-stop shop for AI-powered development tools, services, and intellectual property
          </p>
        </div>
        <div className="hero-glow"></div>
      </header>

      {/* Status Bar */}
      <section className="status-bar">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.deployed}</div>
          <div className="stat-label">Deployed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.avgProgress}%</div>
          <div className="stat-label">Avg Progress</div>
        </div>
      </section>

      {/* Filters */}
      <section className="filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filters">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'mvp' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('mvp')}
          >
            MVPs
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'service' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('service')}
          >
            Services
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'ip' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('ip')}
          >
            IP
          </button>
        </div>
      </section>

      {/* Product Lanes */}
      <section className="product-lanes">
        <div className="lane">
          <h2 className="lane-title">
            <span className="lane-icon">🎯</span> MVP Lane
          </h2>
          <div className="product-grid">
            {filteredProducts
              .filter(p => p.category === 'mvp')
              .map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>

        <div className="lane">
          <h2 className="lane-title">
            <span className="lane-icon">⚙️</span> Service Lane
          </h2>
          <div className="product-grid">
            {filteredProducts
              .filter(p => p.category === 'service')
              .map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>

        <div className="lane">
          <h2 className="lane-title">
            <span className="lane-icon">💎</span> IP Lane
          </h2>
          <div className="product-grid">
            {filteredProducts
              .filter(p => p.category === 'ip')
              .map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Built with ❤️ using React + Vite • Part of the OpenAI Codex Ecosystem</p>
        <a href="https://github.com/openai/codex" target="_blank" rel="noopener noreferrer" className="footer-link">
          View on GitHub →
        </a>
      </footer>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const statusColors = {
    available: '#10b981',
    'in-progress': '#f59e0b',
    deployed: '#3b82f6'
  }

  return (
    <div className={`product-card status-${product.status}`}>
      <div className="card-header">
        <h3 className="card-title">{product.name}</h3>
        <span className="status-badge" style={{ backgroundColor: statusColors[product.status] }}>
          {product.status.replace('-', ' ')}
        </span>
      </div>
      
      <p className="card-description">{product.description}</p>
      
      <div className="progress-section">
        <div className="progress-label">
          <span>Progress</span>
          <span className="progress-value">{product.progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${product.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="features">
        <div className="features-label">Features</div>
        <div className="feature-tags">
          {product.features.map((feature, idx) => (
            <span key={idx} className="feature-tag">{feature}</span>
          ))}
        </div>
      </div>

      <div className="stack">
        <div className="stack-label">Stack</div>
        <div className="stack-tags">
          {product.stack.map((tech, idx) => (
            <span key={idx} className="stack-tag">{tech}</span>
          ))}
        </div>
      </div>

      {product.metrics && (
        <div className="metrics">
          {product.metrics.users && (
            <div className="metric">
              <span className="metric-icon">👥</span>
              <span className="metric-value">{product.metrics.users.toLocaleString()}</span>
            </div>
          )}
          {product.metrics.uptime && (
            <div className="metric">
              <span className="metric-icon">⚡</span>
              <span className="metric-value">{product.metrics.uptime}</span>
            </div>
          )}
          {product.metrics.requests && (
            <div className="metric">
              <span className="metric-icon">📊</span>
              <span className="metric-value">{product.metrics.requests}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
