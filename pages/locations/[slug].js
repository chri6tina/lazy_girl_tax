import LocationLayout from '../../components/LocationLayout';
import { getLocationBySlug, locations } from '../../data/locations';

export default function LocationPage({ location }) {
  return <LocationLayout location={location} />;
}

export async function getStaticPaths() {
  return {
    paths: locations.map((location) => ({
      params: { slug: location.slug }
    })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const location = getLocationBySlug(params.slug);

  if (!location) {
    return { notFound: true };
  }

  return {
    props: {
      location
    }
  };
}
