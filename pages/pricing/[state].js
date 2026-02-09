import PricingPage from '../../components/PricingPage';
import { states } from '../../data/states';

export default function PricingByState({ state }) {
  return <PricingPage state={state} />;
}

export async function getStaticPaths() {
  return {
    paths: states.map((state) => ({ params: { state: state.slug } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const state = states.find((item) => item.slug === params.state);

  if (!state) {
    return { notFound: true };
  }

  return {
    props: { state }
  };
}
