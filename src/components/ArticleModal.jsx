import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Tag,
  ArrowRight,
  BookOpen,
  Sparkles,
  Check,
  ShoppingBag
} from 'lucide-react';
import * as api from '../services/api';

export default function ArticleModal({ article, isOpen, onClose, onSelectArticle, onViewProductDetail, onGoToCollection }) {
  const [currentArticle, setCurrentArticle] = useState(article);
  const [likes, setLikes] = useState(article?.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [allArticles, setAllArticles] = useState([]);

  useEffect(() => {
    if (article) {
      setCurrentArticle(article);
      setLikes(article.likes || 0);
      setHasLiked(false);
    }
  }, [article]);

  useEffect(() => {
    if (isOpen) {
      // Fetch related articles
      api.getArticles().then(data => {
        setAllArticles(data || []);
      }).catch(() => {});
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !currentArticle) return null;

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikes(prev => prev + 1);
    try {
      await api.likeArticle(currentArticle.id);
    } catch {
      // silently fallback
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Filter 2-3 other articles for "Related" section
  const relatedArticles = allArticles
    .filter(a => a.id !== currentArticle.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Dialog */}
      <div 
        className="relative bg-[#FAF4EB] w-full max-w-4xl max-h-[92vh] rounded-[2.5rem] shadow-2xl border border-[#EAE0D5] flex flex-col overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md text-[#6B4226] hover:bg-[#6B4226] hover:text-white transition shadow-lg flex items-center justify-center cursor-pointer group"
          title="Đóng bài viết (Esc)"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Article Hero Banner */}
          <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#EAE0D5]">
            <img
              src={currentArticle.image}
              alt={currentArticle.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Overlay Badges */}
            <div className="absolute bottom-6 left-6 right-6 sm:left-10 sm:right-10 text-white">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="bg-[#C25E2E] text-white text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentArticle.category}
                </span>
                <span className="bg-black/40 backdrop-blur-md text-white/90 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {currentArticle.readTime}
                </span>
                <span className="bg-black/40 backdrop-blur-md text-white/90 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {currentArticle.date}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-md text-white">
                {currentArticle.title}
              </h1>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 max-w-3xl mx-auto space-y-8">
            
            {/* Author & Interactions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#EAE0D5]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FFF0E0] border-2 border-[#D9C8BA] flex items-center justify-center text-2xl shadow-xs">
                  {currentArticle.authorAvatar || '🧸'}
                </div>
                <div>
                  <p className="text-xs text-[#8C6D53] font-bold uppercase tracking-wider">Tác giả</p>
                  <p className="font-extrabold text-[#4A2E1B] text-sm sm:text-base">
                    {currentArticle.author}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Views Counter */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE0D5] text-xs font-bold text-[#6B4226]">
                  <Eye className="w-4 h-4 text-[#8C6D53]" />
                  <span>{(currentArticle.views || 1).toLocaleString('vi-VN')} lượt xem</span>
                </div>

                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition cursor-pointer ${
                    hasLiked
                      ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-xs'
                      : 'bg-white border-[#EAE0D5] text-[#6B4226] hover:border-rose-300 hover:text-rose-500'
                  }`}
                  title="Thả tim bài viết"
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{likes}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE0D5] text-xs font-bold text-[#6B4226] hover:bg-[#FAF4EB] hover:text-[#C25E2E] transition cursor-pointer"
                  title="Sao chép liên kết chia sẻ"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600">Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Chia sẻ</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Summary Highlight Box */}
            {currentArticle.summary && (
              <div className="bg-[#FFF8EE] border-l-4 border-[#C25E2E] p-5 sm:p-6 rounded-2xl rounded-l-none text-[#5A3821] text-sm sm:text-base leading-relaxed font-medium italic shadow-xs">
                "{currentArticle.summary}"
              </div>
            )}

            {/* Article Sections / Content */}
            <div className="space-y-6 text-[#4A2E1B] leading-relaxed">
              {Array.isArray(currentArticle.content) ? (
                currentArticle.content.map((sec, idx) => {
                  if (sec.type === 'heading') {
                    return (
                      <h2 key={idx} className="text-xl sm:text-2xl font-extrabold text-[#52321c] pt-4 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C25E2E]" />
                        {sec.text}
                      </h2>
                    );
                  }
                  if (sec.type === 'quote') {
                    return (
                      <div key={idx} className="my-5 p-5 bg-[#FAF0E4] border border-[#E0D0BE] rounded-2xl text-[#6B4226] font-semibold text-sm leading-relaxed flex items-start gap-3 shadow-2xs">
                        <span className="text-2xl leading-none">💡</span>
                        <p>{sec.text}</p>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-sm sm:text-base text-[#4A2F1B]/90 font-medium leading-relaxed">
                      {sec.text}
                    </p>
                  );
                })
              ) : (
                <p className="text-sm sm:text-base text-[#4A2F1B]/90 font-medium leading-relaxed">
                  {currentArticle.content || currentArticle.summary}
                </p>
              )}
            </div>

            {/* Tags Bar */}
            {currentArticle.tags && currentArticle.tags.length > 0 && (
              <div className="pt-6 border-t border-[#EAE0D5] flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#8C6D53] flex items-center gap-1 mr-1">
                  <Tag className="w-3.5 h-3.5" /> Thẻ:
                </span>
                {currentArticle.tags.map((t, i) => (
                  <span
                    key={i}
                    className="bg-white border border-[#E0D2C4] text-[#6B4226] text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Store Banner CTA */}
            <div className="bg-gradient-to-r from-[#FFF4EE] via-[#FCFAF7] to-[#FEF4DB] border border-[#EAE0D5] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-[#6B4226] text-white flex items-center justify-center text-3xl shrink-0 shadow-sm">
                  🧸
                </div>
                <div>
                  <h4 className="font-extrabold text-[#52321c] text-base sm:text-lg">
                    Yêu thích phong cách của Tiệm?
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B4226]/80 font-medium mt-0.5">
                    Khám phá ngay BST Mùa Thu với ưu đãi miễn phí viết thiệp tay và đóng hộp quà Kraft!
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onGoToCollection) onGoToCollection();
                }}
                className="shrink-0 bg-[#C25E2E] hover:bg-[#A84E24] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition shadow-md cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Xem Bộ Sưu Tập</span>
              </button>
            </div>

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <div className="pt-8 border-t border-[#EAE0D5]">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-extrabold text-lg text-[#52321c] flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#C25E2E]" />
                    Bài Viết Cùng Chủ Đề
                  </h3>
                  <span className="text-xs text-[#8C6D53] font-semibold">Khám phá thêm</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedArticles.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => {
                        if (onSelectArticle) {
                          onSelectArticle(rel);
                        } else {
                          setCurrentArticle(rel);
                          setLikes(rel.likes || 0);
                          setHasLiked(false);
                        }
                      }}
                      className="bg-white rounded-2xl p-3 border border-[#EAE0D5] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-32 rounded-xl overflow-hidden mb-3 relative bg-[#EAE0D5]">
                          <img
                            src={rel.image}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <span className="absolute bottom-2 left-2 bg-[#C25E2E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {rel.category}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-[#4A2E1B] group-hover:text-[#C25E2E] transition line-clamp-2 leading-snug">
                          {rel.title}
                        </h5>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#8C6D53] font-medium pt-3 mt-2 border-t border-[#F5EBE1]">
                        <span>{rel.readTime}</span>
                        <span className="flex items-center gap-1 font-bold text-[#C25E2E] group-hover:translate-x-1 transition-transform">
                          Đọc <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
