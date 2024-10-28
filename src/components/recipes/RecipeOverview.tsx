import React from 'react';
import { Book, Star, Beaker, TrendingUp } from 'lucide-react';
import MetricCard from '../MetricCard';

interface RecipeMetrics {
  totalRecipes: number;
  activeRecipes: number;
  experimentalRecipes: number;
  averageRating: number;
}

interface RecipeOverviewProps {
  metrics: RecipeMetrics;
}

function RecipeOverview({ metrics }: RecipeOverviewProps) {
  const overviewMetrics = [
    {
      title: 'Total Recipes',
      value: metrics.totalRecipes.toString(),
      icon: Book,
      subtitle: 'All recipes'
    },
    {
      title: 'Active Recipes',
      value: metrics.activeRecipes.toString(),
      icon: TrendingUp,
      subtitle: 'In production'
    },
    {
      title: 'Experimental',
      value: metrics.experimentalRecipes.toString(),
      icon: Beaker,
      subtitle: 'Under development'
    },
    {
      title: 'Average Rating',
      value: metrics.averageRating.toFixed(1),
      icon: Star,
      subtitle: 'Based on tasting notes'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewMetrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}

export default RecipeOverview;