"use client";
import * as React from "react";
import { ChevronRight, ChevronDown, X, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCategoryQuery } from "@/redux/api/categoryApi";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children: Category[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLLAPSE_THRESHOLD = 6;

const categoryHref = (id: string) => `/shop?category=${id}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Leaf item – no children */
function LeafItem({
  item,
  onNavigate,
}: {
  item: Category;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={categoryHref(item.id)}
      onClick={onNavigate}
      className={cn(
        "block w-full text-left px-3 py-2 cursor-pointer rounded transition-colors text-gray-600 hover:text-black hover:bg-gray-50 hover:font-medium text-base",
      )}
    >
      {item.name}
    </Link>
  );
}

/**
 * Renders a list of leaf children with a "See X more / See less" toggle
 * when the count exceeds COLLAPSE_THRESHOLD.
 */
function CollapsibleLeafList({
  items,
  onNavigate,
}: {
  items: Category[];
  onNavigate: () => void;
}) {
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)]; // 2 groups

  return (
    <div className="flex flex-row items-start max-w-xl">
      {columns.map((col, i) => (            // one wrapper per COLUMN
        <div key={i} className="flex flex-col w-1/2">
          {col.map((item) => (              // items stack inside it
            <LeafItem key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Mobile accordion item — collapses children list beyond COLLAPSE_THRESHOLD */
function MobileAccordionItem({
  item,
  depth,
  onNavigate,
}: {
  item: Category;
  depth: number;
  onNavigate: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [childrenExpanded, setChildrenExpanded] = React.useState(false);
  const canShowChildren = depth < 1;
  const hasChildren = canShowChildren && item.children.length > 0;
  const needsCollapse = hasChildren && item.children.length > COLLAPSE_THRESHOLD;
  const visibleChildren =
    needsCollapse && !childrenExpanded
      ? item.children.slice(0, COLLAPSE_THRESHOLD)
      : item.children;
  const hiddenCount = item.children.length - COLLAPSE_THRESHOLD;

  const rowClassName = cn(
    "flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
    depth === 0 ? "font-semibold text-sm" : "text-sm",
    "hover:bg-gray-100"
  );
  const rowStyle = { paddingLeft: `${(depth + 1) * 12}px` };

  return (
    <div>
      {hasChildren ? (
        <div
          className={rowClassName}
          style={rowStyle}
          onClick={() => setOpen((p) => !p)}
        >
          <span>{item.name}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform flex-shrink-0",
              open && "rotate-180"
            )}
          />
        </div>
      ) : (
        <Link
          href={categoryHref(item.id)}
          onClick={onNavigate}
          className={rowClassName}
          style={rowStyle}
        >
          <span>{item.name}</span>
        </Link>
      )}

      {hasChildren && open && (
        <div className="mt-0.5 space-y-0.5">
          {visibleChildren.map((child) => (
            <MobileAccordionItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
          {needsCollapse && (
            <button
              onClick={() => setChildrenExpanded((p) => !p)}
              style={{ paddingLeft: `${(depth + 2) * 12}px` }}
              className="flex items-center gap-1 py-2 text-xs font-medium text-gray-400 hover:text-black transition-colors w-full"
            >
              {childrenExpanded ? (
                <>
                  <ChevronDown className="h-3 w-3 rotate-180 flex-shrink-0" />
                  See less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 flex-shrink-0" />
                  See {hiddenCount} more
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MegaNavigation() {
  const { data: categoryData } = useGetCategoryQuery(undefined);
  const categories: Category[] = categoryData?.data ?? [];

  // Desktop state
  const [activeRootId, setActiveRootId] = React.useState<string | null>(null);
  const [hoveredL2Id, setHoveredL2Id] = React.useState<string | null>(null);

  // Mobile state
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileRootId, setMobileRootId] = React.useState<string | null>(null);

  const navRef = React.useRef<HTMLDivElement>(null);

  // Active root node
  const activeRoot = activeRootId
    ? categories.find((c) => c.id === activeRootId) ?? null
    : null;

  // The L2 subcategory whose children to show on the right panel
  const activeL2: Category | null = React.useMemo(() => {
    if (!activeRoot) return null;
    if (hoveredL2Id) {
      return activeRoot.children.find((c) => c.id === hoveredL2Id) ?? null;
    }
    // default: first child with grandchildren, or just first child
    return (
      activeRoot.children.find((c) => c.children.length > 0) ??
      activeRoot.children[0] ??
      null
    );
  }, [activeRoot, hoveredL2Id]);

  // Reset menu UI state after a Link navigation fires
  const closeMenus = React.useCallback(() => {
    setActiveRootId(null);
    setHoveredL2Id(null);
    setMobileOpen(false);
    setMobileRootId(null);
  }, []);

  const handleNavLeave = () => {
    setActiveRootId(null);
    setHoveredL2Id(null);
  };

  // Mobile root node
  const mobileRoot = mobileRootId
    ? categories.find((c) => c.id === mobileRootId) ?? null
    : null;

  return (
    <>
      {/* ── Desktop Nav ─────────────────────────────────────────────────────── */}
      <div
        ref={navRef}
        className="hidden md:block relative border-y "
        onMouseLeave={handleNavLeave}
      >
        {/* Top bar */}
        <nav className="bg-white border-b border-gray-200">
          <div className="flex justify-center px-6">
            <div className="flex items-center overflow-x-auto scrollbar-hide">
              {categories.map((root) => {
                const isLeaf = root.children.length === 0;
                const className = cn(
                  "relative px-4 py-3 text-base font-semibold whitespace-nowrap transition-colors cursor-pointer flex-shrink-0",
                  activeRootId === root.id
                    ? "text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                    : "text-gray-600 hover:text-black"
                );

                if (isLeaf) {
                  return (
                    <Link
                      key={root.id}
                      href={categoryHref(root.id)}
                      onMouseEnter={() => {
                        setActiveRootId(root.id);
                        setHoveredL2Id(null);
                      }}
                      onClick={closeMenus}
                      className={className}
                    >
                      {root.name}
                    </Link>
                  );
                }

                return (
                  <button
                    key={root.id}
                    onMouseEnter={() => {
                      setActiveRootId(root.id);
                      setHoveredL2Id(null);
                    }}
                    onClick={() => {
                      setActiveRootId((p) => (p === root.id ? null : root.id));
                      setHoveredL2Id(null);
                    }}
                    className={className}
                  >
                    {root.name}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Dropdown panel */}
        {activeRoot && activeRoot.children.length > 0 && (
          <div className="absolute left-0 top-full z-50 w-full bg-white shadow-xl border-t border-gray-100">
            <div className="max-w-6xl mx-auto flex">
              {/* L2 sidebar */}
              <div className="w-56 border-r border-gray-100 bg-gray-50/60 py-4">
                {/* "All" option */}
                <Link
                  href={categoryHref(activeRoot.id)}
                  onClick={closeMenus}
                  className="w-full flex items-center gap-3 px-4 py-2 text-base font-medium text-gray-500 hover:text-black hover:bg-white transition-colors"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span>All</span>
                </Link>

                <div className="mt-1 space-y-0.5 px-2">
                  {activeRoot.children.map((l2) => {
                    const isActive =
                      hoveredL2Id === l2.id ||
                      (!hoveredL2Id && activeL2?.id === l2.id);
                    const isLeaf = l2.children.length === 0;

                    const className = cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-base shadow-none rounded-none",
                      isActive
                        ? "text-black font-medium"
                        : "text-gray-600 hover:bg-white hover:text-black"
                    );

                    const iconClassName = cn(
                      "h-3.5 w-3.5 flex-shrink-0 opacity-50",
                      isActive && "opacity-100"
                    );

                    if (isLeaf) {
                      return (
                        <Link
                          key={l2.id}
                          href={categoryHref(l2.id)}
                          onMouseEnter={() => setHoveredL2Id(l2.id)}
                          onClick={closeMenus}
                          className={className}
                        >
                          <span>{l2.name}</span>
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={l2.id}
                        onMouseEnter={() => setHoveredL2Id(l2.id)}
                        className={className}
                      >
                        <span>{l2.name}</span>
                        <ChevronRight className={iconClassName} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* L3/L4 content panel */}
              <div className="flex-1 p-6">
                {activeL2 && activeL2.children.length > 0 ? (
                  <div>
                    {/* L2 name as section header, clickable */}
                    <Link
                      href={categoryHref(activeL2.id)}
                      onClick={closeMenus}
                      className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-black mb-4 block transition-colors"
                    >
                      {activeL2.name}
                    </Link>

                    <CollapsibleLeafList
                      items={activeL2.children}
                      onNavigate={closeMenus}
                    />
                  </div>
                ) : (
                  activeL2 && (
                    <div className="flex items-start pt-2">
                      <Link
                        href={categoryHref(activeL2.id)}
                        onClick={closeMenus}
                        className="text-sm text-gray-600 hover:text-black underline underline-offset-2 transition-colors"
                      >
                        Browse all {activeL2.name}
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Nav ──────────────────────────────────────────────────────── */}
      <div className="md:hidden">
        {/* Horizontal scroll pill tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-hide">
            {categories.map((root) => {
              const isLeaf = root.children.length === 0;
              const className = cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap border",
                mobileRootId === root.id && mobileOpen
                  ? "bg-black text-white border-black"
                  : "text-gray-700 border-gray-200 hover:border-gray-400"
              );

              if (isLeaf) {
                return (
                  <Link
                    key={root.id}
                    href={categoryHref(root.id)}
                    onClick={closeMenus}
                    className={className}
                  >
                    {root.name}
                  </Link>
                );
              }

              return (
                <button
                  key={root.id}
                  onClick={() => {
                    setMobileRootId((p) => (p === root.id ? null : root.id));
                    setMobileOpen(true);
                  }}
                  className={className}
                >
                  {root.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile dropdown sheet */}
        {mobileOpen && mobileRoot && (
          <div className="fixed inset-0 z-50 flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <span className="font-semibold text-base">{mobileRoot.name}</span>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setMobileRootId(null);
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* "All" root option */}
              <Link
                href={categoryHref(mobileRoot.id)}
                onClick={closeMenus}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 border-b border-gray-100"
              >
                <Grid3X3 className="h-4 w-4" />
                All {mobileRoot.name}
              </Link>

              <div className="p-3 space-y-1">
                {mobileRoot.children.map((child) => (
                  <MobileAccordionItem
                    key={child.id}
                    item={child}
                    depth={0}
                    onNavigate={closeMenus}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}