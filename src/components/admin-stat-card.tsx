import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  isPositive?: boolean;
}

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  isPositive = true,
}: AdminStatCardProps) {
  return (
    <Card className="hover:border-zinc-700 transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-5">
        <CardTitle className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="p-2 rounded-xl bg-zinc-800/80 text-purple-400">
          {icon}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {value}
          </div>
          {trend && (
            <Badge variant={isPositive ? 'success' : 'destructive'}>
              {trend}
            </Badge>
          )}
        </div>

        {subtitle && (
          <p className="text-[11px] text-zinc-400 mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
