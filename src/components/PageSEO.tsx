import SEO from "./SEO";
import usePageSEO from "../utils/usePageSEO";

const PageSEO = () => {
  const seo = usePageSEO();

  if (!seo) return null; // 🔴 DB-তে না থাকলে কিছুই render হবে না

  return (
    <SEO
      title={seo.seo_title}
      description={seo.meta_description}
      keywords={seo.target_keyword}
      canonical={`https://sahajinsight.com${seo.page_path}`}
    />
  );
};

export default PageSEO;
