// Type-safe wrapper for react-router-dom to avoid 'as any'
import * as ReactRouterDOM from 'react-router-dom';

export const { Routes, Route, useLocation, useNavigate, useParams, Navigate, Link, BrowserRouter } =
  ReactRouterDOM as {
    Routes: React.FC<{ children: React.ReactNode }>;
    Route: React.FC<{ path?: string; element?: React.ReactNode; index?: boolean }>;
    useLocation: () => { pathname: string; search: string; hash: string; state: unknown };
    useNavigate: () => (
      to: string | number,
      options?: { replace?: boolean; state?: unknown }
    ) => void;
    useParams: <T = Record<string, string>>() => T;
    Navigate: React.FC<{ to: string; replace?: boolean }>;
    Link: React.FC<{
      to: string;
      className?: string;
      children: React.ReactNode;
      onClick?: () => void;
      onMouseEnter?: () => void;
      onMouseLeave?: () => void;
      title?: string;
    }>;
    BrowserRouter: React.FC<{ children: React.ReactNode }>;
  };
