import { Link } from "@/i18n/routing";
import { usePathname, useSearchParams } from 'next/navigation';

export default function LocalizedLink({ href, children, locale, className, activeClassName, ...props }) {
  const currentPath = usePathname();
  const currentLocale = locale || currentPath.split('/')[1]; // Extract locale from the path
  const searchParams = useSearchParams();
  const isActive = currentPath === `/${currentLocale}${href}`;

  // Preserve query parameters
  const query = searchParams.toString();
  const fullHref = query ? `${href}?${query}` : href;

  // Combine className with activeClassName if active
  const combinedClassName = `${className || ''} ${isActive ? activeClassName || '' : ''}`.trim();

  return (
    <Link
      href={fullHref}
      locale={currentLocale}
      className={combinedClassName}
      {...props}
    >
      {children}
    </Link>
  );
}
