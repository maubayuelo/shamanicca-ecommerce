import React from 'react';

export type ArticleShareIconsProps = {
  articleTitle: string;
  articleUrl?: string;
  className?: string;
};

export default function ArticleShareIcons({ articleTitle, articleUrl, className = '' }: ArticleShareIconsProps) {
  const [resolvedUrl, setResolvedUrl] = React.useState(articleUrl || '');
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    // Resolve to absolute URL on client if needed
    if (typeof window !== 'undefined') {
      const url = articleUrl
        ? new URL(articleUrl, window.location.origin).toString()
        : window.location.href;
      setResolvedUrl(url);
    }
  }, [articleUrl]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      const input = document.createElement('input');
      input.value = resolvedUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const links = [
    {
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${articleTitle} - ${resolvedUrl}`)}`,
      title: 'Share on X',
      icon: 'x',
      external: true,
    },
    {
      href: `https://www.facebook.com/share.php?u=${encodeURIComponent(resolvedUrl)}&t=${encodeURIComponent(articleTitle)}`,
      title: 'Share on Facebook',
      icon: 'fb',
      external: true,
    },
    {
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${articleTitle} ${resolvedUrl}`)}`,
      title: 'Share on WhatsApp',
      icon: 'whatsapp',
      external: true,
    },
    {
      href: `https://telegram.me/share/url?url=${encodeURIComponent(resolvedUrl)}&text=${encodeURIComponent(articleTitle)}`,
      title: 'Share on Telegram',
      icon: 'telegram',
      external: true,
    },
    {
      href: `mailto:?subject=${encodeURIComponent(articleTitle)}&body=${encodeURIComponent(resolvedUrl)}`,
      title: 'Share via Email',
      icon: 'email',
      external: false,
    },
  ];

  return (
    <div className={`article-share-icons ${className}`}>
      <ul className="inline-flex items-center gap-3 m-0 p-0 list-none">
        <li>
          <span className="type-sm type-extrabold type-uppercase">Sharing is Love:</span>
        </li>
        {links.map((link, idx) => (
          <li key={`share-${idx}`}>
            <a
              href={link.href}
              title={link.title}
              aria-label={link.title}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
            >
              <span className="share-icon-wrap">
                <span className={`share-icon share-icon--${link.icon}`} aria-hidden="true" />
              </span>
            </a>
          </li>
        ))}
        <li>
          <a
            href="#"
            title="Copy link"
            aria-label="Copy link"
            onClick={(e) => {
              e.preventDefault();
              copyToClipboard();
            }}
          >
            <span className="share-icon-wrap">
              <span className="share-icon share-icon--link" aria-hidden="true" />
            </span>
          </a>
        </li>
        <li aria-live="polite" className={`type-xs ${copied ? '' : 'hidden'}`}>URL Copied</li>
      </ul>
    </div>
  );
}
