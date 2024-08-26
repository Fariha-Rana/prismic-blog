import { slugifyHeading } from "@/lib/slugifyHeading";
import { clsx } from "clsx";

const TocNavElement = ({ node, children, level, activeId }) => {
  const id = slugifyHeading(node);

  return (
    <li
      className={clsx("list-disc transition-colors", {
        "pl-2": level === 1,
        "pl-4": level === 2,
        "text-slate-300": id !== activeId,
        "text-blue-700": id === activeId,
      })}>
      <a className="block text-slate-700" href={`#${id}`}>
        {children ? children : node.text}
      </a>
    </li>
  );
};

export default TocNavElement;
