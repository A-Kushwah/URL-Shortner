export default function GonePage({ searchParams }: { searchParams: { slug?: string } }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 text-center">
      <p className="font-mono text-sm text-amberDeep mb-4">{searchParams.slug ? `/${searchParams.slug}` : ""}</p>
      <h1 className="font-display text-3xl mb-3">This link isn't available</h1>
      <p className="text-ink/60 max-w-md mx-auto">
        It may have been disabled by its owner, or it never existed. If you
        think this is a mistake, check the link with whoever shared it.
      </p>
    </div>
  );
}
