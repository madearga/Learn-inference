import Link from "next/link";

export function Logo() {
  return (
    <Link
      aria-label="Learn Inference — home"
      className="hover:text-signal -mx-1 rounded-md px-1 py-1 transition-colors"
      href="/"
    >
      <span className="flex items-center gap-2.5">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="text-signal size-[1.25rem] shrink-0"
        >
          <path d="M7.6 3H14.1a1.1 1.1 0 0 1 1.1 1.1v8.3a1.1 1.1 0 0 1-1.1 1.1H4.1A1.1 1.1 0 0 1 3 12.4V6.6z" />
          <rect x="16.9" y="3" width="4.1" height="4.3" rx="0.9" />
          <rect x="16.9" y="9.1" width="4.1" height="4.4" rx="0.9" />
          <rect x="3" y="15.3" width="7.6" height="5.7" rx="1" />
          <rect x="12.2" y="15.3" width="8.8" height="5.7" rx="1" />
        </svg>
        <span className="font-serif text-[1.1875rem] leading-none font-medium tracking-[-0.02em]">
          Learn Inference
        </span>
      </span>
    </Link>
  );
}

export function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className={`remixicon ${className}`}>
      <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z" />
    </svg>
  );
}

export function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className={`remixicon ${className}`}>
      <path d="M16.3944 12.0001L10 7.7371V16.263L16.3944 12.0001ZM19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className={`remixicon ${className}`}>
      <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z" />
    </svg>
  );
}

export function BookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className={`remixicon ${className}`}>
      <path d="M13 21V23H11V21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H9C10.1947 3 11.2671 3.52375 12 4.35418C12.7329 3.52375 13.8053 3 15 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H13ZM20 19V5H15C13.8954 5 13 5.89543 13 7V19H20ZM11 19V7C11 5.89543 10.1046 5 9 5H4V19H11Z" />
    </svg>
  );
}

export function ListIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className={`remixicon ${className}`}>
      <path d="M8 4H21V6H8V4ZM4.5 6.5C3.67157 6.5 3 5.82843 3 5C3 4.17157 3.67157 3.5 4.5 3.5C5.32843 3.5 6 4.17157 6 5C6 5.82843 5.32843 6.5 4.5 6.5ZM4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12C6 12.8284 5.32843 13.5 4.5 13.5ZM4.5 20.4C3.67157 20.4 3 19.7284 3 18.9C3 18.0716 3.67157 17.4 4.5 17.4C5.32843 17.4 6 18.0716 6 18.9C6 19.7284 5.32843 20.4 4.5 20.4ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z" />
    </svg>
  );
}

export function FileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className={`remixicon ${className}`}>
      <path d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="border-hairline bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[110rem] items-center gap-4 px-5 sm:px-6">
        <div className="flex shrink-0 items-center">
          <Logo />
        </div>
        <div className="flex-1" />
        <div className="flex shrink-0 justify-end">
          <a
            href="https://www.baseten.co/inference-engineering/"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            The book
            <ExternalLinkIcon className="size-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
