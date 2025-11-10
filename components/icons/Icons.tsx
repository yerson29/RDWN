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
    <path d="M20.2 6.06L18.79 4.65c-.78-.78-2.05-.78-2.83 0l-1.42 1.42L3 17.59V21h3.41L19.55 8.84l.65-.65c.78-.78.78-2.05 0-2.83zM14.5 8.91L13.09 7.5l-8.58 8.58L5.91 20H8v-.58l-.42-.42 8.58-8.58zM17.66 3.5l.79.79-1.42 1.42-.79-.79 1.42-1.42z"/>
  </svg>
);

export const StarDustIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .5l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 18.25l-6.18 3.25L7 12.14 2 7.27l6.91-.51L12 .5z"/>
  </svg>
);

export const StarDiamondIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 1L3 12l9 11 9-11-9-11zm0 3.86L16.29 9H7.71L12 3.86zM5.5 11l4.5 5.5-4.5 5.5H5.5zm13 0l-4.5 5.5 4.5 5.5H18.5z"/>
  </svg>
);

export const BookStackIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h12v2H6V4zm12 16H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V8h12v2z"/>
  </svg>
);

export const CameraIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM6 18c-1.1 0-2-.9-2-2v-4.5l2-2 2 2 4.5-4.5 2 2V18H6zm14 0h-4v-3.5l-2-2-4.5 4.5-2-2-2 2V18h-.5c-.28 0-.5-.22-.5-.5V6c0-.28.22-.5.5-.5h2.21l1.19-2h5c.28 0 .5.22.5.5v2.5h2.21c.28 0 .5.22.5.5V18c0 .28-.22.5-.5.5z"/>
  </svg>
);

export const DocumentIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/>
  </svg>
);

export const MagicIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

export const EditIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

export const CommentIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);

export const BookOpenIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21 4H7v16h14V4zm-2 14H9V6h10v12zM7 2a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2H7zm0 2h14v16H7V4zm-2 16h14v-1H7v1zm0-2h14v-1H7v1z"/>
  </svg>
);

export const RevertIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.5 8c-2.65 0-5.05.99-6.91 2.61L3 7v10h10l-3.61-3.61C9.64 12.06 11.07 11.5 12.5 11.5c3.54 0 6.55 2.31 7.6 5.5h2.18c-1.18-4.23-5.07-7.5-9.78-7.5z"/>
  </svg>
);

export const ExternalLinkIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
  </svg>
);

export const DeleteIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0017 10c0-3.59-2.91-6.5-6.5-6.5S4 6.41 4 10s2.91 6.5 6.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

export const ImageIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
  </svg>
);

export const CloseIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
  </svg>
);

export const UserIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.29-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.93-3.5 3.22-6 3.22z"/>
  </svg>
);

export const MenuIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 17.25z" clipRule="evenodd" />
  </svg>
);