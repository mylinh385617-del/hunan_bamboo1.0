import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, Navigate, useLocation, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatAssistant from './components/ChatAssistant';
import { APP_TITLE } from './constants';
import { Menu, Search, Clock, Eye, ChevronRight, BookOpen, Tag as TagIcon } from 'lucide-react';
import { Article } from './types';
import { DataProvider, useData } from './contexts/DataContext';
import { AdminRoutes } from './components/AdminViews';

// --- Inner Components for Views ---

const HomeView: React.FC = () => {
  const { data: collections } = useData();
  
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-bamboo-dark opacity-50 -z-10"></div>
        <span className="bg-bamboo-light px-4 text-vermilion font-bold tracking-widest uppercase text-sm">Changsha Bamboo Slips</span>
        <h1 className="font-calligraphy text-6xl md:text-7xl text-ink-black mt-4 mb-6">{APP_TITLE}</h1>
        <p className="font-serif text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          探寻中华文明的墨迹，解读千年历史的密码。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((era) => (
            <div key={era.id} className="bg-white border border-stone-200 p-6 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-ink-black mb-4 border-b border-vermilion pb-2 inline-block">
                    {era.name}
                </h2>
                <ul className="space-y-2">
                    {era.categories.slice(0, 5).map(cat => (
                        <li key={cat.id}>
                            <Link to={`/category/${cat.id}`} className="text-stone-600 hover:text-vermilion hover:underline font-serif text-sm flex items-center">
                                <span className="w-1.5 h-1.5 bg-stone-300 rounded-full mr-2"></span>
                                {cat.name}
                            </Link>
                        </li>
                    ))}
                    {era.categories.length > 5 && (
                        <li className="text-xs text-stone-400 italic pt-1">...等{era.categories.length}个系列</li>
                    )}
                </ul>
            </div>
        ))}
      </div>
    </div>
  );
};

