import Image from 'next/image';
import Button from '../atoms/Button';

// Runtime sanity checks for imported components
try {
  // eslint-disable-next-line no-console
  console.log('[ProductCard] Image type:', typeof Image, 'Button type:', typeof Button);
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('[ProductCard] Error logging imported components', e);
}

type ProductCardProduct = {
  id?: string | number;
  name: string;
  slug?: string;
  image?: { sourceUrl?: string } | null;
  price?: string | number | null;
  regularPrice?: string | number | null;
  shortDescription?: string | null;
};

export default function ProductCard({ product }: { product: ProductCardProduct }) {
  const img = product?.image?.sourceUrl || '/placeholder.png';
  const price = product?.price || product?.regularPrice || '—';
  return (
    <article className="border rounded-md overflow-hidden shadow-sm">
      <div className="relative h-48 w-full">
        <Image src={img} alt={product.name} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-2">{product.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold">{price}</span>
          <Button>Buy</Button>
        </div>
      </div>
    </article>
  );
}
