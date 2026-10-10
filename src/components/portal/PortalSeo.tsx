import { Helmet } from "react-helmet-async";

// Portal-only SEO: canonical on the portal hostname and always noindex.
const PORTAL_URL = "https://portal.altowhisky.com";

interface PortalSeoProps {
  title: string;
  description: string;
  path: string;
  // Accepted for call-site compatibility; ignored in the portal.
  type?: string;
  image?: string;
  jsonLd?: unknown;
}

const PortalSeo = ({ title, description, path }: PortalSeoProps) => {
  const url = `${PORTAL_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
    </Helmet>
  );
};

export default PortalSeo;
