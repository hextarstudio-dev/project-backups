import React, { useState } from 'react';
import styled from 'styled-components';

interface KeycapButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'dark' | 'light';
  width?: string;
  className?: string;
}

const KeycapButton: React.FC<KeycapButtonProps> = ({
  text,
  onClick,
  variant = 'dark',
  width = '300px',
  className = '',
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPressed) return;

    // Inicia a sequência mecânica
    setIsPressed(true);

    // Duração total da animação (descida + subida + margem de conforto)
    setTimeout(() => {
      setIsPressed(false);

      // Espera a tecla "subir" antes de navegar
      setTimeout(() => {
        if (onClick) onClick();
      }, 150);
    }, 150);
  };

  return (
    <StyledWrapper
      className={className}
      onClick={handleClick}
      $variant={variant}
      $width={width}
      $isPressed={isPressed}
    >
      <article className="keycap">
        <aside className="letter">{text}</aside>
      </article>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{
  $variant: 'dark' | 'light';
  $width: string;
  $isPressed: boolean;
}>`
  cursor: pointer;
  display: inline-block;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  .keycap {
    position: relative;
    display: inline-block;
    width: ${props => props.$width};
    height: 60px; /* Reduzido de 80px */
    border-radius: 10px;
    background: ${props =>
      props.$variant === 'dark'
        ? 'linear-gradient(180deg, #282828, #202020)'
        : 'linear-gradient(180deg, #ffffff, #e0e0e0)'};

    /* Aplica o estado pressionado baseado na prop ou no estado :active nativo */
    transform: ${props => (props.$isPressed ? 'translateY(3px)' : 'translateY(0)')};

    box-shadow: ${props =>
      props.$isPressed
        ? `inset -3px 0 3px rgba(0, 0, 0, 0.1),
         inset 0 -3px 3px rgba(0, 0, 0, 0.15),
         0 0 0 2px rgba(0, 0, 0, 0.5),
         2px 4px 8px rgba(0, 0, 0, 0.2)`
        : `inset -6px 0 6px rgba(0, 0, 0, 0.15),
         inset 0 -6px 6px rgba(0, 0, 0, 0.25),
         0 0 0 2px rgba(0, 0, 0, 0.75),
         8px 15px 20px rgba(0, 0, 0, 0.4)`};

    overflow: hidden;
    transition:
      transform 0.12s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.12s cubic-bezier(0.4, 0, 0.2, 1);

    .letter {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => (props.$variant === 'dark' ? '#e9e9e9' : '#1A1A1A')};
      font-size: 15px; /* Leve redução para equilibrar */
      font-weight: 600;
      letter-spacing: 0.025em;
      transition: transform 0.12s ease-in-out;
      z-index: 2;
      padding-bottom: ${props => (props.$isPressed ? '1px' : '4px')};
      padding-right: 2px;
      text-align: center;
      padding-left: 2px;
      transform: ${props => (props.$isPressed ? 'translateY(1px)' : 'translateY(0)')};
    }

    &::before {
      content: '';
      position: absolute;
      top: ${props => (props.$isPressed ? '4px' : '2px')};
      left: ${props => (props.$isPressed ? '4px' : '3px')};
      bottom: ${props => (props.$isPressed ? '8px' : '10px')};
      right: ${props => (props.$isPressed ? '8px' : '9px')};
      background: ${props =>
        props.$variant === 'dark'
          ? 'linear-gradient(90deg, #232323, #4a4a4a)'
          : 'linear-gradient(90deg, #ffffff, #f0f0f0)'};
      border-radius: 8px;
      box-shadow: ${props => {
        if (props.$isPressed) {
          return props.$variant === 'dark'
            ? '-3px -3px 3px rgba(255, 255, 255, 0.1), 3px 2px 3px rgba(0, 0, 0, 0.1)'
            : '-3px -3px 3px rgba(255, 255, 255, 0.4), 3px 2px 3px rgba(0, 0, 0, 0.05)';
        }
        return props.$variant === 'dark'
          ? '-8px -8px 8px rgba(255, 255, 255, 0.2), 8px 4px 8px rgba(0, 0, 0, 0.15)'
          : '-8px -8px 8px rgba(255, 255, 255, 0.8), 8px 4px 8px rgba(0, 0, 0, 0.05)';
      }};
      border-left: 1px solid #0004;
      border-bottom: 1px solid #0004;
      border-top: 1px solid #0009;
      transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  &:active .keycap {
    transform: translateY(3px);
  }
`;

export default KeycapButton;
