import React, { useState, useEffect } from 'react';
import BrandAvatar from '../../../components/BrandAvatar';
import { useConfirm } from '../../../context/ConfirmContext';
import { authFetch } from '../../../utils/authFetch';

interface Comment {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  created_at: string;
  name: string;
  avatar_url: string | null;
}

interface CommentsSectionProps {
  lessonId: string;
  userId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ lessonId, userId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const { confirm } = useConfirm();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await authFetch(`/hub/comments/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lessonId) {
      fetchComments();
    }
  }, [lessonId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userId) return;

    setSubmitting(true);
    try {
      const response = await authFetch(`/hub/comments/${lessonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content: newComment.trim() }),
      });

      if (response.ok) {
        setNewComment('');
        await fetchComments(); // Reload comments
      } else {
        alert('Erro ao enviar comentário.');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Erro de conexão ao enviar comentário.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    const confirmed = await confirm('Tem certeza que deseja apagar este comentário?');
    if (!confirmed) return;

    try {
      const response = await authFetch(`/hub/comments/${lessonId}/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        await fetchComments();
      } else {
        alert('Erro ao apagar comentário.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Erro de conexão ao apagar comentário.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="mt-12 pt-8 border-t border-white/5">
      <h3 className="text-xl font-bold font-baloo text-white mb-6">
        Comentários{' '}
        <span className="text-brand-gray-500 text-sm font-normal">({comments.length})</span>
      </h3>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="mb-10 flex gap-4 items-start">
        {/* Usando dummy se user n tiver avatar pra enviar - resolvido na UI pai */}
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Adicione um comentário ou dúvida sobre a aula..."
            className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-y min-h-[80px] text-sm custom-scrollbar"
            disabled={submitting}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="bg-brand-primary text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-brand-primary/20"
            >
              {submitting ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
              Enviar
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <i className="fas fa-circle-notch fa-spin text-brand-primary text-2xl"></i>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 bg-[#1a1a1a] rounded-xl border border-white/5">
            <i className="fas fa-comments text-3xl text-brand-gray-500 mb-3 opacity-50"></i>
            <p className="text-brand-gray-400 text-sm">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          </div>
        ) : (
          comments.map(comment => (
            <div
              key={comment.id}
              className="flex gap-4 p-4 rounded-xl bg-[#151515] border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                <BrandAvatar
                  name={comment.name || 'Usuário'}
                  imageUrl={comment.avatar_url || undefined}
                  size="sm"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-white text-sm">{comment.name || 'Usuário'}</h4>
                  <div className="flex items-center gap-3 relative">
                    <span className="text-[10px] text-brand-gray-500 font-medium">
                      {formatDate(comment.created_at)}
                    </span>
                    {comment.user_id === userId && (
                      <div className="relative">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setActiveDropdownId(
                              activeDropdownId === comment.id ? null : comment.id
                            );
                          }}
                          className="text-brand-gray-500 hover:text-white transition-colors p-1"
                          title="Opções"
                        >
                          <i className="fas fa-ellipsis-v text-[12px] w-4 text-center"></i>
                        </button>

                        {activeDropdownId === comment.id && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-[#1a1a1a] rounded-lg shadow-xl border border-white/10 overflow-hidden z-10 animate-fade-in-up">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setActiveDropdownId(null);
                                handleDelete(comment.id);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-white/5 transition-colors flex items-center gap-2"
                            >
                              <i className="fas fa-trash-alt w-3"></i>
                              Apagar Comentário
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-brand-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
