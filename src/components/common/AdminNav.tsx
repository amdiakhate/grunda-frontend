import {
  LayoutDashboard,
  Box,
  Users,
  Settings,
  FileText,
  LucideIcon,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const adminNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Materials', href: '/admin/materials', icon: Box },
  { name: 'Products', href: '/admin/products', icon: FileText },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]; 