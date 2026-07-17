import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { INITIAL_BLOG_POSTS } from '../data';
import { useLanguage } from '../LanguageContext';
import { 
  Sparkles, 
  Search, 
  Tag, 
  Calendar, 
  Clock, 
  User, 
  ChevronRight, 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  FileText,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Preset cover images that fit the RedZen Suites aesthetic
const PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800', label: 'Finnish Cedar Sauna' },
  { url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80&w=800', label: 'Thermodynamic Setup' },
  { url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800', label: 'Bio-Gastronomy Board' },
  { url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800', label: 'Holistic Spa Therapy' },
  { url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800', label: 'Minimalist Relaxation' }
];

export default function BlogJournal() {
  const { locale, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorExcerpt, setEditorExcerpt] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorCategory, setEditorCategory] = useState('Philosophy');
  const [editorTags, setEditorTags] = useState('');
  const [editorAuthorName, setEditorAuthorName] = useState('Dustin Gunzel');
  const [editorAuthorRole, setEditorAuthorRole] = useState('Founder & Chief Engineer');
  const [editorCoverImage, setEditorCoverImage] = useState(PRESET_IMAGES[0].url);
  const [customImageURL, setCustomImageURL] = useState('');
  const [isLivePreview, setIsLivePreview] = useState(false);

  // Load from localStorage on mount and when locale changes
  useEffect(() => {
    const key = `redzen_blog_posts_${locale}`;
    const saved = localStorage.getItem(key);
    const initialForLocale = INITIAL_BLOG_POSTS[locale] || INITIAL_BLOG_POSTS.nl;
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        setPosts(initialForLocale);
      }
    } else {
      setPosts(initialForLocale);
      localStorage.setItem(key, JSON.stringify(initialForLocale));
    }
  }, [locale]);

  // Save to localStorage whenever posts change
  const savePosts = (updatedPosts: BlogPost[]) => {
    setPosts(updatedPosts);
    const key = `redzen_blog_posts_${locale}`;
    localStorage.setItem(key, JSON.stringify(updatedPosts));
  };

  // Get unique categories and tags for filtering
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));

  // Filter posts based on search, category, and tags
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const selectedPost = posts.find(p => p.id === selectedPostId);

  // Handle open editor for creation
  const handleOpenCreate = () => {
    setEditingPost(null);
    setEditorTitle('');
    setEditorExcerpt('');
    setEditorContent('');
    setEditorCategory('Philosophy');
    setEditorTags('Wellness, Sustainability');
    setEditorAuthorName('Dustin Gunzel');
    setEditorAuthorRole('Founder & Chief Engineer');
    setEditorCoverImage(PRESET_IMAGES[0].url);
    setCustomImageURL('');
    setIsLivePreview(false);
    setIsEditorOpen(true);
  };

  // Handle open editor for editing
  const handleOpenEdit = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting the card
    setEditingPost(post);
    setEditorTitle(post.title);
    setEditorExcerpt(post.excerpt);
    setEditorContent(post.content);
    setEditorCategory(post.category);
    setEditorTags(post.tags.join(', '));
    setEditorAuthorName(post.author.name);
    setEditorAuthorRole(post.author.role);
    setEditorCoverImage(post.coverImage);
    if (!PRESET_IMAGES.find(i => i.url === post.coverImage)) {
      setCustomImageURL(post.coverImage);
    } else {
      setCustomImageURL('');
    }
    setIsLivePreview(false);
    setIsEditorOpen(true);
  };

  // Handle delete
  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('editor.alert.confirm_delete'))) {
      const updated = posts.filter(p => p.id !== id);
      savePosts(updated);
      if (selectedPostId === id) {
        setSelectedPostId(null);
      }
    }
  };

  // Handle Save (Create / Edit)
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editorTitle.trim() || !editorExcerpt.trim() || !editorContent.trim()) {
      alert(t('editor.alert.fields'));
      return;
    }

    // Auto-calculate read time (roughly 200 words per minute)
    const wordCount = editorContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 180));
    const calculatedReadTime = `${minutes} ${t('insights.read_time')}`;

    const parsedTags = editorTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const finalCoverImage = customImageURL.trim() ? customImageURL.trim() : editorCoverImage;

    if (editingPost) {
      // Edit mode
      const updated = posts.map(p => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            title: editorTitle,
            excerpt: editorExcerpt,
            content: editorContent,
            category: editorCategory,
            tags: parsedTags,
            author: {
              name: editorAuthorName,
              role: editorAuthorRole,
              avatar: p.author.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
            },
            coverImage: finalCoverImage,
            readTime: calculatedReadTime
          };
        }
        return p;
      });
      savePosts(updated);
    } else {
      // Create mode
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        title: editorTitle,
        excerpt: editorExcerpt,
        content: editorContent,
        category: editorCategory,
        tags: parsedTags,
        author: {
          name: editorAuthorName,
          role: editorAuthorRole,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
        },
        coverImage: finalCoverImage,
        publishedAt: new Date().toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime: calculatedReadTime
      };
      savePosts([newPost, ...posts]);
    }

    setIsEditorOpen(false);
    setEditingPost(null);
  };

  // Custom parser to translate markdown headers, lists, paragraphs into HTML nicely
  const renderParsedContent = (text: string) => {
    const lines = text.split('\n');
    let insideList = false;
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      const trimmed = line.trim();

      // Check for Heading 2 (##)
      if (trimmed.startsWith('## ')) {
        if (insideList) {
          insideList = false;
        }
        elements.push(
          <h3 key={`h3-${i}`} className="font-serif text-xl sm:text-2xl text-white font-light mt-8 mb-4 tracking-wide border-b border-crimson-950/20 pb-2">
            {trimmed.replace('## ', '')}
          </h3>
        );
      }
      // Check for Heading 3 (###)
      else if (trimmed.startsWith('### ')) {
        if (insideList) {
          insideList = false;
        }
        elements.push(
          <h4 key={`h4-${i}`} className="font-sans text-sm tracking-widest uppercase text-crimson-400 font-bold mt-6 mb-3">
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      // Check for list item (- or *)
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        insideList = true;
        const cleanText = trimmed.substring(2);
        elements.push(
          <div key={`li-${i}`} className="flex items-start gap-2.5 ml-4 my-2 text-xs sm:text-sm text-zen-300 font-light leading-relaxed">
            <span className="w-1.5 h-1.5 bg-crimson-500 rounded-full mt-2 shrink-0" />
            <span>{parseInlineStyles(cleanText)}</span>
          </div>
        );
      }
      // Check for numbered list (1., 2., etc.)
      else if (/^\d+\.\s/.test(trimmed)) {
        insideList = true;
        const indexMatch = trimmed.match(/^(\d+)\.\s/);
        const indexStr = indexMatch ? indexMatch[1] : '1';
        const cleanText = trimmed.replace(/^\d+\.\s/, '');
        elements.push(
          <div key={`ol-${i}`} className="flex items-start gap-2.5 ml-4 my-2 text-xs sm:text-sm text-zen-300 font-light leading-relaxed">
            <span className="font-mono text-crimson-500 text-xs font-bold mt-0.5 shrink-0">{indexStr}.</span>
            <span>{parseInlineStyles(cleanText)}</span>
          </div>
        );
      }
      // Empty lines
      else if (trimmed === '') {
        if (insideList) {
          insideList = false;
        }
      }
      // Regular Paragraphs
      else {
        if (insideList) {
          insideList = false;
        }
        elements.push(
          <p key={`p-${i}`} className="font-sans text-xs sm:text-sm text-zen-200 leading-relaxed font-light mb-5">
            {parseInlineStyles(trimmed)}
          </p>
        );
      }
    });

    return elements;
  };

  // Helper to parse basic inline bolding like **text**
  const parseInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-white">
            {part.substring(2, part.length - 2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <section id="insights" className="py-24 bg-zen-950 border-t border-crimson-950/20 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_right,rgba(220,38,38,0.03),transparent_40%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <AnimatePresence mode="wait">
          {!selectedPostId ? (
            /* ================= BLOG INDEX / LIST VIEW ================= */
            <motion.div
              key="blog-index"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Header with Title and Create CTA */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4 max-w-xl">
                  <div className="flex items-center space-x-2 text-crimson-500">
                    <FileText size={14} />
                    <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold">{t('insights.badge')}</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
                    {t('insights.heading')}
                  </h2>
                  <div className="w-12 h-[1px] bg-crimson-600" />
                  <p className="font-sans text-xs text-zen-300 font-light leading-relaxed">
                    {t('insights.desc')}
                  </p>
                </div>

                <div className="flex shrink-0">
                  <button
                    onClick={handleOpenCreate}
                    className="px-5 py-2.5 bg-crimson-600 hover:bg-crimson-700 text-white text-xs uppercase tracking-widest font-sans font-bold transition-all flex items-center space-x-2 rounded-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>{t('insights.publish')}</span>
                  </button>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-y border-crimson-900/10 py-6">
                {/* Search */}
                <div className="lg:col-span-4 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('insights.search_placeholder')}
                    className="w-full bg-zen-900/50 border border-crimson-950/30 rounded-sm py-2 px-3 pl-9 text-xs text-white placeholder-zen-500 focus:outline-none focus:border-crimson-600 transition-colors font-sans"
                  />
                  <Search size={14} className="absolute left-3 top-3 text-zen-500" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-zen-400 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="lg:col-span-8 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] tracking-wider uppercase font-sans font-bold text-zen-400 mr-2">{t('insights.filter_category')}</span>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedTag(null); // Clear tag when shifting categories
                      }}
                      className={`px-3 py-1 text-[10px] tracking-wider uppercase font-sans font-bold transition-all rounded-sm border ${
                        selectedCategory === cat 
                          ? 'bg-crimson-600/15 border-crimson-600 text-white' 
                          : 'bg-transparent border-crimson-950/10 text-zen-400 hover:text-white hover:border-crimson-900/40'
                      }`}
                    >
                      {cat === 'All' ? (t('portfolio.cat.all') || 'All') : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters Display */}
              {selectedTag && (
                <div className="flex items-center space-x-2 text-xs text-zen-300">
                  <span>{t('insights.filtered_tag')}</span>
                  <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 bg-crimson-950/40 border border-crimson-900/30 rounded-sm text-[10px] text-crimson-400 font-mono">
                    <Tag size={10} />
                    <span>{selectedTag}</span>
                  </span>
                  <button 
                    onClick={() => setSelectedTag(null)}
                    className="text-crimson-500 hover:text-crimson-400 text-[10px] font-sans font-bold uppercase tracking-wider"
                  >
                    {t('insights.clear')}
                  </button>
                </div>
              )}

              {/* Blog Posts Grid */}
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-crimson-950/20 bg-zen-900/10 rounded-sm">
                  <AlertCircle size={32} className="text-crimson-600/50 mx-auto mb-3" />
                  <h3 className="font-serif text-lg text-white font-light">{t('insights.not_found_title')}</h3>
                  <p className="font-sans text-xs text-zen-400 mt-1 max-w-md mx-auto">
                    {t('insights.not_found_desc')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group flex flex-col bg-zen-900/30 border border-crimson-950/15 hover:border-crimson-600/35 transition-all duration-500 rounded-sm overflow-hidden shadow-lg cursor-pointer"
                      onClick={() => setSelectedPostId(post.id)}
                    >
                      {/* Cover Image Area */}
                      <div className="relative aspect-[16/10] bg-neutral-950 overflow-hidden">
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zen-950/80 via-transparent to-transparent" />
                        
                        {/* Edit/Delete Overlay for User Customization */}
                        <div className="absolute top-3 right-3 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleOpenEdit(post, e)}
                            title="Edit Post"
                            className="p-1.5 bg-zen-950/90 border border-crimson-900/30 rounded-sm text-zen-300 hover:text-white hover:border-crimson-600 transition-all cursor-pointer"
                          >
                            <Edit3 size={11} />
                          </button>
                          <button
                            onClick={(e) => handleDeletePost(post.id, e)}
                            title="Delete Post"
                            className="p-1.5 bg-zen-950/90 border border-crimson-900/30 rounded-sm text-crimson-500 hover:text-crimson-400 hover:border-crimson-600 transition-all cursor-pointer"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>

                        {/* Category */}
                        <div className="absolute bottom-3 left-3 bg-crimson-600 text-white text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                          {post.category}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-[10px] text-zen-400 font-sans">
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />
                              {post.publishedAt}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              {post.readTime}
                            </span>
                          </div>
                          
                          <h3 className="font-serif text-lg text-white group-hover:text-crimson-400 transition-colors leading-snug font-medium line-clamp-2">
                            {post.title}
                          </h3>
                          
                          <p className="font-sans text-xs text-zen-400 font-light line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>

                        {/* Author & Read More */}
                        <div className="pt-4 border-t border-crimson-950/10 flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <img 
                              src={post.author.avatar} 
                              alt={post.author.name} 
                              className="w-5 h-5 rounded-full object-cover border border-crimson-950/30"
                              referrerPolicy="no-referrer"
                            />
                            <div className="text-[10px] leading-tight">
                              <div className="font-sans font-bold text-white">{post.author.name}</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 text-[10px] font-sans font-bold text-crimson-400 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                            <span>{t('insights.explore')}</span>
                            <ChevronRight size={12} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* ================= BLOG DETAIL / ARTICLE VIEW ================= */
            <motion.div
              key="blog-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12 max-w-4xl mx-auto"
            >
              {/* Back CTA */}
              <button
                onClick={() => setSelectedPostId(null)}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-sans font-bold text-zen-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{t('insights.back')}</span>
              </button>

              {selectedPost && (
                <article className="space-y-10">
                  {/* Article Hero Area */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 bg-crimson-600 text-white text-[9px] font-sans font-bold uppercase tracking-widest rounded-sm">
                        {selectedPost.category}
                      </span>
                      <span className="text-[10px] tracking-widest uppercase font-mono text-crimson-400">
                        {t('insights.technical_ledger')}
                      </span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-light leading-tight">
                      {selectedPost.title}
                    </h1>

                    <p className="font-sans text-xs sm:text-sm text-zen-300 font-light leading-relaxed border-l border-crimson-600/30 pl-4 py-1 italic">
                      {selectedPost.excerpt}
                    </p>

                    {/* Metadata Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-crimson-900/10 py-4">
                      {/* Author Card */}
                      <div className="flex items-center space-x-3">
                        <img 
                          src={selectedPost.author.avatar} 
                          alt={selectedPost.author.name} 
                          className="w-10 h-10 rounded-full object-cover border border-crimson-900/20"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-sans font-bold text-white text-xs">{selectedPost.author.name}</div>
                          <div className="font-sans text-[10px] text-zen-400 font-light">{selectedPost.author.role}</div>
                        </div>
                      </div>

                      {/* Time Details */}
                      <div className="flex items-center space-x-6 text-[11px] text-zen-400 font-mono">
                        <div className="flex items-center space-x-2">
                          <Calendar size={13} className="text-crimson-500" />
                          <span>{selectedPost.publishedAt}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={13} className="text-crimson-500" />
                          <span>{selectedPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Featured Large Image */}
                  <div className="relative aspect-[16/9] bg-neutral-900 overflow-hidden border border-crimson-950/20 rounded-sm shadow-2xl">
                    <img 
                      src={selectedPost.coverImage} 
                      alt={selectedPost.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Document Body */}
                  <div className="prose prose-invert max-w-none pt-4">
                    {renderParsedContent(selectedPost.content)}
                  </div>

                  {/* Tags & Actions Footer */}
                  <div className="pt-8 border-t border-crimson-900/10 space-y-6">
                    {/* Tags List */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-sans font-bold text-zen-400 mr-2 flex items-center gap-1">
                        <Tag size={12} /> {t('insights.tags')}
                      </span>
                      {selectedPost.tags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTag(tag);
                            setSelectedPostId(null);
                          }}
                          className="px-2.5 py-0.5 bg-zen-900 hover:bg-crimson-600/10 border border-crimson-950/30 hover:border-crimson-600/30 rounded-sm text-[10px] text-zen-300 hover:text-white transition-all font-sans cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {/* Author Statement or Bio */}
                    <div className="p-6 bg-zen-900/30 border border-crimson-950/15 rounded-sm flex flex-col sm:flex-row items-center gap-4">
                      <img 
                        src={selectedPost.author.avatar} 
                        alt={selectedPost.author.name} 
                        className="w-12 h-12 rounded-full object-cover border border-crimson-600/25 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1 text-center sm:text-left">
                        <h4 className="font-serif text-sm text-white">{t('insights.about_author')} {selectedPost.author.name}</h4>
                        <p className="font-sans text-xs text-zen-400 font-light leading-relaxed">
                          {t('insights.author_bio')}
                        </p>
                      </div>
                    </div>
                  </div>

                </article>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ================= MODAL JOURNAL CMS / EDITOR ================= */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-zen-950/90 backdrop-blur-md">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="bg-zen-900 border border-crimson-600/40 w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-crimson-900/10 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-white font-medium">
                    {editingPost ? t('editor.modify_title') : t('editor.new_title')}
                  </h3>
                  <p className="text-[10px] text-zen-400 font-sans">
                    {t('editor.subtitle')}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1 text-zen-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mode Selector (Write vs Live Preview) */}
              <div className="bg-zen-950/50 border-b border-crimson-900/10 px-6 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsLivePreview(false)}
                  className={`py-3 text-[10px] tracking-wider uppercase font-sans font-bold border-b-2 transition-all ${
                    !isLivePreview 
                      ? 'border-crimson-600 text-white' 
                      : 'border-transparent text-zen-400 hover:text-white'
                  }`}
                >
                  {t('editor.tab.edit')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsLivePreview(true)}
                  className={`py-3 text-[10px] tracking-wider uppercase font-sans font-bold border-b-2 transition-all ${
                    isLivePreview 
                      ? 'border-crimson-600 text-white' 
                      : 'border-transparent text-zen-400 hover:text-white'
                  }`}
                >
                  {t('editor.tab.preview')}
                </button>
              </div>

              {/* Form / Scrollable Content Area */}
              <div className="p-6 overflow-y-auto flex-grow space-y-6">
                {!isLivePreview ? (
                  <form onSubmit={handleSavePost} className="space-y-5">
                    
                    {/* Grid Title / Category */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] tracking-wider uppercase font-sans font-bold text-zen-300">
                          {t('editor.field.title')} <span className="text-crimson-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editorTitle}
                          onChange={(e) => setEditorTitle(e.target.value)}
                          placeholder="e.g. Thermodynamic Loop Innovations"
                          className="w-full bg-zen-950 border border-crimson-950/40 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-crimson-600 font-sans"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] tracking-wider uppercase font-sans font-bold text-zen-300">
                          {t('editor.field.category')} <span className="text-crimson-500">*</span>
                        </label>
                        <select
                          value={editorCategory}
                          onChange={(e) => setEditorCategory(e.target.value)}
                          className="w-full bg-zen-950 border border-crimson-950/40 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-crimson-600 font-sans appearance-none text-left"
                        >
                          <option value="Philosophy">{locale === 'nl' ? 'Filosofie' : 'Philosophy'}</option>
                          <option value="Engineering">{locale === 'nl' ? 'Techniek' : 'Engineering'}</option>
                          <option value="Wellness">Wellness</option>
                          <option value="Culinary">{locale === 'nl' ? 'Culinair' : 'Culinary'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] tracking-wider uppercase font-sans font-bold text-zen-300">
                        {t('editor.field.excerpt')} <span className="text-crimson-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editorExcerpt}
                        onChange={(e) => setEditorExcerpt(e.target.value)}
                        placeholder={t('editor.field.excerpt_placeholder')}
                        className="w-full bg-zen-950 border border-crimson-950/40 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-crimson-600 font-sans"
                      />
                    </div>

                    {/* Tags & Author */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] tracking-wider uppercase font-sans font-bold text-zen-300">
                          {t('editor.field.tags')}
                        </label>
                        <input
                          type="text"
                          value={editorTags}
                          onChange={(e) => setEditorTags(e.target.value)}
                          placeholder="Wellness, Heat Pumps, Almere"
                          className="w-full bg-zen-950 border border-crimson-950/40 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-crimson-600 font-sans"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] tracking-wider uppercase font-sans font-bold text-zen-300">
                          {t('editor.field.author_name')} / {t('editor.field.author_role')}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editorAuthorName}
                            onChange={(e) => setEditorAuthorName(e.target.value)}
                            placeholder={t('editor.field.author_name')}
                            className="bg-zen-950 border border-crimson-950/40 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-crimson-600 font-sans"
                          />
                          <input
                            type="text"
                            value={editorAuthorRole}
                            onChange={(e) => setEditorAuthorRole(e.target.value)}
                            placeholder={t('editor.field.author_role')}
                            className="bg-zen-950 border border-crimson-950/40 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-crimson-600 font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Cover Image Selector */}
                    <div className="space-y-3">
                      <label className="text-[10px] tracking-wider uppercase font-sans font-bold text-zen-300 block">
                        {t('editor.field.cover')}
                      </label>
                      
                      {/* Presets Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {PRESET_IMAGES.map((img) => (
                          <div
                            key={img.url}
                            onClick={() => {
                              setEditorCoverImage(img.url);
                              setCustomImageURL('');
                            }}
                            className={`relative aspect-[3/2] rounded-sm overflow-hidden cursor-pointer border ${
                              editorCoverImage === img.url && !customImageURL
                                ? 'border-crimson-600 ring-1 ring-crimson-600/30'
                                : 'border-crimson-950/20 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img.url} alt={img.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                              <span className="text-[8px] text-white font-sans line-clamp-1">{img.label}</span>
                            </div>
                            {editorCoverImage === img.url && !customImageURL && (
                              <div className="absolute top-1 right-1 bg-crimson-600 text-white rounded-full p-0.5">
                                <Check size={8} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Custom URL Option */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[9px] text-zen-400 font-sans">{t('editor.field.custom_cover')}</span>
                        <input
                          type="url"
                          value={customImageURL}
                          onChange={(e) => setCustomImageURL(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-zen-950 border border-crimson-950/40 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-crimson-600 font-sans"
                        />
                      </div>
                    </div>

                    {/* Article Content Markdown Area */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] tracking-wider uppercase font-sans font-bold text-zen-300">
                          {t('editor.field.content')} <span className="text-crimson-500">*</span>
                        </label>
                        <span className="text-[9px] text-zen-400 font-mono">
                          {locale === 'nl' ? 'Format: Gebruik ## voor subkoppen, - voor opsommingstekens' : 'Format: Use ## for Subheadings, - for Bullets'}
                        </span>
                      </div>
                      <textarea
                        required
                        rows={12}
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                        placeholder={t('editor.field.content_placeholder')}
                        className="w-full bg-zen-950 border border-crimson-950/40 rounded-sm py-3 px-4 text-xs text-white focus:outline-none focus:border-crimson-600 font-mono leading-relaxed"
                      />
                    </div>

                    {/* Action Footer */}
                    <div className="pt-4 border-t border-crimson-900/10 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditorOpen(false)}
                        className="px-4 py-2 border border-crimson-950/20 hover:border-crimson-900/40 text-zen-300 hover:text-white text-xs uppercase tracking-widest font-sans font-bold transition-all rounded-sm cursor-pointer"
                      >
                        {t('editor.btn.discard')}
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs uppercase tracking-widest font-sans font-bold transition-all rounded-sm shadow-md cursor-pointer"
                      >
                        {editingPost ? t('editor.btn.save') : t('editor.btn.publish')}
                      </button>
                    </div>

                  </form>
                ) : (
                  /* ================= LIVE PREVIEW IN MODAL ================= */
                  <div className="space-y-8 bg-zen-950/40 border border-crimson-950/15 p-6 rounded-sm">
                    {/* Header preview */}
                    <div className="space-y-4">
                      <span className="px-2 py-0.5 bg-crimson-600 text-white text-[9px] font-sans font-bold uppercase tracking-widest rounded-sm">
                        {editorCategory}
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
                        {editorTitle || (locale === 'nl' ? 'Naamloos conceptdocument' : 'Untitled Draft Document')}
                      </h2>
                      {editorExcerpt && (
                        <p className="font-sans text-xs text-zen-300 leading-relaxed italic border-l border-crimson-600/30 pl-3">
                          {editorExcerpt}
                        </p>
                      )}
                      
                      {/* Meta preview */}
                      <div className="flex items-center space-x-4 border-y border-crimson-900/10 py-3 text-[10px] text-zen-400 font-mono">
                        <span>
                          {locale === 'nl' 
                            ? `Door ${editorAuthorName || 'Dustin Gunzel'} (${editorAuthorRole || 'Oprichter'})` 
                            : `By ${editorAuthorName || 'Dustin Gunzel'} (${editorAuthorRole || 'Founder'})`}
                        </span>
                        <span>•</span>
                        <span>{locale === 'nl' ? 'Zojuist gepubliceerd' : 'Published Just Now'}</span>
                      </div>
                    </div>

                    {/* Cover image preview */}
                    <div className="aspect-[16/8] bg-neutral-900 rounded-sm overflow-hidden border border-crimson-950/20">
                      <img 
                        src={customImageURL.trim() ? customImageURL.trim() : editorCoverImage} 
                        alt="Cover Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Content parsed preview */}
                    <div className="prose prose-invert max-w-none">
                      {editorContent ? (
                        renderParsedContent(editorContent)
                      ) : (
                        <p className="font-mono text-xs text-zen-500 italic">
                          {locale === 'nl' ? 'Er is nog geen inhoud geschreven.' : 'No content has been written yet.'}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
