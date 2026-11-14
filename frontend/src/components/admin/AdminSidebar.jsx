import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  Boxes,
  BarChart3,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

const AdminSidebar = () => {
  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Manage Products', icon: Package, end: true },
    { to: '/admin/products/new', label: 'Add Product', icon: PlusCircle },
    { to: '/admin/categories', label: 'Manage Categories', icon: FolderTree },
    { to: '/admin/orders', label: 'Manage Orders', icon: ShoppingBag },
    { to: '/admin/users', label: 'Manage Customers', icon: Users },
    { to: '/admin/inventory', label: 'Inventory Management', icon: Boxes },
    { to: '/admin/reports', label: 'Sales Reports', icon: BarChart3 }
  ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-6 shrink-0 shadow-xs h-fit">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-900">Admin Console</h2>
          <p className="text-[11px] text-slate-400">ShopNova India Control</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Back to Store */}
      <div className="pt-4 border-t border-slate-100">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Customer Store</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
