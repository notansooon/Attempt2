'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Bell,
  Brain,
  Settings,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/reminders', label: 'Reminders', icon: Bell },
  { href: '/insights', label: 'AI Insights', icon: Brain },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-primary-100 p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-secondary-800">Postpartum</h1>
          <p className="text-xs text-secondary-500">Navigator</p>
        </div>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'nav-link',
                isActive && 'nav-link-active'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="card bg-gradient-to-br from-calm-50 to-primary-50 border-0">
          <p className="text-sm text-secondary-600 text-center">
            You're doing amazing. One day at a time.
          </p>
        </div>
      </div>
    </nav>
  );
}
