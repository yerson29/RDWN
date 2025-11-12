import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const HomeIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.5a.75.75 0 01.75.75v3h3a.75.75 0 010 1.5h-3v3.5a.75.75 0 01-1.5 0V7.75h-3a.75.75 0 010-1.5h3v-3a.75.75 0 01.75-.75zM4 10.25a.75.75 0 01.75-.75h14.5a.75.75 0 01.75.75v8a.75.75 0 01-.75.75H4.75a.75.75 0 01-.75-.75v-8z"/>
  </svg>
);

export const ArchiveIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.5 5.5a.5.5 0 01.5-.5h14a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-14a.5.5 0 01-.5-.5v-2zm0 4a.5.5 0 01.5-.5h14a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-14a.5.5 0 01-.5-.5v-2zm0 4a.5.5 0 01.5-.5h14a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-14a.5.5 0 01-.5-.5v-2z"/>
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.25l2.42 4.908L20 8.086l-5.58 1.922L12 15l-2.42-4.992L4 8.086l5.58-1.922L12 2.25zM18.75 14.25l1.082 2.213 2.378-.82-1.081-2.213L18.75 14.25zM5.25 14.25l-1.082 2.213-2.378-.82 1.081-2.213L5.25 14.25z"/>
  </svg>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a.75.75 0 01.75.75v8.5l2.22-2.22a.75.75 0 011.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 011.06-1.06l2.22 2.22V2.75A.75.75 0 0112 2zM4.75 15.5a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z"/>
  </svg>
);

// Nuevos iconos agregados
export const ErrorIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2.003 4.043-2.003 5.198 0l.698 1.206c.635 1.096.345 2.553-.676 3.228L9.4 17.514c-1.021.675-2.493.385-3.128-.711l-.698-1.206c-1.155-2.003-4.043-2.003-5.198 0l-.698 1.206c-.635 1.096-.345 2.553.676 3.228L9.4 17.514c1.021.675 2.493.385 3.128-.711l.698-1.206c1.155-2.003 4.043-2.003 5.198 0L3.003 9.401c-2.003-1.155-2.003-4.043 0-5.198L4.209 3.505C5.305 2.87 6.762 2.58 7.437 3.601L9.401 3.003zM12 17.25a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V8.5a.75.75 0 011.5 0v8.75zM12 7.25a.75.75 0 01-.75-.75V7a.75.75 0 011.5 0v.5a.75.75 0 01-.75.75z" clipRule="evenodd" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export const ShareIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18 16.07l-5.46-3.86a.75.75 0 00-.73 0L6 16.07a3.75 3.75 0 100 2.86l5.81-4.14a.75.75 0 00.73 0l5.81 4.14a3.75 3.75 0 100-2.86zM20.25 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM3.75 14.25a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM20.25 5.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
  </svg>
);

export const ClipboardIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7.5 1h9A2.5 2.5 0 0119 3.5v17a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 015 20.5v-17A2.5 2.5 0 017.5 1zM7 3.5a.5.5 0 00-.5.5v17a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-17a.5.5 0 00-.5-.5H7.5zM10 5.5v1a.5.5 0 01-1 0v-1a.5.5 0 011 0zm4 0v1a.5.5 0 01-1 0v-1a.5.5 0 011 0zm-4 4v1a.5.5 0 01-1 0v-1a.5.5 0 011 0zm4 0v1a.5.5 0 01-1 0v-1a.5.5 0 011 0z"/>
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 12l3.938 5.71a.75.75 0 11-1.226.845l-4.5-6.5a.75.75 0 010-.845l4.5-6.5a.75.75 0 011.085-.091z" clipRule="evenodd" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M11.21 5.23a.75.75 0 01.02 1.06L15.168 12l-3.938 5.71a.75.75 0 111.226.845l4.5-6.5a.75.75 0 010-.845l-4.5-6.5a.75.75 0 01-1.085-.091z" clipRule="evenodd" />
  </svg>
);

export const KissIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 21.35c-4.42 0-8-3.58-8-8 0-4.42 3.58-8 8-8s8 3.58 8 8c0 4.42-3.58 8-8 8zm0-14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zM15 12c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm-6 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
  </svg>
);

export const SparkleHeartIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM19.75 5.25l1.082 2.213 2.378-.82-1.081-2.213L19.75 5.25zM4.25 5.25l-1.082 2.213-2.378-.82 1.081-2.213L4.25 5.25z"/>
  </svg>
);

export const MagicBookIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 6h-2V5c0-.55-.45-1-1-1s-1 .45-1 1v3H9c-.55 0-1 .45-1 1s.45 1 1 1h1v2c0 .55.45 1 1 1s1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1zM6 4h12v3H6V4zm12 16H6v-3h12v3z"/>
  </svg>
);

export const ViewIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

