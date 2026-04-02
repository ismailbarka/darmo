"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListTree, UserCog, LogOut } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    { name: "Categories", icon: <ListTree size={20} />, path: "/categories" },
    { name: "Providers", icon: <UserCog size={20} />, path: "/providers" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="Daro Logo"
            width={32}
            height={32}
            className="logo-icon"
          />
          <h1 className="logo gradient-text">Daro</h1>
        </div>
        <p className="logo-sub">Admin Panel</p>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`nav-item ${pathname === item.path ? "active" : ""}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
