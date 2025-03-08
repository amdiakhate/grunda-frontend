import {
  LayoutDashboard,
  Box,
  Users,
  Settings,
  FileText,
  Link2,
  LucideIcon,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const adminNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Materials', href: '/admin/materials', icon: Box },
  // { name: 'Product Materials', href: '/admin/product-materials', icon: Box },
  { name: 'Common Library', href: '/admin/material-mappings', icon: Link2 },
  { name: 'Products', href: '/admin/products', icon: FileText },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]; 