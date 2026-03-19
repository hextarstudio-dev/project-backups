import React from 'react';
import styled from 'styled-components';

type Props = {
  image: string;
  title: string;
  category?: string;
  compact?: boolean;
};

const CoverCardFX: React.FC<Props> = ({ image, title, category, compact = false }) => {
  return (
    <Wrap className={compact ? 'compact' : ''}>
      <div className="main-container">
        <div className="border">
          <div className="card">
            <div className="shadow">
              <div className="content">
                <img src={image} alt={title} className="cover" />
                <div className="overlay" />
                <p className="cat">{category || 'Produto Digital'}</p>
                <p className="title">{title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  );
};

const Wrap = styled.div`
  .main-container {
    position: relative;
    height: 290px;
    aspect-ratio: 0.75;
    border-radius: 1em;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 300ms ease-in;
    transform-style: preserve-3d;
  }

  &.compact .main-container {
    height: 210px;
  }

  .main-container:hover {
    transform: rotateZ(0.8deg) rotateY(10deg) scale(1.03);
    box-shadow: 0 2.2em 2em rgba(0, 0, 0, 0.28);
  }

  .border {
    width: 100%;
    height: 100%;
    border-radius: 1em;
    padding: 2px;
    background: linear-gradient(
      115deg,
      rgba(0, 0, 0, 0.3) 8%,
      rgba(255, 255, 255, 0.35) 30%,
      rgba(0, 0, 0, 0.35) 58%
    );
    position: relative;
  }

  .border:hover:after {
    position: absolute;
    content: '';
    inset: -90%;
    border-radius: 1em;
    background: linear-gradient(
      115deg,
      rgba(255, 255, 255, 0) 42%,
      rgba(255, 255, 255, 0.9) 49%,
      rgba(255, 255, 255, 0) 56%
    );
    animation: sweep 2.8s linear infinite;
    z-index: 1;
    opacity: 0.18;
    pointer-events: none;
  }

  .card {
    width: 100%;
    height: 100%;
    border-radius: 1em;
    background: #999;
    opacity: 0.95;
    overflow: hidden;
  }

  .shadow {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 0.95em;
    border: 1px solid #bbb;
    background: linear-gradient(
      135deg,
      rgba(3, 3, 3, 0.36) 0%,
      transparent 35%,
      transparent 70%,
      rgba(0, 0, 0, 0.45) 100%
    );
    box-sizing: border-box;
  }

  .content {
    position: absolute;
    inset: 6px;
    border-radius: 0.75em;
    border: 1px solid rgba(255, 255, 255, 0.35);
    overflow: hidden;
    background: #111;
  }

  .cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.78) 16%,
      rgba(0, 0, 0, 0.15) 60%,
      rgba(0, 0, 0, 0.06)
    );
  }

  .cat {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.85);
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.24);
    border-radius: 999px;
    padding: 4px 8px;
  }

  .title {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 12px;
    font-size: 14px;
    line-height: 1.2;
    font-weight: 800;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
  }

  @keyframes sweep {
    0% {
      transform: translate(-35%, -35%) rotate(12deg);
    }
    100% {
      transform: translate(35%, 35%) rotate(12deg);
    }
  }
`;

export default CoverCardFX;
