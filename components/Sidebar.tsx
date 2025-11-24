import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Scroll, Landmark, ChevronDown, ChevronRight, Folder, LayoutDashboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  onGoHome: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onGoHome, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: collections } = useData();
  const [expandedEra, setExpandedEra] = useState<string | null>('warring-states');

  const toggleEra = (eraId: string) => {
    setExpandedEra(expandedEra === eraId ? null : eraId);
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
    onClose();
  };

  const goToAdmin = () => {
    navigate('/admin');
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-bamboo-paper border-r border-bamboo-dark z-50
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen md:block
        flex flex-col font-serif
      `}>
        {/* Header */}
        <div className="p-6 border-b border-bamboo-dark flex items-center justify-center bg-bamboo-dark bg-opacity-20 cursor-pointer" onClick={() => { onGoHome(); onClose(); }}>
           <div className="w-12 h-12 border-2 border-ink-black flex items-center justify-center rounded-sm mr-4 bg-bamboo-light shadow-sm">
              <span className="font-calligraphy text-3xl text-ink-black">湘</span>
           </div>
           <div>
             <h1 className="font-bold text-xl text-ink-black tracking-widest">简牍文库</h1>
             <p className="text-[10px] text-stone-500 uppercase tracking-[0.2em]">Changsha Bamboo Slips</p>
           </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => { onGoHome(); onClose(); }}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors
                  ${location.pathname === '/' ? 'text-vermilion font-bold bg-stone-100' : 'text-stone-700 hover:bg-stone-100'}
                `}
              >
                <Landmark size={18} className="mr-3" />
                <span>文库首页</span>
              </button>
            </li>
            
            <li className="px-6 py-3 mt-2">
              <span className="text-xs font-bold text-stone-400 tracking-widest uppercase border-b border-stone-200 pb-1 block">
                分类目录
              </span>
            </li>

            {collections.map((era) => {
              const isExpanded = expandedEra === era.id;
              
              return (
                <li key={era.id}>
                  <div className={`
                    flex items-center justify-between px-6 py-3 cursor-pointer transition-colors
                    ${isExpanded ? 'text-ink-black font-bold bg-stone-100' : 'text-stone-700 hover:bg-stone-100'}
                  `}
                  onClick={() => toggleEra(era.id)}
                  >
                    <div className="flex items-center flex-1">
                      <Scroll size={18} className={`mr-3 ${isExpanded ? 'text-vermilion' : 'text-stone-400'}`} />
                      <span>{era.name}</span>
                    </div>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>

                  {/* Nested Categories */}
                  <div className={`
                    overflow-hidden transition-all duration-300 bg-stone-50
                    ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <ul className="py-2">
                      {era.categories.map((category) => {
                        const isActiveCategory = location.pathname.includes(`/category/${category.id}`);
                        return (
                          <li key={category.id}>
                            <button
                              onClick={() => handleCategoryClick(category.id)}
                              className={`w-full text-left pl-14 pr-6 py-2 text-sm flex items-center border-l-4
                                ${isActiveCategory 
                                  ? 'border-vermilion text-vermilion font-bold bg-white' 
                                  : 'border-transparent text-stone-500 hover:text-ink-black hover:bg-stone-100'}
                              `}
                            >
                              <Folder size={14} className="mr-2 opacity-50" />
                              <span className="truncate">{category.name}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}

             <li className="px-6 py-3 mt-4">
              <span className="text-xs font-bold text-stone-400 tracking-widest uppercase border-b border-stone-200 pb-1 block">
                管理
              </span>
            </li>
            <li>
              <button
                onClick={goToAdmin}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors
                  ${location.pathname.startsWith('/admin') ? 'text-vermilion font-bold bg-stone-100' : 'text-stone-700 hover:bg-stone-100'}
                `}
              >
                <LayoutDashboard size={18} className="mr-3" />
                <span>后台管理</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-bamboo-dark bg-stone-100">
          <p className="text-xs text-stone-500 font-serif leading-relaxed text-center">
             湖南大学岳麓书院<br/>湖南大学简帛文献中心<br/>© 2024
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;