const CategoryView: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { data: collections } = useData();
  
  const data = useMemo(() => {
    for (const era of collections) {
      const cat = era.categories.find(c => c.id === categoryId);
      if (cat) return { era, category: cat };
    }
    return null;
  }, [categoryId, collections]);

  if (!data) return <Navigate to="/" />;
  const { era, category } = data;

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-stone-500 text-sm mb-8 font-serif">
          <Link to="/" className="cursor-pointer hover:text-vermilion">首页</Link>
          <ChevronRight size={14} />
          <span>{era.name}</span>
          <ChevronRight size={14} />
          <span className="text-ink-black font-bold">{category.name}</span>
      </nav>

      <header className="mb-10 border-b-2 border-vermilion pb-4">
        <h1 className="font-serif text-4xl font-bold text-ink-black mb-2">{category.name}</h1>
        <p className="text-stone-500 font-serif">共收录文章 {category.articles.length} 篇</p>
      </header>

      <div className="space-y-4">
        {category.articles.map(article => (
          <div 
            key={article.id}
            onClick={() => navigate(`/article/${article.id}`)}
            className="bg-white p-6 border border-stone-200 hover:border-vermilion hover:shadow-md transition-all cursor-pointer group"
          >
            <h3 className="font-serif text-xl font-bold text-ink-black group-hover:text-vermilion mb-2">
                {article.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-stone-400 font-serif mb-3">
                 <span>{article.publishDate || '暂无日期'}</span>
                 <span>作者: {article.author || '简牍研究中心'}</span>
                 <div className="flex items-center gap-1">
                     <Eye size={12} /> {article.views}
                 </div>
            </div>
            {article.tags && article.tags.length > 0 && (
                <div className="flex gap-2 mb-2">
                    {article.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full flex items-center">
                            <TagIcon size={10} className="mr-1"/> {tag}
                        </span>
                    ))}
                </div>
            )}
            <p className="text-stone-600 text-sm font-serif line-clamp-2">
                {article.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArticleDetailView: React.FC = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { data: collections } = useData();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  const data = useMemo(() => {
    for (const era of collections) {
      for (const cat of era.categories) {
        const art = cat.articles.find(a => a.id === articleId);
        if (art) return { era, category: cat, article: art };
      }
    }
    return null;
  }, [articleId, collections]);

  if (!data) return <Navigate to="/" />;
  const { era, category, article } = data;

  return (
    <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto py-10 px-6 md:px-12">
            {/* Nav */}
            <nav className="flex items-center gap-2 text-stone-500 text-xs mb-10 font-serif border-b border-stone-200 pb-2">
                <Link to="/" className="cursor-pointer hover:text-vermilion">首页</Link>
                <ChevronRight size={12} />
                <Link to={`/category/${category.id}`} className="cursor-pointer hover:text-vermilion">{category.name}</Link>
                <ChevronRight size={12} />
                <span className="text-ink-black">正文</span>
            </nav>

            {/* Article Layout based on Reference */}
            <article className="font-serif">
                {/* Meta Header */}
                <div className="text-right text-xs text-green-700 mb-2 font-sans">
                    发布时间: {article.publishDate || '2025-11-21'} 浏览次数: {article.views}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-center text-ink-black mb-4 tracking-wide leading-tight">
                    {article.title}
                </h1>

                {/* Author Info */}
                <div className="text-center mb-8">
                    <div className="text-stone-600 mb-1 text-sm">
                        {article.author} <span className="text-green-600 cursor-pointer hover:underline">[搜索该作者其他文章]</span>
                    </div>
                    <div className="text-stone-500 text-xs">
                        (武汉大学简牍研究中心)
                    </div>
                    <div className="text-stone-400 text-xs mt-1">
                        (首发)
                    </div>
                </div>

                 {/* Tags Display */}
                {article.tags && article.tags.length > 0 && (
                    <div className="flex justify-center gap-2 mb-6">
                        {article.tags.map(tag => (
                            <span key={tag} className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full border border-stone-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="w-8 h-px bg-stone-300 mx-auto mb-10"></div>

                {/* Content Body */}
                <div 
                    className="article-content text-lg leading-loose text-ink-black text-justify"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </article>

            {/* Footer Navigation */}
             <div className="mt-16 pt-8 border-t border-stone-200 flex justify-between text-sm font-serif">
                <button 
                  onClick={() => navigate(`/category/${category.id}`)}
                  className="flex items-center text-stone-600 hover:text-vermilion"
                >
                   <ChevronRight className="rotate-180 mr-1" size={16} /> 返回列表
                </button>
             </div>
        </div>
        
        {/* Custom Styles for injected HTML content to match the reference */}
        <style>{`
           .article-content .slip-tag {
              display: inline-block;
              background-color: #d1d5db;
              padding: 0 4px;
              font-family: monospace;
              font-size: 0.9em;
              margin: 0 2px;
              color: #1f2937;
           }
           .article-content sup {
              color: #b91c1c;
              font-weight: bold;
              margin-left: 2px;
           }
           .article-content p {
             margin-bottom: 1.5em;
           }
        `}</style>
    </div>
  );
};

const SearchView: React.FC = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { data: collections, tags } = useData();
    
    // Flatten articles for search
    const allArticles = useMemo(() => {
        const results: { era: string, category: string, article: Article }[] = [];
        collections.forEach(era => {
            era.categories.forEach(cat => {
                cat.articles.forEach(art => {
                    results.push({ era: era.name, category: cat.name, article: art });
                });
            });
        });
        return results;
    }, [collections]);

    const filteredResults = useMemo(() => {
        if (!query.trim()) return [];
        const lowerQ = query.toLowerCase();
        
        // Check for tag match
        const isTagSearch = tags.some(t => t.name.toLowerCase() === lowerQ);
        
        return allArticles.filter(item => 
            item.article.title.toLowerCase().includes(lowerQ) || 
            item.article.content.toLowerCase().includes(lowerQ) ||
            (item.article.tags && item.article.tags.some(t => t.toLowerCase().includes(lowerQ)))
        );
    }, [query, allArticles, tags]);

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <h1 className="font-serif text-2xl font-bold mb-6 flex items-center">
                <Search className="mr-3" /> 全文检索
            </h1>
            
            <input 
               type="text" 
               className="w-full border border-stone-300 p-4 font-serif text-lg rounded-sm focus:outline-none focus:border-vermilion bg-white shadow-inner mb-4"
               placeholder="输入关键词、作者或标签搜索..."
               value={query}
               onChange={e => setQuery(e.target.value)}
               autoFocus
            />

            {/* Tag Cloud */}
            <div className="mb-8 flex flex-wrap gap-2">
               <span className="text-xs text-stone-500 py-1">热门标签:</span>
               {tags.map(tag => (
                   <button 
                     key={tag.id} 
                     onClick={() => setQuery(tag.name)}
                     className="text-xs bg-stone-100 hover:bg-vermilion hover:text-white px-3 py-1 rounded-full text-stone-600 transition-colors"
                   >
                       {tag.name}
                   </button>
               ))}
            </div>

            {query && (
                <div className="space-y-4">
                   <p className="text-sm text-stone-500 mb-4">找到 {filteredResults.length} 条结果</p>
                   {filteredResults.map((item, idx) => (
                       <div 
                         key={idx}
                         onClick={() => navigate(`/article/${item.article.id}`)}
                         className="bg-white p-4 border-b border-stone-200 cursor-pointer hover:bg-stone-50"
                       >
                           <h3 className="font-bold text-vermilion font-serif mb-1">{item.article.title}</h3>
                           <div className="text-xs text-stone-400 mb-2 flex gap-2">
                               <span>{item.era} &gt; {item.category}</span>
                               <span>&middot;</span>
                               <span>{item.article.author}</span>
                           </div>
                           {item.article.tags && (
                               <div className="flex gap-1 mb-2">
                                  {item.article.tags.map(t => (
                                      <span key={t} className="text-[10px] bg-stone-100 px-2 rounded text-stone-500">{t}</span>
                                  ))}
                               </div>
                           )}
                           <p className="text-sm text-stone-600 line-clamp-2 font-serif">
                               {item.article.summary || item.article.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                           </p>
                       </div>
                   ))}
                   {filteredResults.length === 0 && (
                       <div className="text-center py-10 text-stone-400">未找到相关内容</div>
                   )}
                </div>
            )}
        </div>
    );
};

// --- Main Layout Wrapper ---

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If in admin routes, don't show the standard sidebar/header layout in the same way, or customize it
  // For simplicity, we keep the Sidebar but it acts as navigation
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen bg-bamboo-light bg-texture">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onGoHome={() => navigate('/')}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Bar with Search Trigger */}
        <header className="bg-gradient-to-r from-ink-black to-gray-900 text-bamboo-light p-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center">
             <button onClick={() => setSidebarOpen(true)} className="mr-4 text-bamboo-light md:hidden">
               <Menu size={24} />
             </button>
             <span className="font-serif font-bold text-lg tracking-widest hidden md:block cursor-pointer" onClick={() => navigate('/')}>{APP_TITLE}</span>
             <span className="font-serif font-bold text-lg md:hidden">{APP_TITLE.substring(0, 4)}</span>
             {isAdmin && <span className="ml-4 bg-vermilion text-xs px-2 py-0.5 rounded text-white font-sans">管理员模式</span>}
          </div>
          
          <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/search')}
                className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${location.pathname === '/search' ? 'bg-vermilion text-white' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
              >
                  <Search size={14} className="mr-2" />
                  <span className="hidden sm:inline">检索与下载</span>
                  <span className="sm:hidden">搜索</span>
              </button>
              <div className="hidden md:flex text-xs space-x-4 text-gray-400">
                  <span className="hover:text-white cursor-pointer">学术刊物</span>
                  <span className="hover:text-white cursor-pointer">国际合作计划</span>
                  <span className="hover:text-white cursor-pointer">简牍研究中心</span>
              </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/category/:categoryId" element={<CategoryView />} />
            <Route path="/article/:articleId" element={<ArticleDetailView />} />
            <Route path="/search" element={<SearchView />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
      
      {!isAdmin && <ChatAssistant />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
         <Routes>
            <Route path="/*" element={<AppLayout />} />
         </Routes>
      </HashRouter>
    </DataProvider>
  );
};

export default App;