export const DreamHeartIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM12 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

export const MagicWandIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.2 6.06L18.79 4.65c-.78-.78-2.05-.78-2.83 0l-1.42 1.42L3 17.59V21h3.41L19.55 8.84l.65-.65c.78-.78.78-2.05 0z"/>
  </svg>
);

export const StarDustIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.25l2.42 4.908L20 8.086l-5.58 1.922L12 15l-2.42-4.992L4 8.086l5.58-1.922L12 2.25zM18.75 14.25l1.082 2.213 2.378-.82-1.081-2.213L18.75 14.25zM5.25 14.25l-1.082 2.213-2.378-.82 1.081-2.213L5.25 14.25zM12 17.25c.34-.68.6-1.4.75-2.19.15-.79.16-1.6.03-2.41a5.95 5.95 0 00-1.28-2.88c-.64-.9-1.57-1.61-2.6-2.06-1.04-.45-2.23-.62-3.42-.45-.6.09-1.2.29-1.75.58-.55.29-1.05.66-1.48 1.09-.43.43-.79.93-1.09 1.48-.29.55-.49 1.15-.58 1.75-.17 1.19 0 2.38.45 3.42.45 1.03 1.16 1.96 2.06 2.6.9.64 1.99 1.12 3.19 1.41.6.14 1.21.24 1.8.29.59.05 1.18.04 1.76-.03z" />
  </svg>
);

export const StarDiamondIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.25l2.42 4.908L20 8.086l-5.58 1.922L12 15l-2.42-4.992L4 8.086l5.58-1.922L12 2.25zM18.75 14.25l1.082 2.213 2.378-.82-1.081-2.213L18.75 14.25zM5.25 14.25l-1.082 2.213-2.378-.82 1.081-2.213L5.25 14.25zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ChatIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.163.847-2.28 2.305-2.28A9.873 9.873 0 0012 3.75a9.874 9.874 0 005.195-2.377c1.458 0 2.305 1.117 2.305 2.28v2.607c0 1.089-.785 2.016-1.939 2.146A10.154 10.154 0 0112 8.25c-2.486 0-4.8-.646-6.904-1.844C5.285 7.669 4.5 6.742 4.5 5.653zm-.75 4.996C3.75 9.243 4.296 7.854 5.378 7.337A10.024 10.024 0 0112 7.5c2.584 0 4.981.658 6.993 1.838 1.082.517 1.628 1.906 1.628 3.208-.501.077-.978.136-1.458.175A10.154 10.154 0 0112 12c-2.486 0-4.8-.646-6.904-1.844-.925-.494-1.596-1.636-1.596-2.907zM3.75 12.75a10.154 10.154 0 016.592 2.544 3.75 3.75 0 00-2.433 3.39c0 1.163.847 2.28 2.305 2.28A9.873 9.873 0 0012 20.25a9.874 9.874 0 005.195-2.377c1.458 0 2.305-1.117 2.305-2.28a3.75 3.75 0 00-2.433-3.39 10.154 10.154 0 01-6.592-2.544z" clipRule="evenodd" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 17.25a.75.75 0 01.75-.75h14.5a.75.75 0 01.75.75c0 1.488-2.618 2.748-5.744 3a24.234 24.234 0 01-8.012 0c-3.126-.252-5.744-1.512-5.744-3z" clipRule="evenodd" />
  </svg>
);

export const ExternalLinkIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

export const DeleteIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.92c-1.023 0-1.921-.716-2.243-2.077L4.77 5.757m14.482 0a.375.375 0 00-.375-.375H3.873a.75.75 0 00-.75.75V8.25m4.5-5.25h6" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14.25v4.5A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10.5" />
  </svg>
);

export const RevertIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
);

export const CameraIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.76.117-1.15.188A2.25 2.25 0 011.5 10.75v5.042a2.25 2.25 0 012.25 2.25h15A2.25 2.25 0 0122.5 15.75V10.75a2.25 2.25 0 01-2.25-2.25c-.173-.024-.34-.047-.506-.073-.585-.093-1.192-.163-1.8-.186v-.275a3.75 3.75 0 00-7.5 0C9.75 9.75 9 10.5 9 10.5h.375c.198 0 .385.045.535.124l1.096.533V7.5a.75.75 0 01.75-.75h.25a.75.75 0 01.75.75V8.25h1.25a.75.75 0 01.75.75v3.136l1.096-.533c.15-.079.337-.124.535-.124H22.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const DocumentIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h3.625c.571 0 1.05-.479 1.05-1.05s-.479-1.05-1.05-1.05H8.25m0 1.05v3.625M14.25 8.25h-3.625c-.571 0-1.05.479-1.05 1.05s.479 1.05 1.05 1.05h3.625M14.25 9.3v-3.625" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.004 5.907a.75.75 0 00-.735-.371H9.155a.75.75 0 00-.735.371l-.104.249-.001.001-.295.707a.75.75 0 00.584 1.057h5.176a.75.75 0 00.584-1.057l-.295-.707-.001-.001-.104-.249zM6.575 16.712a.75.75 0 00.584 1.057h10.336a.75.75 0 00.584-1.057l-.104-.249-.001-.001-.295-.707a.75.75 0 00-.584-1.057H7.159a.75.75 0 00-.584 1.057l-.295.707-.001-.001-.104-.249z" />
  </svg>
);

