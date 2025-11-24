
import React, { useState, useMemo, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { Article } from '../types';
import { useNavigate, Routes, Route, Link, useParams } from 'react-router-dom';
import { Edit, Trash2, Plus, Save, ArrowLeft, Tag, Search, RotateCcw, Lock, List, Upload, FileText, Loader2, X as XIcon } from 'lucide-react';

// --- Dashboard Home ---
const AdminDashboard = () => {
  const { data, tags, resetData } = useData();
  const totalArticles = data.reduce((acc, era) => 
    acc + era.categories.reduce((cAcc, cat) => cAcc + cat.articles.length, 0), 0
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-ink-black font-serif">管理控制台</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
          <h3 className="text-stone-500 font-bold mb-2">总文献数</h3>
          <p className="text-4xl font-bold text-vermilion">{totalArticles}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
          <h3 className="text-stone-500 font-bold mb-2">可用标签</h3>
          <p className="text-4xl font-bold text-ink-black">{tags.length}</p>
          <p className="text-xs text-stone-400 mt-1">包含 {tags.filter(t => t.isSystem).length} 个系统预设标签</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
          <h3 className="text-stone-500 font-bold mb-2">系统状态</h3>
          <p className="text-green-600 font-bold">运行中 (本地存储)</p>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link to="/admin/articles/new" className="bg-ink-black text-white px-6 py-3 rounded-md hover:bg-gray-800 flex items-center">
           <Plus className="mr-2" size={18} /> 新增文献
        </Link>
        <Link to="/admin/articles" className="bg-white border border-stone-300 text-ink-black px-6 py-3 rounded-md hover:bg-stone-50 flex items-center">
           <List className="mr-2" size={18} /> 文献列表
        </Link>
        <Link to="/admin/tags" className="bg-white border border-stone-300 text-ink-black px-6 py-3 rounded-md hover:bg-stone-50 flex items-center">
           <Tag className="mr-2" size={18} /> 标签管理
        </Link>
        <button onClick={() => { if(confirm('确定重置所有数据到初始状态吗？所有修改将丢失。')) resetData() }} className="ml-auto text-red-600 underline text-sm flex items-center">
           <RotateCcw size={14} className="mr-1" /> 重置所有数据
        </button>
      </div>
    </div>
  );
};

// --- Tag Management ---
const TagManager = () => {
  const { tags, addTag, deleteTag } = useData();
  const [newTag, setNewTag] = useState('');

  const handleAdd = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  // Group tags for display
  const systemTags = tags.filter(t => t.isSystem);
  const customTags = tags.filter(t => !t.isSystem);

  return (
    <div className="p-8 max-w-4xl mx-auto">
       <div className="flex items-center mb-8">
        <Link to="/admin" className="mr-4 text-stone-500 hover:text-ink-black"><ArrowLeft /></Link>
        <h1 className="text-2xl font-bold text-ink-black font-serif">标签管理</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 mb-8">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="输入新标签名称..."
            className="flex-1 border border-stone-300 rounded px-4 py-2 focus:outline-none focus:border-vermilion"
          />
          <button onClick={handleAdd} className="bg-vermilion text-white px-6 py-2 rounded hover:bg-red-800">添加自定义标签</button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
           <Lock size={16} className="mr-2 text-stone-400" /> 
           系统预设标签 (对应分类目录)
        </h2>
        <div className="flex flex-wrap gap-3 bg-stone-50 p-4 rounded-lg border border-stone-200">
          {systemTags.map(tag => (
             <div key={tag.id} className="bg-white text-stone-600 px-3 py-2 rounded-full flex items-center border border-stone-200 shadow-sm opacity-80 cursor-not-allowed" title="系统标签不可删除">
                <Tag size={14} className="mr-2 text-stone-400" />
                <span className="mr-2 text-sm">{tag.name}</span>
             </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-stone-700 mb-4">自定义标签 (支持搜索)</h2>
        <div className="flex flex-wrap gap-3">
          {customTags.length === 0 && <p className="text-stone-400 text-sm italic">暂无自定义标签</p>}
          {customTags.map(tag => (
            <div key={tag.id} className="bg-stone-100 text-stone-700 px-3 py-2 rounded-full flex items-center group border border-stone-200">
              <Tag size={14} className="mr-2 text-stone-400" />
              <span className="mr-2 text-sm">{tag.name}</span>
              <button onClick={() => deleteTag(tag.id)} className="text-stone-400 hover:text-red-600 ml-2">
                <XIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Article Editor (Create/Edit) ---
const ArticleEditor = () => {
  const { articleId } = useParams(); // If present, we are editing
  const navigate = useNavigate();
  const { data, tags, addArticle, updateArticle, addTag } = useData();
  const isEdit = !!articleId;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Quick Add Tag State
  const [newTagInput, setNewTagInput] = useState('');

  // Flatten logic to find existing article
  const existingData = useMemo(() => {
    if (!isEdit) return null;
    for (const era of data) {
      for (const cat of era.categories) {
        const art = cat.articles.find(a => a.id === articleId);
        if (art) return { eraId: era.id, categoryId: cat.id, article: art };
      }
    }
    return null;
  }, [articleId, data, isEdit]);

  const [formData, setFormData] = useState<Partial<Article>>({
    title: '', author: '简牍研究中心', publishDate: new Date().toISOString().split('T')[0],
    summary: '', content: '', tags: []
  });
  const [selectedEra, setSelectedEra] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load existing data
  React.useEffect(() => {
    if (existingData) {
      setFormData(existingData.article);
      setSelectedEra(existingData.eraId);
      setSelectedCategory(existingData.categoryId);
    }
  }, [existingData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEra || !selectedCategory || !formData.title) return;

    const articlePayload: Article = {
      id: isEdit ? articleId! : `custom-${Date.now()}`,
      title: formData.title!,
      author: formData.author,
      publishDate: formData.publishDate,
      summary: formData.summary,
      content: formData.content || '',
      views: isEdit ? formData.views : 0,
      tags: formData.tags || []
    };

    if (isEdit) {
      // Note: Moving categories isn't supported in this simple version, assumes same cat
      updateArticle(selectedEra, selectedCategory, articlePayload);
    } else {
      addArticle(selectedEra, selectedCategory, articlePayload);
    }
    navigate('/admin/articles');
  };

  const toggleTag = (tagName: string) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tagName)) {
      setFormData({ ...formData, tags: currentTags.filter(t => t !== tagName) });
    } else {
      setFormData({ ...formData, tags: [...currentTags, tagName] });
    }
  };

  const handleQuickAddTag = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const tagToAdd = newTagInput.trim();
    if (!tagToAdd) return;

    // Add to global tags if not exists
    addTag(tagToAdd);
    
    // Select it for this article
    if (!formData.tags?.includes(tagToAdd)) {
       setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagToAdd] }));
    }
    
    setNewTagInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      if (file.name.toLowerCase().endsWith('.docx')) {
        // Handle Word
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            // @ts-ignore
            if (window.mammoth) {
              // @ts-ignore
              const result = await window.mammoth.convertToHtml({ arrayBuffer });
              setFormData(prev => ({ 
                ...prev, 
                content: (prev.content ? prev.content + '<br/>' : '') + result.value 
              }));
            } else {
              alert("DOCX 解析库未加载完成，请刷新重试。");
            }
          } catch (err) {
            console.error(err);
            alert("文档解析失败");
          } finally {
            setIsUploading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.name.toLowerCase().endsWith('.pdf')) {
        // Handle PDF
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
             const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
             // @ts-ignore
             if (window.pdfjsLib) {
                 // @ts-ignore
                 const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
                 let fullText = "";
                 for (let i = 1; i <= pdf.numPages; i++) {
                     const page = await pdf.getPage(i);
                     const textContent = await page.getTextContent();
                     const pageText = textContent.items.map((item: any) => item.str).join(' ');
                     fullText += `<p>${pageText}</p>`;
                 }
                 setFormData(prev => ({ 
                    ...prev, 
                    content: (prev.content ? prev.content + '<br/>' : '') + fullText 
                 }));
             } else {
               alert("PDF 解析库未加载完成，请刷新重试。");
             }
          } catch (err) {
            console.error(err);
            alert("PDF 解析失败");
          } finally {
            setIsUploading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert("仅支持 .docx 和 .pdf 文件");
        setIsUploading(false);
      }
    } catch (e) {
      console.error(e);
      setIsUploading(false);
    }
  };

  // Get categories for selected era
  const availableCategories = useMemo(() => {
    const era = data.find(e => e.id === selectedEra);
    return era ? era.categories : [];
  }, [selectedEra, data]);

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white min-h-screen">
       <div className="flex items-center mb-8 pb-4 border-b border-stone-200">
        <Link to="/admin/articles" className="mr-4 text-stone-500 hover:text-ink-black"><ArrowLeft /></Link>
        <h1 className="text-2xl font-bold text-ink-black font-serif">{isEdit ? '编辑文献' : '新增文献'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Classification */}
        <div className="grid grid-cols-2 gap-6 p-4 bg-stone-50 rounded-lg">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">所属时代 (Era)</label>
            <select 
              value={selectedEra} 
              onChange={e => {
                setSelectedEra(e.target.value);
                setSelectedCategory(''); // Reset category when era changes
              }}
              className="w-full border p-2 rounded"
              disabled={isEdit} // Disable moving for simplicity
            >
              <option value="">请选择时代...</option>
              {data.map(era => <option key={era.id} value={era.id}>{era.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">所属分类 (Collection)</label>
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full border p-2 rounded"
              disabled={!selectedEra || isEdit}
            >
              <option value="">请选择分类...</option>
              {availableCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">文献标题</label>
              <input 
                required
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full border border-stone-300 p-2 rounded focus:border-vermilion outline-none"
              />
           </div>
           <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">作者</label>
              <input 
                type="text" 
                value={formData.author} 
                onChange={e => setFormData({...formData, author: e.target.value})}
                className="w-full border border-stone-300 p-2 rounded focus:border-vermilion outline-none"
              />
           </div>
           <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">发布日期</label>
              <input 
                type="date" 
                value={formData.publishDate} 
                onChange={e => setFormData({...formData, publishDate: e.target.value})}
                className="w-full border border-stone-300 p-2 rounded focus:border-vermilion outline-none"
              />
           </div>
        </div>

        {/* Tags */}
        <div>
           <label className="block text-sm font-bold text-stone-700 mb-2">标签 (Tags)</label>
           <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg max-h-60 overflow-y-auto custom-scrollbar mb-2">
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => toggleTag(tag.name)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                      formData.tags?.includes(tag.name) 
                        ? 'bg-vermilion text-white border-vermilion' 
                        : tag.isSystem 
                           ? 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100' // System tag style
                           : 'bg-stone-100 text-stone-600 border-transparent hover:bg-stone-200' // Custom tag style
                    }`}
                  >
                    {tag.isSystem && <span className="mr-1 text-[10px] opacity-70">●</span>}
                    {tag.name}
                  </button>
                ))}
              </div>
           </div>
           <div className="flex items-center gap-2">
             <input 
               type="text" 
               value={newTagInput}
               onChange={e => setNewTagInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleQuickAddTag(e)}
               placeholder="输入新标签名称..."
               className="border border-stone-300 px-3 py-1.5 rounded text-sm w-48 focus:border-vermilion outline-none"
             />
             <button 
               type="button"
               onClick={handleQuickAddTag}
               disabled={!newTagInput.trim()}
               className="bg-ink-black text-white px-3 py-1.5 rounded text-sm hover:bg-stone-700 disabled:opacity-50"
             >
               添加自定义标签
             </button>
             <span className="text-xs text-stone-400 ml-2">提示：添加后会自动选中</span>
           </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">摘要</label>
          <textarea 
            value={formData.summary} 
            onChange={e => setFormData({...formData, summary: e.target.value})}
            className="w-full border border-stone-300 p-2 rounded h-20 focus:border-vermilion outline-none"
          />
        </div>

        {/* Content (HTML) */}
        <div>
          <div className="flex justify-between items-end mb-2">
             <label className="block text-sm font-bold text-stone-700">正文 (支持 HTML)</label>
             <div className="relative">
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept=".docx,.pdf"
                 onChange={handleFileUpload}
               />
               <button 
                 type="button" 
                 onClick={() => fileInputRef.current?.click()}
                 disabled={isUploading}
                 className="text-xs bg-stone-200 hover:bg-stone-300 text-stone-700 px-3 py-1.5 rounded flex items-center transition-colors"
               >
                 {isUploading ? <Loader2 size={12} className="animate-spin mr-1"/> : <Upload size={12} className="mr-1" />}
                 {isUploading ? '解析中...' : '导入 Word/PDF'}
               </button>
             </div>
          </div>
          
          <textarea 
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})}
            className="w-full border border-stone-300 p-2 rounded h-96 font-mono text-sm focus:border-vermilion outline-none"
            placeholder="<p>文章内容...</p>"
          />
          <div className="flex justify-between text-xs text-stone-500 mt-1">
             <span>提示: 导入的文档内容将追加到当前内容末尾。支持 .docx 和 .pdf 格式。</span>
             <span>HTML 标签: &lt;p&gt;, &lt;strong&gt;, &lt;img&gt; 等</span>
          </div>
        </div>

        <div className="flex justify-end pt-6">
           <button type="submit" className="bg-ink-black text-white px-8 py-3 rounded hover:bg-vermilion transition-colors flex items-center font-bold">
             <Save className="mr-2" size={18} /> 保存文献
           </button>
        </div>
      </form>
    </div>
  );
};

// --- Article List (Table) ---
const ArticleList = () => {
    const { data, deleteArticle } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const flattenedArticles = useMemo(() => {
        const results: { era: string; category: string; article: Article; categoryId: string; eraId: string }[] = [];
        data.forEach(era => {
            era.categories.forEach(cat => {
                cat.articles.forEach(art => {
                    results.push({ era: era.name, category: cat.name, categoryId: cat.id, eraId: era.id, article: art });
                });
            });
        });
        return results.filter(r => r.article.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [data, searchTerm]);

    return (
        <div className="p-8">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Link to="/admin" className="text-stone-500 hover:text-ink-black"><ArrowLeft /></Link>
                  <h1 className="text-3xl font-bold text-ink-black font-serif">文献列表</h1>
                </div>
                <Link to="/admin/articles/new" className="bg-vermilion text-white px-4 py-2 rounded flex items-center text-sm">
                   <Plus size={16} className="mr-2" /> 新增
                </Link>
             </div>

             <div className="mb-6 relative">
                 <Search className="absolute left-3 top-3 text-stone-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="搜索文献标题..." 
                    className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded focus:border-vermilion outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                 />
             </div>

             <div className="bg-white rounded-lg shadow border border-stone-200 overflow-hidden">
                 <table className="w-full text-left">
                     <thead className="bg-stone-100 border-b border-stone-200">
                         <tr>
                             <th className="p-4 font-serif font-bold text-stone-700">标题</th>
                             <th className="p-4 font-serif font-bold text-stone-700 hidden md:table-cell">分类</th>
                             <th className="p-4 font-serif font-bold text-stone-700 hidden sm:table-cell">作者</th>
                             <th className="p-4 font-serif font-bold text-stone-700 hidden sm:table-cell">日期</th>
                             <th className="p-4 font-serif font-bold text-stone-700 text-right">操作</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-stone-100">
                         {flattenedArticles.map((row) => (
                             <tr key={row.article.id} className="hover:bg-stone-50 transition-colors">
                                 <td className="p-4">
                                     <div className="font-bold text-ink-black">{row.article.title}</div>
                                     <div className="text-xs text-stone-400 md:hidden">{row.category}</div>
                                 </td>
                                 <td className="p-4 hidden md:table-cell">
                                     <span className="text-xs bg-stone-200 px-2 py-1 rounded text-stone-600">{row.era}</span>
                                     <span className="text-xs ml-2 text-stone-500">{row.category}</span>
                                 </td>
                                 <td className="p-4 hidden sm:table-cell text-sm text-stone-600">{row.article.author}</td>
                                 <td className="p-4 hidden sm:table-cell text-sm text-stone-500">{row.article.publishDate}</td>
                                 <td className="p-4 text-right">
                                     <div className="flex justify-end gap-2">
                                         <Link 
                                           to={`/admin/articles/edit/${row.article.id}`} 
                                           className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                           title="编辑"
                                         >
                                             <Edit size={16} />
                                         </Link>
                                         <button 
                                            onClick={() => { if(confirm('确定删除此文献吗？')) deleteArticle(row.article.id) }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            title="删除"
                                         >
                                             <Trash2 size={16} />
                                         </button>
                                     </div>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
                 {flattenedArticles.length === 0 && <div className="p-8 text-center text-stone-400">暂无文献</div>}
             </div>
        </div>
    );
};

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="tags" element={<TagManager />} />
      <Route path="articles" element={<ArticleList />} />
      <Route path="articles/new" element={<ArticleEditor />} />
      <Route path="articles/edit/:articleId" element={<ArticleEditor />} />
    </Routes>
  );
};
