import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Article } from '../types';
import { FolderTree, ArrowRight, BookOpen } from 'lucide-react';

interface CategorySectionProps {
  onSelectArticle: (article: Article) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onSelectArticle }) => {
  const { categories, articles, config } = useStore();
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(categories[0]?.slug || 'comunidade');

  const activeCategory = categories.find((c) => c.slug === activeCategorySlug) || categories[0];

  const categoryArticles = articles.filter(
    (a) => a.status === 'published' && a.category.toLowerCase() === activeCategory?.name.toLowerCase()
  );

  return (
    <section id="categorias" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-widest font-sans">
            <FolderTree className="w-4 h-4" />
            <span>{config.structureTexts?.categoriesEyebrow || 'Editorias do Portal'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-slate-900 mt-1">
            {config.structureTexts?.categoriesSectionTitle || config.structureTexts?.citiesSectionTitle || 'Categorias e Temáticas'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-sans">
            {config.structureTexts?.categoriesSectionSubtitle || 'Navegue pelas editorias oficiais do COMUNIDADE EM AÇÃO, organizadas para dar visibilidade integral ao estado do Amazonas.'}
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-200">
          {categories
            .filter((c) => c.isActive)
            .map((cat) => {
              const count = articles.filter(
                (a) => a.status === 'published' && a.category.toLowerCase() === cat.name.toLowerCase()
              ).length;

              const isSelected = cat.slug === activeCategorySlug;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategorySlug(cat.slug)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0f3d59] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
        </div>

        {/* Selected Category Content */}
        {activeCategory && (
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider font-sans">
                Editoria Selecionada
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-editorial text-slate-900 mt-1">
                {activeCategory.name}
              </h3>
              <p className="text-sm text-slate-600 mt-1 font-sans">
                {activeCategory.description}
              </p>
            </div>

            {categoryArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art)}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[11px] font-sans text-slate-500 mb-2">
                        <span>{art.location}</span>
                        <span className="mx-1">·</span>
                        <span>{art.authorName}</span>
                      </div>
                      <h4 className="font-editorial text-base sm:text-lg font-bold text-slate-900 line-clamp-2 hover:text-[#0f3d59] transition-colors">
                        {art.title}
                      </h4>
                      {art.subtitle && (
                        <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                          {art.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#0f3d59] font-semibold">
                      <span>Ler reportagem</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center max-w-md mx-auto my-4">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-editorial text-base font-bold text-slate-800">
                  Nenhuma matéria em {activeCategory.name} ainda
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Tem uma sugestão de reportagem para esta editoria? Envie pela seção Comunidade Participa logo abaixo.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
