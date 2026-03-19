import React, { useState, useRef, useEffect } from 'react';
import { Course } from '../types';
import BrandAvatar from '../../../components/BrandAvatar';
import CommentsSection from './CommentsSection';

interface CoursePlayerProps {
  course: Course;
  activeLessonId: string | null;
  setActiveLessonId: (id: string) => void;
  onClose: () => void;
  onLogout: () => void;
  userName?: string;
  userAvatarUrl?: string;
  userId: string | null;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  activeLessonId,
  setActiveLessonId,
  onClose,
  onLogout,
  userName,
  userAvatarUrl,
  userId,
}) => {
  const resolvedUserName = userName || 'Raquel Monteiro';

  const hasLessons = course.lessons && course.lessons.length > 0;
  const activeLesson = hasLessons ? course.lessons.find(l => l.id === activeLessonId) : null;

  // Estado e Refs para o Player de Vídeo Interno
  const playerContainerRef = useRef<HTMLDivElement>(null); // Ref para o container (fullscreen correto)
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Volume controls
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Resetar o estado do player quando mudar de aula
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.volume = volume; // Manter volume anterior
    }
  }, [activeLessonId]);

  // Listener para Fullscreen nativo (ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = clickX / width;
      const newTime = percentage * duration;

      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
      if (!newMutedState && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const navigateLesson = (direction: 'next' | 'prev') => {
    if (!activeLessonId || !hasLessons) return;
    const currentIndex = course.lessons.findIndex(l => l.id === activeLessonId);

    if (direction === 'next' && currentIndex < course.lessons.length - 1) {
      setActiveLessonId(course.lessons[currentIndex + 1].id);
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveLessonId(course.lessons[currentIndex - 1].id);
    }
  };

  const renderContentArea = (url: string | undefined, type: 'video' | 'pdf' | 'text') => {
    const finalUrl = url;

    if (!finalUrl && type === 'video') return null;

    // Se for vídeo
    if (type === 'video' && finalUrl) {
      const isEmbed =
        finalUrl.includes('youtube.com') ||
        finalUrl.includes('youtu.be') ||
        finalUrl.includes('vimeo.com');

      // Se for YouTube/Vimeo (Embed)
      if (isEmbed) {
        return (
          <iframe
            width="100%"
            height="100%"
            src={finalUrl}
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        );
      }

      // Se for vídeo nativo (MP4) - Renderização Customizada Integrada
      return (
        <div
          ref={playerContainerRef}
          className="relative w-full h-full bg-black group cursor-pointer overflow-hidden rounded-xl"
          onClick={togglePlay}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <video
            ref={videoRef}
            src={finalUrl}
            className="w-full h-full object-contain"
            playsInline
            controls={false}
            loop
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Botão de Play Central (só aparece quando pausado) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(242,61,179,0.4)] group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-play text-white ml-2 text-3xl drop-shadow-md"></i>
              </div>
            </div>
          )}

          {/* Overlay de Controles Customizados */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-20 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
          >
            <div className="flex items-center gap-6" onClick={e => e.stopPropagation()}>
              <button
                onClick={togglePlay}
                className="text-white hover:text-brand-primary transition-colors focus:outline-none transform hover:scale-110 active:scale-95 duration-200 w-8"
              >
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-2xl`}></i>
              </button>

              {/* Barra de Progresso Real e Interativa */}
              <div
                className="flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer relative group/progress"
                onClick={handleSeek}
              >
                {/* Barra de Buffer/Background */}
                <div className="absolute inset-0 rounded-full"></div>

                {/* Barra de Progresso Atual */}
                <div
                  className="h-full bg-brand-primary absolute left-0 top-0 rounded-full transition-all duration-100 ease-linear relative"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                  {/* Bolinha na ponta (Scrubber) */}
                  <div className="absolute -right-1.5 -top-1.5 w-4 h-4 bg-white rounded-full shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity transform scale-0 group-hover/progress:scale-100"></div>
                </div>
              </div>

              {/* Display de Tempo */}
              <div className="text-xs font-bold text-white/90 font-mono min-w-[90px] text-center tracking-widest select-none">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <div className="flex items-center gap-4 text-white/80 relative">
                {/* Controle de Volume */}
                <div
                  className="relative flex items-center justify-center"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  {/* Popup Slider de Volume */}
                  <div
                    className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/90 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl transition-all duration-200 ${showVolumeSlider ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}
                  >
                    <div className="h-24 w-6 flex items-center justify-center relative">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        style={{
                          background: `linear-gradient(to right, #F23DB3 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%)`,
                        }}
                        className="w-24 h-1 rounded-lg appearance-none cursor-pointer absolute -rotate-90 origin-center accent-brand-primary outline-none"
                      />
                    </div>
                  </div>

                  <button onClick={toggleMute} className="hover:text-white transition-colors w-8">
                    <i
                      className={`fas ${isMuted || volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up'} text-lg`}
                    ></i>
                  </button>
                </div>

                {/* Botão Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="hover:text-white transition-colors w-8"
                >
                  <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-lg`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Se for arquivo ou outro tipo
    return (
      <div className="text-center p-8 animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center h-full">
        <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-primary/20 shadow-[0_0_50px_rgba(242,61,179,0.1)]">
          <i
            className={`fas ${type === 'pdf' ? 'fa-file-pdf' : 'fa-file-alt'} text-4xl text-brand-primary`}
          ></i>
        </div>
        <h3 className="text-3xl font-bold font-baloo mb-2 text-white">Arquivo do Produto</h3>
        <p className="text-brand-gray-400 max-w-md mx-auto mb-8">
          Este é o produto principal deste módulo. Clique abaixo para realizar o download do
          arquivo.
        </p>
        <button
          onClick={() => url && window.open(url, '_blank', 'noopener,noreferrer')}
          disabled={!url}
          className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-primary-light transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-download"></i> Baixar Agora
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500 bg-[#0f0f0f]">
      {/* Player Header */}
      <div className="h-24 min-h-24 px-6 md:px-10 flex items-center justify-between border-b border-white/5 bg-[#0f0f0f]">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
          >
            <i className="fas fa-arrow-left text-sm"></i>
          </button>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <h2 className="font-bold text-sm md:text-base text-white/80">{course.title}</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-brand-gray-500 uppercase tracking-widest hidden md:inline">
              Progresso
            </span>
            <div className="w-24 md:w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-primary"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <button
              onClick={onLogout}
              className="text-brand-gray-500 hover:text-red-400 transition-colors"
              title="Sair"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
            <BrandAvatar name={resolvedUserName} imageUrl={userAvatarUrl} size="sm" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Content Viewer */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-6 md:p-10 relative">
          {/* Main Viewer Area - Isolado do Flexbox para evitar achatamento */}
          <div className="w-full flex-shrink-0 mb-8 block">
            <div className="w-full aspect-video min-h-[300px] md:min-h-[400px] lg:min-h-[480px] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 relative flex items-center justify-center ring-1 ring-white/5">
              {hasLessons ? (
                renderContentArea(activeLesson?.url, activeLesson?.type || 'text')
              ) : (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-80"
                />
              )}
            </div>
          </div>

          {/* Meta & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              {hasLessons && (
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                      activeLesson?.type === 'video'
                        ? 'border-brand-primary/30 text-brand-primary bg-brand-primary/10'
                        : activeLesson?.type === 'pdf'
                          ? 'border-brand-orange/30 text-brand-orange bg-brand-orange/10'
                          : 'border-white/30 text-white bg-white/10'
                    }`}
                  >
                    {activeLesson?.type === 'video'
                      ? 'Instruções de Uso'
                      : activeLesson?.type === 'pdf'
                        ? 'Produto Principal'
                        : 'Texto'}
                  </span>
                  <span className="text-xs text-brand-gray-500 font-bold">•</span>
                  <span className="text-xs text-brand-gray-500 font-bold">
                    {activeLesson?.duration}
                  </span>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold font-baloo mb-4 text-white leading-tight">
                {hasLessons ? activeLesson?.title : course.title}
              </h1>
              <p className="text-brand-gray-400 leading-relaxed text-sm md:text-base font-light">
                {hasLessons
                  ? activeLesson?.description || 'Sem descrição disponível para esta aula.'
                  : course.description ||
                    'Bem-vindo ao produto. Junte-se à comunidade nos comentários abaixo.'}
              </p>
            </div>

            {/* Navigation Buttons */}
            {hasLessons && (
              <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-auto">
                <button
                  onClick={() => navigateLesson('prev')}
                  disabled={
                    !course.lessons[course.lessons.findIndex(l => l.id === activeLessonId) - 1]
                  }
                  className="flex-1 md:flex-none px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <i className="fas fa-arrow-left"></i> Anterior
                </button>
                <button
                  onClick={() => navigateLesson('next')}
                  className="flex-1 md:flex-none px-6 py-3 rounded-lg bg-white text-brand-neutral hover:bg-brand-gray-200 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-primary/20"
                >
                  Próximo <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            )}
          </div>

          {/* Comments Section */}
          {userId && <CommentsSection lessonId={activeLessonId || course.id} userId={userId} />}
        </div>

        {/* Right Column: Playlist */}
        {hasLessons && (
          <div className="w-full lg:w-96 bg-[#151515] border-l border-white/5 flex flex-col h-full lg:h-auto overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="font-bold text-white font-baloo text-lg">Conteúdo do Módulo</h3>
              <p className="text-xs text-brand-gray-500 mt-1">
                {course.lessons.length} aulas disponíveis
              </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
              {course.lessons.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border group relative overflow-hidden ${
                    activeLessonId === lesson.id
                      ? 'bg-brand-primary/10 border-brand-primary/30'
                      : 'bg-[#1a1a1a] border-transparent hover:border-white/10'
                  }`}
                >
                  {activeLessonId === lesson.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary"></div>
                  )}
                  <div className="flex gap-3 relative z-10">
                    <div
                      className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                        activeLessonId === lesson.id
                          ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                          : 'bg-white/5 text-brand-gray-500 border border-white/10'
                      }`}
                    >
                      {lesson.type === 'video' && <i className="fas fa-play ml-0.5"></i>}
                      {lesson.type === 'pdf' && <i className="fas fa-file"></i>}
                      {lesson.type === 'text' && <i className="fas fa-align-left"></i>}
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold leading-snug mb-1 transition-colors ${activeLessonId === lesson.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}
                      >
                        {lesson.title}
                      </h4>
                      <span className="text-[10px] text-brand-gray-500 font-medium uppercase tracking-wider">
                        {lesson.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;
