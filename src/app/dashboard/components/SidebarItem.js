import Link from "next/link";

export default function SidebarItem({icon, text, href, target = "_self"}) {
    return (
        <Link href={href} target={target}>
          <div
          className="rounded-lg flex flex-row items-center bg-transparent hover:!bg-primary-400/70 duration-100 !text-white py-3 px-2">
            {icon}
            <p className="ml-3">{text}</p>
          </div>
        </Link>
    )
}