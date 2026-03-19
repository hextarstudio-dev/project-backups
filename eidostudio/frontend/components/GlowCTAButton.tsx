import React from 'react';
import styled from 'styled-components';

type Props = {
  text: string;
  href: string;
  className?: string;
};

const GlowCTAButton: React.FC<Props> = ({ text, href, className = '' }) => {
  return (
    <Wrap className={className}>
      <a href={href} className="btn-container">
        <span className="glowing-button">
          {text}
          <span className="arrow">➔</span>
        </span>
      </a>
    </Wrap>
  );
};

const Wrap = styled.div`
  .btn-container {
    display: inline-block;
    padding: 3px;
    background: linear-gradient(180deg, #f7b6df, #d42a9b);
    border-radius: 19px;
    transform: perspective(850px) rotateX(8deg) rotateY(4deg) rotateZ(-6deg);
    color: white;
    box-shadow:
      -4px 4px 0px #a72078,
      -5px 7px 8px #8a195f91,
      -10px 13px 18px #8a195f50,
      -20px 20px 40px #8a195fa8;
    position: relative;
    transition: all 0.4s ease;
    text-decoration: none;
  }

  .btn-container:hover {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    box-shadow:
      0px 4px 5px #a72078,
      0px 7px 8px #8a195f91,
      0px 13px 18px #8a195f50,
      0px 20px 40px #8a195fa8;
  }

  .btn-container:active {
    box-shadow:
      0px 4px 5px #5c2b82c7,
      0px 7px 8px #8a195f5b,
      0px 5px 18px #8a195f34,
      0px 10px 40px #8a195f6e;
  }

  .btn-container:active > .glowing-button {
    box-shadow: inset 0px 6px 10px #5a123d4b;
  }

  .glowing-button {
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 16px 20px;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 16px;
    border: none;
    background: linear-gradient(180deg, #f564c7, #d42a9b);
    box-shadow: inset 0px -6px 10px #5a123d4b;
    text-shadow: -1px 1px 3px #4b1034bb;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .glowing-button:hover {
    background: linear-gradient(180deg, #f23db3, #bf2387);
    box-shadow:
      inset 0px -10px 20px #5a123d8a,
      0px 8px 15px #a72078;
    transform: translateY(-2px);
  }

  .arrow {
    font-size: 20px;
    margin-left: 8px;
    display: inline-block;
    filter: drop-shadow(-2px 2px 1px #4b10346c);
    transition:
      transform 0.3s ease,
      color 0.3s ease;
    animation: arrow-pulse 1.5s infinite alternate;
  }

  @keyframes arrow-pulse {
    0% {
      transform: translateX(0);
      color: white;
    }
    100% {
      transform: translateX(5px);
      color: #f7b6df;
    }
  }

  .glowing-button:hover .arrow {
    transform: translateX(12px);
    color: #ffc0e7;
  }

  @media (max-width: 640px) {
    .btn-container {
      transform: none;
      box-shadow: 0 10px 25px #8a195f55;
      width: 100%;
    }

    .glowing-button {
      width: 100%;
      padding: 14px 16px;
      font-size: 0.9rem;
      border-radius: 14px;
    }

    .arrow {
      font-size: 18px;
      margin-left: 6px;
    }
  }
`;

export default GlowCTAButton;
