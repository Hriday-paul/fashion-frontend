import Link from "next/link";

export function FooterColumn({ links, title }: { title: string, links: { name: string; link: string, id: number, prefetch?: boolean }[] }) {
  return (
    <div>
      <h3 className="text-white text-lg font-bold mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link?.id}>
            <Link
              href={link?.link}
              prefetch={link?.prefetch}
              className="text-gray-400 hover:text-white transition-colors text-base"
            >
              {link?.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