export const CommentIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.711 1.082 3.321 2.775 3.321h2.325a2.25 2.25 0 001.983 1.15A9 0 0012 18.75a9 9 0 006.213-2.119c.75-.68 1.436-1.397 2.053-2.181a.75.75 0 10-1.081-1.026 11.233 11.233 0 01-1.318 1.492.75.75 0 00-.175.147l-.15.15c-.098.098-.204.187-.312.272a2.25 2.25 0 01-1.037.587A7.489 7.489 0 0112 16.5c-2.023 0-3.876-.901-5.184-2.316l-.27-.36a.75.75 0 00-.91-.198c-.464.218-.949.444-1.465.659-.516.215-1.066.33-1.58.33-.217 0-.435-.027-.65-.084A.75.75 0 003 14.25c0-.022 0-.045.003-.067zM12 2.25c-5.16 0-9.722 3.067-10.748 7.521-.06.257-.102.52-.128.784A.75.75 0 002.25 11.25c0 1.637.51 3.206 1.45 4.54.94.757 1.948 1.402 3.012 1.916a.75.75 0 00.91-.198c.24-.32.47-.655.684-.99a.75.75 0 01.986-.178A7.5 7.5 0 0012 16.5c3.048 0 5.86-1.581 7.487-4.129a.75.75 0 00-.128-.784c-.06-.257-.102-.52-.128-.784A.75.75 0 0019.5 9.75c0-1.637-.51-3.206-1.45-4.54-.94-.757-1.948-1.402-3.012-1.916a.75.75 0 00-.91.198l-.27.36c-1.307 1.743-3.267 2.793-5.333 2.793z" />
  </svg>
);

export const ImageIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l1.5 1.5a.75.75 0 001.06 0l4.72-4.72a.75.75 0 011.06 0l.96.96a.75.75 0 001.06 0l7.5-7.5M10.5 16.5L10.5 6m0 0a.75.75 0 011.5 0v1.5m0 0a.75.75 0 011.5 0v1.5m-3-3a.75.75 0 01-1.5 0V6m0 0H5.25c-.414 0-.75-.336-.75-.75S4.836 4.5 5.25 4.5H12c.414 0 .75.336.75.75s-.336.75-.75.75h-6.75z" />
  </svg>
);

export const BookOpenIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75V15m0 0l-3.375-3.375M12 15l3.375-3.375M15.75 1.5h4.5a.75.75 0 01.75.75v17.25a.75.75 0 01-.75.75h-4.5V1.5zM3.75 1.5h4.5a.75.75 0 01.75.75v17.25a.75.75 0 01-.75.75h-4.5V1.5z" />
  </svg>
);

export const InformationCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25V11a.75.75 0 01.75-.75h.25a.75.75 0 01.75.75v.25m-3.75 0a.75.75 0 01.75-.75h.25a.75.75 0 01.75.75v.25m-3.75 0h.25a.75.75 0 01.75.75v.25m-3.75 0a.75.75 0 01.75-.75h.25a.75.75 0 01.75.75v.25m-3.75 0v.25M12 4.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" />
  </svg>
);

export const LightBulbIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 1.5v-1.5m-6 1.5a6 6 0 016-6v-1.5M12 18.75c-3.313 0-6-2.687-6-6v-1.5m-6 1.5c3.313 0 6-2.687 6-6v-1.5m-6 1.5v-1.5m-6 1.5a6 6 0 016-6v-1.5m-6 1.5h12M12 21.75a.75.75 0 01-.75-.75V19.5h1.5v1.5c0 .414-.336.75-.75.75z" />
  </svg>
);

export const BookStackIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5L7.5 9.75l4.5 4.5 4.5-4.5L12 4.5zM12 19.5L7.5 14.25l4.5-4.5 4.5 4.5L12 19.5z" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

// Se reemplaza MicrophoneIcon con MagicWandIcon
export const MicrophoneIcon: React.FC<IconProps> = (props) => (
    <MagicWandIcon {...props} />
);

// Se reemplaza MicrophoneSlashIcon con SparklesIcon
export const MicrophoneSlashIcon: React.FC<IconProps> = (props) => (
  <SparklesIcon {...props} />
);

export const CheckIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);